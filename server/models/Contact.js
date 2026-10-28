const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phoneNumber: { type: String, default: '' },
    subject: { type: String, default: 'General Consultation' },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Replied'], default: 'Pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);