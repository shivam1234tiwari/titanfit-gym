const express = require('express');
const router = express.Router();
const Expert = require('../models/Expert');

// 1. GET: Fetch all experts from MongoDB
router.get('/experts', async (req, res) => {
  try {
    const experts = await Expert.find().sort({ createdAt: -1 });
    res.json({ success: true, experts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch experts from DB' });
  }
});

// 2. POST: Add a new expert (For Admin Panel)
router.post('/experts', async (req, res) => {
  try {
    const { name, role, exp, bio, image } = req.body;
    const newExpert = new Expert({ name, role, exp, bio, image });
    await newExpert.save();
    res.status(201).json({ success: true, expert: newExpert });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving expert to DB' });
  }
});

module.exports = router;