const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, weight, height } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid 10-digit mobile number' 
      });
    }

    const formattedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ 
      $or: [{ email: formattedEmail }, { phoneNumber: phoneNumber.trim() }] 
    });

    if (existingUser) {
      const field = existingUser.email === formattedEmail ? 'Email' : 'Phone number';
      return res.status(400).json({ 
        success: false, 
        message: `${field} is already registered` 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: formattedEmail,
      phoneNumber: phoneNumber.trim(),
      password: hashedPassword,
      weight: weight || '',
      height: height || ''
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        weight: user.weight,
        height: user.height
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Authenticate User & Login
 * @route   POST /api/auth/login
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        weight: user.weight,
        height: user.height
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get Current User Profile
 * @route   GET /api/auth/profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update User Profile
 * @route   PUT /api/auth/profile
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.weight = req.body.weight || user.weight;
    user.height = req.body.height || user.height;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        weight: updatedUser.weight,
        height: updatedUser.height
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Google OAuth Callback Handler
 * @route   GET /api/auth/google/callback
 */
exports.googleAuthCallback = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    // Redirect to frontend dashboard with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}?token=${token}`);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Google Auth Failed' });
  }
};

/**
 * @desc    Get All Members (Admin Route)
 * @route   GET /api/auth/members
 */
exports.getAllMembers = async (req, res) => {
  try {
    const members = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update Member by Admin
 * @route   PUT /api/auth/members/:id
 */
exports.updateMemberByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.weight = req.body.weight || user.weight;
    user.height = req.body.height || user.height;

    const updatedUser = await user.save();
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};