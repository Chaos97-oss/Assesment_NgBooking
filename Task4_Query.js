const mongoose = require('mongoose');
const Booking = require('./models/Booking');

async function getBookingCountsPerRoom() {
    try {
        const results = await Booking.aggregate([
            {
                $lookup: {
                    from: "rooms",
                    localField: "room",
                    foreignField: "_id",
                    as: "roomDetails"
                }
            },
            {
                $unwind: "$roomDetails"
            },
            {
                $group: {
                    _id: "$roomDetails.name",
                    totalBookings: { $sum: 1 }
                }
            },
            {
                $sort: { totalBookings: -1 }
            }
        ]);

        // Format output as requested
        results.forEach(result => {
            console.log(`${result._id}: ${result.totalBookings} bookings`);
        });

        return results;
    } catch (error) {
        console.error("Error running aggregation query:", error);
    }
}

// Module available to run directly if needed
module.exports = getBookingCountsPerRoom;
