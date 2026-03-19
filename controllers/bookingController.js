const bookingService = require('../services/bookingService');

const createBooking = async (req, res, next) => {
    try {
        const { userId, roomId } = req.body;
        const booking = await bookingService.bookRoom(userId, roomId);
        return res.status(200).json({ message: "Booking successful", booking });
    } catch (error) {
        next(error);
    }
};

const getBookingsList = async (req, res, next) => {
    try {
        const { status } = req.query;
        const formattedBookings = await bookingService.getBookings(status);
        return res.status(200).json(formattedBookings);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getBookingsList
};
