const express = require('express');
const path = require('path');

// Import separated routes
const bookingRoutes = require('./routes/bookingRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Global error handler middleware
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Global Middlewares
app.use(express.json());

// Main App Routes
app.use('/', bookingRoutes);
app.use('/', uploadRoutes);

// Serve static files for the uploads folder to make URLs accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error Handling Middleware (must be applied after routes)
app.use(errorHandler);

module.exports = app;
