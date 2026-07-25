const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name zaroori hai']
    },
    email: {
      type: String,
      required: [true, 'Email zaroori hai'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password zaroori hai'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    },
    // Gym Member Profile Fields
    activePlan: {
      type: String,
      default: 'Free Trial'
    },
    enrolledProgram: {
      type: String,
      default: 'General Fitness'
    },
    assignedTrainer: {
      type: String,
      default: 'Unassigned'
    },
    weightKg: {
      type: Number,
      default: 70
    },
    heightCm: {
      type: Number,
      default: 175
    },
    fitnessGoal: {
      type: String,
      default: 'Overall Fitness'
    },
    membershipStartDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);