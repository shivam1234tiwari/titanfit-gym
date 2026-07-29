const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check API Key existence
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!genAI) {
      console.error('ERROR: GEMINI_API_KEY is missing in .env file!');
      return res.status(500).json({ success: false, reply: 'Server configuration error: GEMINI_API_KEY missing.' });
    }

    // Standard fast model selection
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are TITAN AI, an energetic personal fitness coach for TITANFIT Gym. 
Give an extreme short, energetic, and practical 2-line response in plain text.
User query: ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return res.json({ success: true, reply: responseText });
  } catch (error) {
    console.error('Gemini Execution Error:', error?.message || error);
    return res.status(500).json({
      success: false,
      reply: 'TITAN AI is currently recalibrating. Please try asking again in a second!'
    });
  }
});

module.exports = router;