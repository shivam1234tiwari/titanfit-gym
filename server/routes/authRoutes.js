const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllMembers,          // 👈 Added
  updateMemberByAdmin     // 👈 Added
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin Specific Routes
router.get('/members', getAllMembers);
router.put('/members/:id', updateMemberByAdmin);

module.exports = router;