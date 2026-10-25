const express = require('express');
const router = express.Router();
const { markAttendance } = require('../controllers/attendanceController');

// Check-in API (Call from Admin Dashboard)
router.post('/checkin', markAttendance);

module.exports = router;