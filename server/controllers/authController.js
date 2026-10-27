const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sendEmail = require('../utils/sendEmail');
const {
  welcomeEmailTemplate,
  planActivatedTemplate
} = require('../utils/emailTemplates');

// Helper: Generate JWT Token
const generateToken = (id, role = 'member') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'titanfit_secret_key',
    { expiresIn: '30d' }
  );
};

// Helper: Send email without failing the main request
const sendEmailSafely = async (options) => {
  try {
    await sendEmail(options);
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 */
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      weight,
      height
    } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // 2. Validate email
    const formattedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formattedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // 3. Validate Indian mobile number
    const formattedPhone = String(phoneNumber).trim();
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(formattedPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      });
    }

    // 4. Validate password length
    if (password.length < 6 || password.length > 16) {
      return res.status(400).json({
        success: false,
        message: 'Password must be between 6 and 16 characters long'
      });
    }

    // 5. Check duplicate email or phone
    const existingUser = await User.findOne({
      $or: [
        { email: formattedEmail },
        { phoneNumber: formattedPhone }
      ]
    });

    if (existingUser) {
      const field =
        existingUser.email === formattedEmail
          ? 'Email'
          : 'Phone number';

      return res.status(400).json({
        success: false,
        message: `${field} is already registered`
      });
    }

    // 6. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7. Create user
    const user = await User.create({
      name: name.trim(),
      email: formattedEmail,
      phoneNumber: formattedPhone,
      password: hashedPassword,
      weight: weight || '',
      height: height || ''
    });

    // 8. Send welcome email
    void sendEmailSafely({
      to: user.email,
      subject: 'Welcome to TitanFit Gym! 🏋️‍♂️',
      html: welcomeEmailTemplate(user.name)
    });

    // 9. Return registration response
    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token: generateToken(user._id, user.role || 'member'),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        weight: user.weight,
        height: user.height,
        role: user.role || 'member'
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc Authenticate user and login
 * @route POST /api/auth/login
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const formattedEmail = String(email || '')
      .toLowerCase()
      .trim();

    const user = await User.findOne({ email: formattedEmail });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(
      password || '',
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(
      user._id,
      user.role || 'member'
    );

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'member',
        phoneNumber: user.phoneNumber,
        weight: user.weight,
        height: user.height,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Login Error:', error);

    return res.status(500).json({
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Helper: Generate diet plan based on fitness goal
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
 * @desc Get current user profile with diet plan
 * @route GET /api/auth/profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('assignedTrainer');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const dietPlan = generateDietPlan(user.goal || 'Maintenance');

    return res.status(200).json({
      success: true,
      user,
      dietPlan
    });
  } catch (error) {
    console.error('Get Profile Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc Update user profile, metrics, goal and membership plan
 * @route PUT /api/auth/profile
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.name = req.body.name || user.name;
    user.weight = req.body.weight || user.weight;
    user.height = req.body.height || user.height;
    user.goal = req.body.goal || user.goal;

    if (req.body.profilePic !== undefined) {
      user.profilePic = req.body.profilePic;
    }

    if (req.body.phoneNumber) {
      user.phoneNumber = req.body.phoneNumber;
    }

    const requestedPlan = req.body.membershipPlan;
    const previousPlan = user.membershipPlan;

    if (requestedPlan) {
      user.membershipPlan = requestedPlan;
    }

    const updatedUser = await user.save();

    if (requestedPlan && requestedPlan !== previousPlan) {
      void sendEmailSafely({
        to: updatedUser.email,
        subject: 'Your TitanFit Membership is Active!',
        html: planActivatedTemplate(
          updatedUser.name,
          updatedUser.membershipPlan
        )
      });
    }

    const dietPlan = generateDietPlan(updatedUser.goal || 'Maintenance');

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        weight: updatedUser.weight,
        height: updatedUser.height,
        goal: updatedUser.goal,
        profilePic: updatedUser.profilePic,
        role: updatedUser.role,
        membershipPlan: updatedUser.membershipPlan
      },
      dietPlan
    });
  } catch (error) {
    console.error('Update Profile Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc Upload user profile picture
 * @route POST /api/auth/upload-avatar
 * @access Private
 */
exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.profilePic = imagePath;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePic: imagePath
    });
  } catch (error) {
    console.error('Upload Profile Picture Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc Google OAuth callback
 * @route GET /api/auth/google/callback
 */
exports.googleAuthCallback = async (req, res) => {
  try {
    const token = generateToken(
      req.user._id,
      req.user.role || 'member'
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    return res.redirect(
      `${frontendUrl}?token=${encodeURIComponent(token)}`
    );
  } catch (error) {
    console.error('Google Auth Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Google Auth Failed'
    });
  }
};

/**
 * @desc Get all members (Legacy/General)
 * @route GET /api/auth/members
 */
exports.getAllMembers = async (req, res) => {
  try {
    const members = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users: members,
      data: members
    });
  } catch (error) {
    console.error('Get Members Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc Update member by admin
 * @route PUT /api/auth/members/:id
 */
exports.updateMemberByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.weight = req.body.weight || user.weight;
    user.height = req.body.height || user.height;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Admin Update Member Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ==========================================================================
   ADMIN CONTROLLERS (MAPPED TO /api/admin ROUTES)
   ========================================================================== */

/**
 * @desc Get all registered members with populated assigned trainers for Admin
 * @route GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    let usersQuery = User.find({}).select('-password').sort({ createdAt: -1 });

    try {
      usersQuery = usersQuery.populate('assignedTrainer');
    } catch (popErr) {
      console.warn('Skipping assignedTrainer populate:', popErr.message);
    }

    const users = await usersQuery;

    return res.status(200).json({
      success: true,
      users: users,
      data: users,
      members: users
    });
  } catch (error) {
    console.error('Admin Get Users Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc Assign or re-assign personal trainer to a member
 * @route PUT /api/admin/assign-trainer
 */
exports.assignTrainerToUser = async (req, res) => {
  try {
    const { userId, trainerId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { assignedTrainer: trainerId || null },
      { new: true }
    )
      .select('-password')
      .populate('assignedTrainer');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Trainer assigned successfully!',
      user: updatedUser
    });
  } catch (error) {
    console.error('Assign Trainer Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc Add new trainer profile from Admin panel
 * @route POST /api/admin/trainers
 */
exports.addTrainer = async (req, res) => {
  try {
    const Trainer = require('../models/Trainer');
    const newTrainer = await Trainer.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Trainer profile created successfully',
      trainer: newTrainer
    });
  } catch (error) {
    console.error('Admin Add Trainer Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};