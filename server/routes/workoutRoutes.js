const express = require('express');
const router = express.Router();
const { logWorkout, getUserWorkouts } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

// Add root route for /api/workouts
router.get('/', protect, getUserWorkouts);

router.post('/log', protect, logWorkout);
router.get('/history', protect, getUserWorkouts);

module.exports = router;