// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phoneNumber: { 
    type: String, 
    required: true, 
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit mobile number']
  },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  weight: { type: String, default: '' },
  height: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  goal: { 
    type: String, 
    enum: ['Weight Loss', 'Muscle Gain', 'Maintenance'], 
    default: 'Maintenance' 
  },
  membershipPlan: { type: String, default: 'Free Trial' },

  // ADD THIS FIELD TO PREVENT POPULATE CRASH
  assignedTrainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    default: null
  },

  attendanceLogs: [
    {
      checkInTime: { type: Date, default: Date.now },
      verifiedBy: { type: String, default: 'Admin Desk' }
    }
  ],
  enrolledPrograms: [
    {
      programId: String,
      programTitle: String,
      category: String,
      enrolledAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);