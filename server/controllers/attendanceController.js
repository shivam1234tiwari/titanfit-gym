const User = require('../models/User');

// Mark Attendance by Admin Scanning / Entering User ID
exports.markAttendance = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid QR Code / User not found.' });
    }

    // Check if member has an active plan
    if (!user.activePlan || user.activePlan === 'Free Trial') {
      return res.status(400).json({
        success: false,
        message: `Member ${user.name} does not have an active membership plan.`
      });
    }

    // Push new check-in timestamp
    user.attendanceLogs.push({ checkInTime: new Date() });
    await user.save();

    res.status(200).json({
      success: true,
      message: `✅ Check-in successful for ${user.name}!`,
      user: {
        name: user.name,
        activePlan: user.activePlan,
        totalCheckIns: user.attendanceLogs.length,
        lastCheckIn: user.attendanceLogs[user.attendanceLogs.length - 1].checkInTime
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};