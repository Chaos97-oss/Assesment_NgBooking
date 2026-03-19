const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    available: { type: Boolean, default: true },
    capacity: { type: Number, default: 2 }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
