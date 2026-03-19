# Ngbooking Backend Assessment

This repository contains the Node.js Express backend assessment focusing on best practices securely and modularity. The codebase has been fully structured and adheres strictly to the **Single Responsibility Principle (SRP)**.

## Project Structure
```
.
├── config/              # MongoDB connection and env configurations
├── controllers/         # API Route handling and orchestration
├── middlewares/         # Shared express middlewares (errorHandler, multer config)
├── models/              # Mongoose database schemas
├── routes/              # Express API route listings
├── services/            # Business and database logic
├── utils/               # Shared utilities
├── validators/          # Request payload validators
├── app.js               # Express application instantiation
├── server.js            # Node HTTP server and DB initiation
├── Task4_Query.js       # MongoDB pipeline query script
└── package.json
```

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

## Testing the Endpoints

### 1. Book a Room (Task 1)
Fixes the lack of validation, race conditions (atomic `$set`), and lack of central error handling.
```bash
curl -X POST http://localhost:3000/book-room \
-H "Content-Type: application/json" \
-d '{"userId": "USER_ID", "roomId": "ROOM_ID"}'
```

### 2. Get Bookings list (Task 2)
```bash
curl http://localhost:3000/bookings
curl http://localhost:3000/bookings?status=confirmed
```

### 3. Upload image (Task 3)
```bash
curl -X POST http://localhost:3000/upload-image \
  -F "image=@sample.jpg"
```

## Running Task 4 (MongoDB aggregation)
The script `Task4_Query.js` exports an async function that groups and sums bookings by room name correctly. You can execute its logic in Mongo Shell or require it mathematically within your DB scripts!

## Assumptions Made
1. **Modules Check**: Assumes standard latest Node runtime and standard `MongoDB` instances.
2. **Race condition**: Used `findOneAndUpdate` logically on `Room` updates to ensure we do not overbook (atomic operations are safer than sequentially waiting). 
3. **Images Storage**: Multilter safely pipes uploads uniquely formatted directly to `./uploads` root path directory.
