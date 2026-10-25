const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  assignTrainerToUser,
  addTrainer
} = require('../controllers/authController');

// Admin Endpoints
router.get('/users', getAllUsers);
router.put('/assign-trainer', assignTrainerToUser);
router.post('/trainers', addTrainer);

module.exports = router;