const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllMembers,
  updateMemberByAdmin
} = require('../controllers/authController');

// Import authentication & authorization middleware
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Standard Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Protected Admin-Only Routes
router.get('/members', protect, isAdmin, getAllMembers);
router.get('/admin/users', protect, isAdmin, getAllMembers);
router.put('/members/:id', protect, isAdmin, updateMemberByAdmin);
router.put('/admin/users/:id', protect, isAdmin, updateMemberByAdmin);

module.exports = router;