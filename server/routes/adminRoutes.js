const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  assignTrainerToUser,
  addTrainer,
  submitContactForm,
  getAllMessages
} = require('../controllers/authController');

// Admin Endpoints
router.get('/users', getAllUsers);
router.put('/assign-trainer', assignTrainerToUser);
router.post('/trainers', addTrainer);

// Contact / Consultation Messages Endpoints
router.post('/contact', submitContactForm);
router.get('/messages', getAllMessages);

module.exports = router;