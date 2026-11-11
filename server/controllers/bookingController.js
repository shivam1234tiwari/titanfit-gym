const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');

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

    // 1. Validate required fields
    if (!fullName || !email || !phone || !preferredDate || !preferredTime || !fitnessGoal) {
      return res.status(400).json({ success: false, message: 'Sabhi fields fill karna zaroori hai.' });
    }

    const bookingPlan = plan || 'Free Trial';

    // 2. Persist booking entry to MongoDB
    const booking = await Booking.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: String(phone).trim(),
      plan: bookingPlan,
      preferredDate,
      preferredTime,
      fitnessGoal
    });

    // 3. Return immediate success response to frontend (Fast UI feedback)
    res.status(201).json({
      success: true,
      message: 'Booking successful! Confirmation request processed.',
      data: booking
    });

    // 4. Trigger email delivery asynchronously AFTER sending HTTP response
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,               // SSL Port (Bypasses Render SMTP restrictions)
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASS
        },
        connectionTimeout: 8000  // 8 Seconds Connection Timeout Limit
      });

      transporter.sendMail({
        from: `"TitanFit Gym" <${process.env.GMAIL_USER}>`,
        to: email.toLowerCase().trim(),
        subject: 'TitanFit Gym — Booking Confirmation 🏋️‍♂️',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 12px;">
            <h2 style="color: #f59e0b; text-align: center; margin-bottom: 5px;">TITANFIT GYM</h2>
            <p style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 0;">Session / Plan Booking Confirmation</p>
            
            <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
            
            <p>Hello <strong>${fullName.trim()}</strong>,</p>
            <p>Your free booking request has been successfully received at TitanFit Gym!</p>
            
            <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 6px 0;">📋 <strong>Selected Plan:</strong> ${bookingPlan}</p>
              <p style="margin: 6px 0;">📅 <strong>Preferred Date:</strong> ${preferredDate}</p>
              <p style="margin: 6px 0;">⏰ <strong>Preferred Time:</strong> ${preferredTime}</p>
              <p style="margin: 6px 0;">🎯 <strong>Fitness Goal:</strong> ${fitnessGoal}</p>
              <p style="margin: 6px 0;">📌 <strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending Confirmation</span></p>
            </div>

            <p style="font-size: 13px; color: #cbd5e1;">Our desk team will review your time slot shortly.</p>
            
            <br/>
            <p style="font-size: 12px; color: #64748b; text-align: center;">Stay consistent, push your limits! 🏋️‍♂️💪<br/>— Team TitanFit Gym</p>
          </div>
        `
      }).catch(err => {
        console.error('Background Email Dispatch Warning (Ignored by Server):', err.message);
      });
    } else {
      console.warn('Skipping email delivery: GMAIL_USER or GMAIL_APP_PASS missing in env.');
    }

  } catch (error) {
    console.error('Booking Controller Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
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