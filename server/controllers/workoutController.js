const Workout = require('../models/Workout');

// Add Daily Workout
exports.logWorkout = async (req, res) => {
  try {
    const { workoutType, exercises } = req.body;

    if (!exercises || exercises.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add at least one exercise.' });
    }

    const workout = await Workout.create({
      user: req.user.id,
      workoutType,
      exercises
    });

    res.status(201).json({
      success: true,
      message: '🏋️ Workout logged successfully!',
      workout
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Workout History & Stats
exports.getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });

    // Analytics calculation for chart rendering
    const chartData = workouts.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      totalVolume: item.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weightKg), 0),
      exerciseCount: item.exercises.length
    })).reverse();

    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts,
      chartData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};