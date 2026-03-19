const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

const app = express();
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Ensure MongoDB URI is provided
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ngbooking';

// Task 1: Refactored Code
// Problems identified in original code:
// 1. Missing error handling (try/catch) for async DB operations.
// 2. Race condition: checking `room.available` and updating separately is not atomic.
// 3. Missing input validation: `userId` and `roomId` could be undefined.
// 4. `room` could be null if not found, crashing the app on `room.available`.
app.post("/book-room", async (req, res) => {
    try {
        const { userId, roomId } = req.body;

        // 1. Input validation
        if (!userId || !roomId) {
            return res.status(400).json({ error: "userId and roomId are required" });
        }

        const room = await Room.findById(roomId);

        // 2. Null check for room
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        if (!room.available) {
            return res.status(400).json({ error: "Room not available" });
        }

        // 3. Atomicity: updating room directly to prevent race conditions
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
app.get("/bookings", async (req, res) => {
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

// Task 3: File Upload Endpoint
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, path.parse(file.originalname).name + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

app.post("/upload-image", upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        return res.status(200).json({ url: imageUrl });
    } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Serve static files for the uploads folder to make URLs accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    mongoose.connect(MONGODB_URI).then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error("MongoDB connection error:", err);
    });
}

module.exports = app;
