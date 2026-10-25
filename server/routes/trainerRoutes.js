const express = require('express');
const router = express.Router();
const { getTrainers, sendMessage, getMessages } = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getTrainers);
router.post('/message', protect, sendMessage);
router.get('/messages/:trainerId', protect, getMessages);

module.exports = router;