const Room = require('../models/Room');
const Booking = require('../models/Booking');

const bookRoom = async (userId, roomId) => {
    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
        const err = new Error("Room not found");
        err.statusCode = 404;
        throw err;
    }

    if (!room.available) {
        const err = new Error("Room not available");
        err.statusCode = 400;
        throw err;
    }

    // Atomic update to avoid race conditions
    const updatedRoom = await Room.findOneAndUpdate(
        { _id: roomId, available: true },
        { $set: { available: false } },
        { new: true }
    );

    if (!updatedRoom) {
        const err = new Error("Room is no longer available");
        err.statusCode = 400;
        throw err;
    }

    // Create booking
    const booking = new Booking({
        user: userId,
        room: roomId,
        status: "confirmed"
    });

    await booking.save();
    return booking;
};

const getBookings = async (status) => {
    const filter = {};
    if (status) {
        filter.status = status;
    }

    const bookings = await Booking.find(filter).lean();

    return bookings.map(booking => ({
        id: booking._id.toString(),
        user: booking.user.toString(),
        room: booking.room.toString(),
        status: booking.status || "confirmed",
        createdAt: booking.createdAt ? booking.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
    }));
};

module.exports = {
    bookRoom,
    getBookings
};
