const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getBookings, 
  updateBooking 
} = require('../controllers/bookingController');

// GET all & POST new booking
router.route('/')
  .get(getBookings)
  .post(createBooking);

// PUT update status/reply by ID 👈 (Yeh line zaroori hai)
router.route('/:id')
  .put(updateBooking);

module.exports = router;