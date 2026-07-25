const Contact = require('../models/Contact');

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Sabhi fields fill karein.' });
    }
    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, message: 'Message submit ho gaya!', data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// 🆕 @desc Admin Replies to Contact Query
// @route PUT /api/contact/:id
exports.replyToContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { replyMessage, status: 'Replied' },
      { new: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Message nahi mila.' });
    res.status(200).json({ success: true, message: 'Reply bhej diya gaya hai!', data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};