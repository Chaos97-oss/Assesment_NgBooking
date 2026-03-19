const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// Task 1: Refactored Code
router.post("/book-room", async (req, res) => {
    try {
        const { userId, roomId } = req.body;

        if (!userId || !roomId) {
            return res.status(400).json({ error: "userId and roomId are required" });
        }

        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        if (!room.available) {
            return res.status(400).json({ error: "Room not available" });
        }

        const updatedRoom = await Room.findOneAndUpdate(
            { _id: roomId, available: true },
            { $set: { available: false } },
            { new: true }
        );

        if (!updatedRoom) {
            return res.status(400).json({ error: "Room is no longer available" });
        }

        const booking = new Booking({
            user: userId,
            room: roomId,
            status: "confirmed"
        });

        await booking.save();
        return res.status(200).json({ message: "Booking successful", booking });
    } catch (error) {
        console.error("Error booking room:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Task 2: Build an API Endpoint
router.get("/bookings", async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) {
            filter.status = status;
        }

        const bookings = await Booking.find(filter).lean();

        const formattedBookings = bookings.map(booking => ({
            id: booking._id.toString(),
            user: booking.user.toString(),
            room: booking.room.toString(),
            status: booking.status || "confirmed",
            createdAt: booking.createdAt ? booking.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
        }));

        return res.status(200).json(formattedBookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
