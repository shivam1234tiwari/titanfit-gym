const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const fs = require('fs');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// 1. Load Environment Configuration
dotenv.config();

// 2. Connect to MongoDB Atlas
const connectDB = require('./config/db');
connectDB();

// 3. Load Passport Configuration
require('./config/passport');

const app = express();

// 4. SECURITY ENHANCEMENT: Secure HTTP Headers
app.use(helmet());

// Ensure 'uploads' directory exists for profile photo storage
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 5. SECURITY ENHANCEMENT: Strict CORS Policy Setup
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://titanfit-gym.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS Security Policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parser Limits (Payload Size Protection)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. SECURITY ENHANCEMENT: Rate Limiting for Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Max 10 attempts per IP
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiter specifically to Login & Register endpoints
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Global General API Limiter (API Abuse Protection)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', apiLimiter);

// Serve uploaded profile pictures statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 7. Session & Passport Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'titanfit_session_secret_key',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 8. Core API Route Handlers
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));

app.get('/', (req, res) => {
  res.status(200).send('TitanFit Gym API Running Successfully with Hardened Security');
});

// Global 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Requested API Route Not Found'
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 TitanFit Server running on port ${PORT}`));