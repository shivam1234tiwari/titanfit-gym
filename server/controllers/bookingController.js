const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');

// Helper: Asynchronous Safe Email Sender function via Nodemailer
const sendBookingConfirmationEmail = async (userEmail, fullName, plan, date, time, goal) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
      }
    });

    const mailOptions = {
      from: `"TitanFit Gym" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: 'TitanFit Gym — Booking Confirmation 🏋️‍♂️',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 12px;">
          <h2 style="color: #f59e0b; text-align: center; margin-bottom: 5px;">TITANFIT GYM</h2>
          <p style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 0;">Session / Plan Booking Confirmation</p>
          
          <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
          
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Your free booking request has been successfully submitted to TitanFit Gym!</p>
          
          <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 6px 0;">📋 <strong>Selected Plan:</strong> ${plan}</p>
            <p style="margin: 6px 0;">📅 <strong>Preferred Date:</strong> ${date}</p>
            <p style="margin: 6px 0;">⏰ <strong>Preferred Time:</strong> ${time}</p>
            <p style="margin: 6px 0;">🎯 <strong>Fitness Goal:</strong> ${goal}</p>
            <p style="margin: 6px 0;">📌 <strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending Confirmation</span></p>
          </div>

          <p style="font-size: 13px; color: #cbd5e1;">Our team will review your schedule slot. You can check status updates anytime inside your TitanFit dashboard.</p>
          
          <br/>
          <p style="font-size: 12px; color: #64748b; text-align: center;">Stay consistent, push your limits! 🏋️‍♂️💪<br/>— Team TitanFit Gym</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error('Booking Email Delivery Error:', error.message);
    return { success: false, error: error.message };
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { fullName, email, phone, plan, preferredDate, preferredTime, fitnessGoal } = req.body;

    if (!fullName || !email || !phone || !preferredDate || !preferredTime || !fitnessGoal) {
      return res.status(400).json({ success: false, message: 'Sabhi fields fill karna zaroori hai.' });
    }

    const bookingPlan = plan || 'Free Trial';

    // 1. Create booking in MongoDB
    const booking = await Booking.create({
      fullName,
      email,
      phone,
      plan: bookingPlan,
      preferredDate,
      preferredTime,
      fitnessGoal
    });

    // 2. Trigger Email Confirmation (Non-blocking safe execution)
    void sendBookingConfirmationEmail(
      email.toLowerCase().trim(),
      fullName.trim(),
      bookingPlan,
      preferredDate,
      preferredTime,
      fitnessGoal
    );

    // 3. Immediate success response to frontend
    res.status(201).json({
      success: true,
      message: 'Booking successful! Confirmation email has been sent.',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};

// @desc    Update Booking Status & Admin Reply
// @route   PUT /api/bookings/:id
exports.updateBooking = async (req, res) => {
  try {
    const { status, adminReply } = req.body;

    // Dynamically build update object based on sent fields
    const updateFields = {};
    if (status) updateFields.status = status;
    if (adminReply !== undefined) updateFields.adminReply = adminReply;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record nahi mila.' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated success',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};