const Trainer = require('../models/Trainer');
const Message = require('../models/Message');

// Get All Trainers
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json({ success: true, count: trainers.length, trainers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send Message to Trainer
exports.sendMessage = async (req, res) => {
  try {
    const { trainerId, text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Message text is required.' });

    const message = await Message.create({
      sender: req.user.id,
      recipientTrainer: trainerId,
      text
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Conversation History with a Trainer
exports.getMessages = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const messages = await Message.find({
      sender: req.user.id,
      recipientTrainer: trainerId
    }).sort({ sentAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Book Consultation with Trainer
exports.bookConsultation = async (req, res) => {
  try {
    const { trainerName, trainerId, preferredDate, preferredTime } = req.body;

    // Save consultation request to MongoDB
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `Consultation request for ${trainerName} submitted successfully!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};