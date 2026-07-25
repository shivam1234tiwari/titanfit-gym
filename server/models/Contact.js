const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    replyMessage: { type: String, default: '' }, // 👈 Admin ka reply
    status: { type: String, enum: ['New', 'Replied'], default: 'New' } // 👈 Status
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);