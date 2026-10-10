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

    // 1. Mandatory Fields Check
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields' 
      });
    }

    // 2. Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    // 3. Indian 10-Digit Mobile Number Validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid 10-digit mobile number' 
      });
    }

    // 4. Password Length Check (Min 6, Max 16 characters)
    if (password.length < 6 || password.length > 16) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be between 6 and 16 characters long' 
      });
    }

    // 5. Check Duplicate Email or Phone Number
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

    // 6. Hash Password & Create User
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
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'titanfit_secret_key',
      { expiresIn: '30d' }
    );

    // Ensure role is explicitly passed in user object!
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'member', // <--- REQUIRED FOR ADMIN ACCESS
        phoneNumber: user.phoneNumber,
        weight: user.weight,
        height: user.height,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Helper to generate diet plan based on fitness goals
const generateDietPlan = (goal) => {
  switch (goal) {
    case 'Weight Loss':
      return {
        calories: '1,800 - 2,000 kcal/day',
        macros: { protein: '35%', carbs: '35%', fats: '30%' },
        breakfast: 'Oatmeal with chia seeds, berries, and 1 scoop whey protein',
        lunch: 'Grilled chicken breast / Tofu with quinoa and green salad',
        snack: 'Handful of almonds and green tea',
        dinner: 'Baked fish / Paneer tikka with steamed broccoli & lentils'
      };
    case 'Muscle Gain':
      return {
        calories: '2,800 - 3,200 kcal/day',
        macros: { protein: '40%', carbs: '40%', fats: '20%' },
        breakfast: '4 whole eggs, 2 whole-wheat toasts, and a banana peanut butter smoothie',
        lunch: 'Brown rice, double chicken breast / Soya chunks curry, and veggies',
        snack: 'Greek yogurt with nuts, honey, and rice cakes',
        dinner: 'Lean steak / Cottage cheese with sweet potatoes and asparagus'
      };
    case 'Maintenance':
    default:
      return {
        calories: '2,200 - 2,400 kcal/day',
        macros: { protein: '30%', carbs: '45%', fats: '25%' },
        breakfast: 'Vegetable omelet / Besan chilla with fresh fruit juice',
        lunch: 'Balanced Thali: Whole wheat chapati, dal, mixed vegetable, and salad',
        snack: 'Roasted chickpeas / Protein bar',
        dinner: 'Grilled salmon / Tofu with brown rice and soup'
      };
  }
};

/**
 * @desc    Get Current User Profile with Diet Plan
 * @route   GET /api/auth/profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const dietPlan = generateDietPlan(user.goal || 'Maintenance');

    res.status(200).json({
      success: true,
      user,
      dietPlan
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update User Profile (Goal, Metrics, Profile Photo)
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
    user.goal = req.body.goal || user.goal;
    user.profilePic = req.body.profilePic !== undefined ? req.body.profilePic : user.profilePic;

    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;

    const updatedUser = await user.save();
    const dietPlan = generateDietPlan(updatedUser.goal);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        weight: updatedUser.weight,
        height: updatedUser.height,
        goal: updatedUser.goal,
        profilePic: updatedUser.profilePic,
        role: updatedUser.role
      },
      dietPlan
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Upload User Profile Picture
 * @route   POST /api/auth/upload-avatar
 * @access  Private
 */
exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    // Construct image URL (e.g. /uploads/profilePic-1728551234567.jpg)
    const imagePath = `/uploads/${req.file.filename}`;

    // Update user profile record in database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.profilePic = imagePath;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePic: imagePath
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