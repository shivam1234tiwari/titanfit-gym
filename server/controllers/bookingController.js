const Booking = require('../models/Booking');

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

    const booking = await Booking.create({
      fullName,
      email,
      phone,
      plan: plan || 'Free Trial',
      preferredDate,
      preferredTime,
      fitnessGoal
    });

    res.status(201).json({
      success: true,
      message: 'Booking successful!',
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