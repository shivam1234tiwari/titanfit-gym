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
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);