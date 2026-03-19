const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBookingRequest } = require('../validators/bookingValidator');

// Task 1: Book a room
router.post('/book-room', validateBookingRequest, bookingController.createBooking);

// Task 2: Get bookings with optional query filter
router.get('/bookings', bookingController.getBookingsList);

module.exports = router;
