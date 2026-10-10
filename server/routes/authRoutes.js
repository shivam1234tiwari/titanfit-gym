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
  googleAuthCallback,
  uploadProfilePic
} = require('../controllers/authController');

const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Standard Authentication Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Multer Image Upload Route
router.post(
  '/upload-avatar', 
  protect, 
  upload.single('profilePic'), 
  uploadProfilePic
);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleAuthCallback
);

// Admin Routes
router.get('/users', protect, isAdmin, getAllMembers);
router.get('/members', protect, isAdmin, getAllMembers);
router.get('/admin/users', protect, isAdmin, getAllMembers);

router.put('/users/:id', protect, isAdmin, updateMemberByAdmin);
router.put('/members/:id', protect, isAdmin, updateMemberByAdmin);
router.put('/admin/users/:id', protect, isAdmin, updateMemberByAdmin);

module.exports = router;