const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

    const prompt = `You are TITAN AI, an expert fitness and diet coach. User asks: ${message}`;
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

module.exports = router;