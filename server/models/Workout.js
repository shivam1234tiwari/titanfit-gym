const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weightKg: { type: Number, required: true }
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutType: {
    type: String,
    enum: ['Chest & Triceps', 'Back & Biceps', 'Legs & Abs', 'Shoulders', 'Cardio / HIIT', 'Full Body'],
    required: true
  },
  exercises: [exerciseSchema],
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);