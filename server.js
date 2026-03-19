const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import separated routes
const bookingRoutes = require('./routes/bookings');
const uploadRoutes = require('./routes/uploads');

const app = express();

// Middleware
app.use(express.json());

// Main App Routes
app.use('/', bookingRoutes);
app.use('/', uploadRoutes);    // Handle /upload-image

// Serve static files for the uploads folder to make URLs accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure MongoDB URI is provided
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ngbooking';
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

module.exports = app; // export for testing
