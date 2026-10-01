const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// ========================================================
// 1. TITAN AI CHATBOT ROUTE (/api/ai/chat)
// ========================================================
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        reply: "Server configuration error: GEMINI_API_KEY missing."
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        reply: "Please enter a message."
      });
    }

    // Initialize Generative AI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are TITAN AI, an expert fitness, gym, and nutrition coach. Answer concisely and professionally: ${message}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.json({
      success: true,
      reply: text
    });

  } catch (error) {
    console.error("DETAILED GEMINI ERROR:", error.message || error);
    return res.status(500).json({
      success: false,
      reply: `TITAN AI Error: ${error.message || 'API request failed'}`
    });
  }
});

// ========================================================
// 2. PERSONALIZED WORKOUT & DIET GENERATOR (/api/ai/generate-plan)
// ========================================================
router.post('/generate-plan', protect, async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY environment variable is missing."
      });
    }

    // Fetch user details from database using JWT auth
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found." });
    }

    const { dietaryPreference = 'Indian' } = req.body;
    const weight = user.weightKg || 70;
    const height = user.heightCm || 175;
    const goal = user.fitnessGoal || 'Overall Fitness';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an elite strength coach and sports nutritionist for TITANFIT Gym.
      Create a personalized weekly workout split and meal plan for:
      - Weight: ${weight} kg
      - Height: ${height} cm
      - Fitness Goal: ${goal}
      - Cuisine Preference: ${dietaryPreference}

      Return ONLY valid JSON matching this exact structure:
      {
        "dailyCalories": 2200,
        "macros": { "protein": "140g", "carbs": "220g", "fats": "60g" },
        "workoutSplit": [
          {
            "day": "Day 1 - Monday",
            "focus": "Push (Chest, Shoulders, Triceps)",
            "exercises": ["Incline Dumbbell Press - 4x10", "Overhead Press - 3x8", "Tricep Dips - 3x12"]
          },
          {
            "day": "Day 2 - Tuesday",
            "focus": "Pull (Back & Biceps)",
            "exercises": ["Lat Pulldowns - 4x10", "Barbell Rows - 3x8", "Hammer Curls - 3x12"]
          }
        ],
        "mealPlan": [
          { "meal": "Breakfast", "option": "Oatmeal with whey protein, chia seeds, and almonds" },
          { "meal": "Lunch", "option": "Paneer/Chicken tikka with brown rice and mixed green salad" },
          { "meal": "Dinner", "option": "Grilled protein with sautéed vegetables and 1 roti" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    const jsonPlan = JSON.parse(textResponse);

    return res.status(200).json({
      success: true,
      data: jsonPlan
    });

  } catch (error) {
    console.error("AI GENERATOR ERROR:", error.message || error);
    return res.status(500).json({
      success: false,
      message: `Failed to generate plan: ${error.message || 'API Error'}`
    });
  }
});

module.exports = router;