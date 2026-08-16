const express = require('express');
const passport = require('passport');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllMembers,
  updateMemberByAdmin,
  googleAuthCallback
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Standard Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleAuthCallback
);

// Admin Routes
router.get('/members', getAllMembers);
router.put('/members/:id', updateMemberByAdmin);

module.exports = router;