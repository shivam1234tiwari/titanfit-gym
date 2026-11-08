const express = require('express');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllMembers,
  updateMemberByAdmin,
  googleAuthCallback,
  uploadProfilePic,
  sendOtp,
  verifyOtp
} = require('../controllers/authController');

const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ---------------- RATE LIMITERS SETUP ----------------

// Strict Limiter: For OTP generation & verification (Brute-force protection)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 5,                   // Max 5 OTP requests per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests from this IP. Please try again after 15 minutes.'
  }
});

// Auth Limiter: For Login & Registration routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 10,                  // Max 10 attempts per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

// ---------------- ROUTES ----------------

// Standard Authentication Routes (Rate-limited)
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Resend OTP Routes (Strictly Rate-limited)
router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', otpLimiter, verifyOtp);

// Multer Image Upload Route
router.post(
  '/upload-avatar', 
  protect, 
  upload.single('profilePic'), 
  uploadProfilePic
);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback Route
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${FRONTEND_URL}/login?error=google_auth_failed` 
  }),
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