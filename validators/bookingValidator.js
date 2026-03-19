const mongoose = require('mongoose');

const validateBookingRequest = (req, res, next) => {
    const { userId, roomId } = req.body;

    if (!userId || typeof userId !== 'string') {
        const err = new Error("userId is required and must be a valid string");
        err.statusCode = 400;
        return next(err);
    }

    if (!roomId || typeof roomId !== 'string') {
        const err = new Error("roomId is required and must be a valid string");
        err.statusCode = 400;
        return next(err);
    }

    // Optional: Check if they are valid ObjectIds to prevent CastError later
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const err = new Error("Invalid userId format");
        err.statusCode = 400;
        return next(err);
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        const err = new Error("Invalid roomId format");
        err.statusCode = 400;
        return next(err);
    }

    next();
};

module.exports = { validateBookingRequest };
