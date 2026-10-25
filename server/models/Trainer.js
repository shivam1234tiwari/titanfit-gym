const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true }, // e.g., Bodybuilding, HIIT, Yoga
  experienceYears: { type: Number, required: true },
  rating: { type: Number, default: 4.9 },
  image: { type: String, default: '' },
  bio: { type: String },
  availableSlots: [{ type: String }] // e.g., ['08:00 AM', '05:00 PM']
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);