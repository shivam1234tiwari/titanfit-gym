const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const path = require('path'); // Required for static uploads directory
const fs = require('fs');

// 1. Load Environment Configuration
dotenv.config();

// 2. Connect to MongoDB Atlas
const connectDB = require('./config/db');
connectDB();

// 3. Load Passport Configuration
require('./config/passport');

const app = express();

// Ensure 'uploads' directory exists for profile photo storage
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS Policy
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://titanfit-gym.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Serve uploaded profile pictures statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Session & Passport Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'titanfit_session_secret_key',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Route Handlers
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', authRoutes); // Aliased admin routes (/api/admin/users)
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/', (req, res) => {
  res.send('TitanFit Gym API Running Successfully');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));