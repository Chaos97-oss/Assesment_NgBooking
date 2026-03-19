const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ngbooking';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        await User.deleteMany({});
        await Room.deleteMany({});
        await Booking.deleteMany({});

        const user1 = await User.create({ name: 'Alice', email: 'alice@example.com' });
        const user2 = await User.create({ name: 'Bob', email: 'bob@example.com' });

        const room1 = await Room.create({ name: 'Room A', available: true, capacity: 2 });
        const room2 = await Room.create({ name: 'Room B', available: true, capacity: 4 });
        const room3 = await Room.create({ name: 'Room C', available: false, capacity: 1 });

        await Booking.create({ user: user1._id, room: room3._id, status: 'confirmed' });
        await Booking.create({ user: user2._id, room: room3._id, status: 'confirmed' });

        console.log("Database seeded successfully!\n");
        console.log("--- Use these IDs in api-tests.http ---");
        console.log(`User1 (Alice) ID: ${user1._id}`);
        console.log(`User2 (Bob) ID:   ${user2._id}`);
        console.log(`Room1 (A) ID:     ${room1._id}  (Available)`);
        console.log(`Room2 (B) ID:     ${room2._id}  (Available)`);
        console.log(`Room3 (C) ID:     ${room3._id}  (Not Available)`);

    } catch (err) {
        console.error("Seed error:", err);
    } finally {
        process.exit(0);
    }
}

seed();
