const { GoogleGenAI } = require('@google/genai');
const User = require('../models/User');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = 'gemini-2.5-flash';

const FITNESS_SYSTEM_INSTRUCTION = `
You are TITAN AI, the friendly and knowledgeable fitness assistant for TitanFit.

Your responsibilities:
- Explain workout techniques, exercise selection, training splits, and recovery.
- Provide practical nutrition guidance, including Indian vegetarian and non-vegetarian foods.
- Help users understand muscle gain, fat loss, strength, and general fitness.
- Personalize advice using profile information when provided.
- Ask a brief clarifying question when essential information is missing.
- Use clear headings, short paragraphs, and bullet points when useful.
- Give realistic, sustainable recommendations rather than extreme promises.
- Do not invent user profile information or claim to have accessed data you were not given.
- Do not diagnose medical conditions or prescribe treatments.
- For injuries, concerning symptoms, eating disorders, or medical dietary needs, recommend appropriate professional care.
- Never recommend dangerous dehydration, starvation, or unsafe performance-enhancing drug use.
- Do not claim to be a human trainer or doctor.

Keep answers helpful and conversational. Match the user's level of experience.
`;

// @desc    Chat with TITAN AI using recent conversation history
// @route   POST /api/ai/chat
// @access  Private
exports.chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a message.',
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be 2000 characters or fewer.',
      });
    }

    // Only accept a small, validated conversation history.
    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              ['user', 'assistant'].includes(item.role) &&
              typeof item.content === 'string' &&
              item.content.trim().length > 0
          )
          .slice(-12)
          .map((item) => ({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content.slice(0, 2000) }],
          }))
      : [];

    // Avoid sending the current user message twice.
    const lastMessage = safeHistory[safeHistory.length - 1];

    if (
      lastMessage?.role === 'user' &&
      lastMessage.parts[0].text.trim() === message.trim()
    ) {
      safeHistory.pop();
    }

    // Optional personalization from the authenticated user's profile.
    let profileContext = 'No saved user fitness profile is available.';

    if (req.user?.id) {
      try {
        const user = await User.findById(req.user.id)
          .select('fitnessGoal weightKg heightCm activePlan membershipPlan')
          .lean();

        if (user) {
          profileContext = [
            `Fitness goal: ${user.fitnessGoal || 'Not specified'}`,
            `Weight: ${
              Number.isFinite(user.weightKg) ? `${user.weightKg} kg` : 'Not specified'
            }`,
            `Height: ${
              Number.isFinite(user.heightCm) ? `${user.heightCm} cm` : 'Not specified'
            }`,
            `Membership: ${user.activePlan || user.membershipPlan || 'Not specified'}`,
          ].join('\n');
        }
      } catch (profileError) {
        // Chat can still work when profile lookup fails.
        console.error('TITAN AI profile lookup failed:', profileError.message);
      }
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        ...safeHistory,
        {
          role: 'user',
          parts: [
            {
              text: `Current user profile:\n${profileContext}\n\nUser message:\n${message.trim()}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: FITNESS_SYSTEM_INSTRUCTION,
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const reply = response.text?.trim();

    if (!reply) {
      return res.status(502).json({
        success: false,
        message: 'TITAN AI could not generate a response. Please try again.',
      });
    }

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('TITAN AI Chat Error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'TITAN AI is temporarily unavailable. Please try again shortly.',
    });
  }
};

// @desc    Generate personalized workout and diet plan
// @route   POST /api/ai/generate-plan
// @access  Private
exports.generatePersonalizedPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      weightKg = 70,
      heightCm = 175,
      fitnessGoal = 'Overall Fitness',
    } = user;

    const {
      planType = 'both',
      dietaryPreference = 'Indian',
    } = req.body;

    const bmi =
      Number(weightKg) > 0 && Number(heightCm) > 0
        ? (Number(weightKg) / (Number(heightCm) / 100) ** 2).toFixed(1)
        : null;

    const prompt = `
Create a practical fitness plan using the following information:

Weight: ${weightKg} kg
Height: ${heightCm} cm
BMI (calculated): ${bmi ?? 'Unavailable'}
Fitness goal: ${fitnessGoal}
Cuisine preference: ${dietaryPreference}
Requested plan: ${planType}

Return valid JSON with this structure:
{
  "bmi": "${bmi ?? 'Unavailable'}",
  "dailyCalories": null,
  "macros": {
    "protein": "Personalized estimate",
    "carbs": "Personalized estimate",
    "fats": "Personalized estimate"
  },
  "workoutSplit": [
    {
      "day": "Day 1",
      "focus": "Workout focus",
      "exercises": ["Exercise - sets x reps"]
    }
  ],
  "mealPlan": [
    {
      "meal": "Breakfast",
      "option": "Example meal"
    }
  ]
}

Requirements:
- Generate only the requested sections for planType: workout, diet, or both.
- For unrequested sections, return an empty array.
- Provide realistic beginner-friendly options when training experience is unknown.
- Use foods that fit the stated cuisine preference.
- Do not assume age, sex, activity level, allergies, or medical history.
- If essential information for estimating calories is missing, use null for dailyCalories and explain the limitation in a "notes" field.
- Treat calorie and macro figures as estimates, not medical prescriptions.
- Include a "notes" field with brief safety and personalization limitations.
- Return JSON only.
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    let generatedData;

    try {
      generatedData = JSON.parse(response.text);
    } catch {
      return res.status(502).json({
        success: false,
        message: 'The AI returned an invalid plan. Please try again.',
      });
    }

    return res.status(200).json({
      success: true,
      data: generatedData,
    });
  } catch (error) {
    console.error('AI Plan Generator Error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to generate your fitness plan.',
    });
  }
};