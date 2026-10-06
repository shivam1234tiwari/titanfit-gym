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
 * @desc    Register a new user with Phone Number validation
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // 1. Mandatory Fields Check
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all fields (Name, Email, Phone Number, Password)' 
      });
    }

    // 2. Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    // 3. Indian / Standard 10-Digit Mobile Number Validation (Starts with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9' 
      });
    }

    // 4. Password Strength Check
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // 5. Check if User / Email / Phone Number Already Exists
    const formattedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ 
      $or: [{ email: formattedEmail }, { phoneNumber: phoneNumber.trim() }] 
    });

    if (existingUser) {
      const duplicateField = existingUser.email === formattedEmail ? 'Email address' : 'Phone number';
      return res.status(400).json({ 
        success: false, 
        message: `${duplicateField} is already registered with another account` 
      });
    }

    // 6. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7. Create New User in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: formattedEmail,
      phoneNumber: phoneNumber.trim(),
      password: hashedPassword
    });

    // 8. Send Response with Token
    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data received' });
    }

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during registration' 
    });
  }
};

/**
 * @desc    Authenticate User & Login
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide both email and password' 
      });
    }

    // Find User by Email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare Hashed Password
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
        phoneNumber: user.phoneNumber
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during login' 
    });
  }
};

/**
 * @desc    Get Current Logged In User Profile
 * @route   GET /api/auth/me
 * @access  Private (Requires Middleware Token)
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};