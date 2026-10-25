const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware'); // Verify JWT middleware

/**
 * @desc Enroll user into a fitness program
 * @route POST /api/programs/enroll
 * @access Private
 */
router.post('/enroll', protect, async (req, res) => {
  try {
    const { programId, programTitle, category } = req.body;

    if (!programId || !programTitle) {
      return res.status(400).json({
        success: false,
        message: 'Program details are missing.',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    // Initialize enrolledPrograms array if it doesn't exist
    if (!user.enrolledPrograms) {
      user.enrolledPrograms = [];
    }

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledPrograms.some(
      (p) => p.programId === programId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: `You are already enrolled in ${programTitle}!`,
      });
    }

    // Add program to user array
    user.enrolledPrograms.push({
      programId,
      programTitle,
      category,
      enrolledAt: new Date(),
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: `You're enrolled in ${programTitle}!`,
      enrolledPrograms: user.enrolledPrograms,
    });
  } catch (error) {
    console.error('Program Enrollment Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during program enrollment.',
      error: error.message,
    });
  }
});

module.exports = router;