import rateLimit from 'express-rate-limit';

// OTP & Login routes ke liye strict rate limit (Brute-force protection)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,                   
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts from this IP. Please try again after 15 minutes.'
  }
});

// General APIs ke liye standard rate limit
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100,                
  standardHeaders: true,
  legacyHeaders: false
});