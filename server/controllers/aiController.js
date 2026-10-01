const { GoogleGenAI } = require('@google/genai');
const User = require('../models/User');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generate personalized workout split & diet plan
// @route   POST /api/ai/generate-plan
// @access  Private
exports.generatePersonalizedPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { weightKg = 70, heightCm = 175, fitnessGoal = 'Overall Fitness' } = user;
    const { planType = 'both', dietaryPreference = 'Indian' } = req.body;

    const prompt = `
      Act as an elite strength coach and sports nutritionist.
      Generate a customized plan for a client with the following metrics:
      - Weight: ${weightKg} kg
      - Height: ${heightCm} cm
      - Fitness Goal: ${fitnessGoal}
      - Preference: ${dietaryPreference} Cuisine
      
      Respond in strictly valid JSON format matching this schema:
      {
        "bmi": "calculated BMI value",
        "dailyCalories": 2200,
        "macros": { "protein": "140g", "carbs": "220g", "fats": "60g" },
        "workoutSplit": [
          { "day": "Day 1 - Monday", "focus": "Push (Chest, Shoulders, Triceps)", "exercises": ["Bench Press - 4x8", "Overhead Press - 3x10", "Dips - 3x12"] }
        ],
        "mealPlan": [
          { "meal": "Breakfast", "option": "Oats with whey protein and almonds" }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const generatedData = JSON.parse(response.text);

    res.status(200).json({
      success: true,
      data: generatedData,
    });
  } catch (error) {
    console.error('AI Generator Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate plan: ' + error.message });
  }
};