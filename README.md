# Ngbooking Backend Assessment

This repository contains the Node.js Express backend assessment covering code review, modular API endpoints, file uploads, and MongoDB aggregation. The codebase has been fully structured and prepared for easy testing.

## Requirements Checklist
- **Task 1: Code Review & Refactor** (Implemented and documented in `/routes/bookings.js` along with atomic logic)
- **Task 2: Build an API Endpoint** (Implemented `GET /bookings` in `/routes/bookings.js`)
- **Task 3: File Upload Endpoint** (Implemented `POST /upload-image` using `multer` in `/routes/uploads.js`)
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
By default, the server runs on port 3000. For development mode (using nodemon): `npm run dev`

---

## Testing the Application

We have included a seed script and a `.http` file to make testing extremely easy!

### 1. Seed the Database
Before you test, you can quickly populate the database with dummy Users and Rooms:
```bash
node seed.js
```
*Note: This script will output IDs for you to test with.*

### 2. Test Endpoints
If you are using **VSCode**, install the extension `REST Client`. Then just open `api-tests.http` and click the small `Send Request` link above each request!

Alternatively, if you prefer `curl`, here are the commands you can run:

**Create a Booking (Task 1):**
```bash
curl -X POST http://localhost:3000/book-room \\
-H "Content-Type: application/json" \\
-d '{"userId": "YOUR_USER_ID", "roomId": "YOUR_ROOM_ID"}'
```

**Get Bookings (Task 2):**
```bash
curl http://localhost:3000/bookings
curl http://localhost:3000/bookings?status=confirmed
```

**Upload an Image (Task 3):**
Create a dummy file `sample.jpg` in the directory, then run:
```bash
curl -X POST http://localhost:3000/upload-image \\
  -F "image=@sample.jpg"
```

## Assumptions Made
1. **Database Connection**: Assumes MongoDB is running on the standard `localhost:27017/ngbooking` and that models (`User`, `Room`, `Booking`) are correctly defined for mapping.
2. **File Storage**: Uploads are stored locally in the `uploads/` directory which is auto-created when the server requests hit the uploading route.
3. **Task 1 Refactor (Concurrency)**: Used robust input validation, try-catch handlers, `findById`, and `findOneAndUpdate` to atomically reserve a room, avoiding race conditions that were present in the previous sequentially flawed execution. Added explicit error returning.
4. **Code Structure**: To fulfill the **code structure** aspect, route logic has been properly modularized into the `routes/` directory rather than crammed into one `server.js` file.

## Task 4 Query Details
The MongoDB query snippet uses the `$lookup` and `$group` aggregation pipeline stages. It joins the `bookings` collection with the `rooms` collection, extracting the room name and counting the documents precisely as formatted ("Room A: 12 bookings"). See `Task4_Query.js` for execution context.
