const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper Function: JWT Token Generate
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123key', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, fitnessGoal, weightKg, heightCm } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      fitnessGoal: fitnessGoal || 'Overall Fitness',
      weightKg: weightKg || 70,
      heightCm: heightCm || 175
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        activePlan: user.activePlan,
        enrolledProgram: user.enrolledProgram
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        activePlan: user.activePlan,
        enrolledProgram: user.enrolledProgram
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private (Needs Bearer Token)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};

// @desc    Update user fitness stats & profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, weightKg, heightCm, fitnessGoal, activePlan, enrolledProgram } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = name || user.name;
    user.weightKg = weightKg || user.weightKg;
    user.heightCm = heightCm || user.heightCm;
    user.fitnessGoal = fitnessGoal || user.fitnessGoal;
    user.activePlan = activePlan || user.activePlan;
    user.enrolledProgram = enrolledProgram || user.enrolledProgram;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        activePlan: updatedUser.activePlan,
        enrolledProgram: updatedUser.enrolledProgram,
        weightKg: updatedUser.weightKg,
        heightCm: updatedUser.heightCm,
        fitnessGoal: updatedUser.fitnessGoal
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};