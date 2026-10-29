import axios from 'axios';
import { API_BASE_URL } from '../config'; // Ensure path matching with your config.js location

const AUTH_API_URL = `${API_BASE_URL}/api/auth`;

/**
 * Send Email OTP via Resend API
 * @param {string} email 
 */
export const sendOtp = async (email) => {
  const response = await axios.post(`${AUTH_API_URL}/send-otp`, { email });
  return response.data;
};

/**
 * Verify Email OTP
 * @param {string} email 
 * @param {string} otp 
 */
export const verifyOtp = async (email, otp) => {
  const response = await axios.post(`${AUTH_API_URL}/verify-otp`, { email, otp });
  return response.data;
};

/**
 * User Registration API
 */
export const registerUser = async (userData) => {
  const response = await axios.post(`${AUTH_API_URL}/register`, userData);
  return response.data;
};

/**
 * User Login API
 */
export const loginUser = async (credentials) => {
  const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
  return response.data;
};