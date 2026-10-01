const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');

// 1. Env config load sabse upar hona chahiye
dotenv.config();

// 2. MongoDB connect
const connectDB = require('./config/db');
connectDB();

// 3. Google Passport strategy configuration load karein
require('./config/passport');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://titanfit-gym.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

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

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/', (req, res) => {
  res.send('Gym Website API with Auth Running...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));