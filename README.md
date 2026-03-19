# Ngbooking Backend Assessment

This repository contains the Node.js Express backend assessment covering code review, API endpoints, file uploads, and MongoDB aggregation.

## Requirements Checklist
- **Task 1: Code Review & Refactor** (Implemented in `server.js`)
- **Task 2: Build an API Endpoint** (Implemented `GET /bookings` in `server.js`)
- **Task 3: File Upload Endpoint** (Implemented `POST /upload-image` using `multer` in `server.js`)
- **Task 4: MongoDB Query** (Implemented aggregation snippet in `Task4_Query.js`)

## Running the project locally

### 1. Install dependencies
```bash
npm install
```

### 2. Start MongoDB
Ensure MongoDB is running locally on the default port `27017`. You can also provide a custom URI via environment variable:
```bash
export MONGODB_URI="mongodb://your-custom-uri"
```

### 3. Start the server
To start the app:
```bash
npm start
```
By default, the server runs on port 3000.

For development mode (using nodemon):
```bash
npm run dev
```

## Assumptions Made
1. **Database Connection**: Assumes MongoDB is running on the standard `localhost:27017/ngbooking` and that models (`User`, `Room`, `Booking`) are correctly imported for schema mapping.
2. **File Storage**: Uploads are stored locally in the `uploads/` directory which is auto-created when the server runs. In a production environment, an S3 bucket or equivalent would be ideal.
3. **Data Types**: Assumes IDs inside `req.body.userId` and `roomId` are valid MongoDB ObjectIds.
4. **Task 1 Refactor (Concurrency)**: Used `findOneAndUpdate` to atomically reserve a room, avoiding race conditions that were present in the sequential `room = find()` and `room.available = false; room.save()` flow. Added try-catch and parameter validations.
5. **Validation**: Minimal inline validation is used. In a fully-fledged app, libraries like `Joi` or `express-validator` would validate incoming bodies.
6. **Task 2 Fields Mapping**: Mapped `booking._id`, `booking.user`, `booking.room` to their string representations directly, to match exactly the string-based Example Response.
## Task 4 Query Details
The MongoDB query snippet uses the `$lookup` and `$group` aggregation pipeline stages. It joins the `bookings` collection with the `rooms` collection to extract the room name, counts the documents grouped by room name, and logs them in the specified format ("Room A: 12 bookings"). You can find the query script inside `Task4_Query.js`.
