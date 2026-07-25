const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    plan: { type: String, default: 'Free Trial' },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    fitnessGoal: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    adminReply: { type: String, default: '' } // 👈 New field
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);