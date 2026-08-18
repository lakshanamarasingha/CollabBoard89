# CollabBoard Backend

This is the Express + MongoDB backend for the CollabBoard application.

## Tech Stack
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- CORS
- dotenv

## Prerequisites
- Node.js installed
- MongoDB running locally or a valid MongoDB connection string

## Install dependencies

```bash
npm install
```

## Environment variables
Create a `.env` file in this folder with the following values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/collabboard
JWT_SECRET=supersecretkey123
```

## Run the server

```bash
node server.js
```

The server will start on:

```bash
http://localhost:5000
```

## API routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Health check

```bash
GET /
```

Returns:

```text
CollabBoard API is running...
```

## Notes
- The app connects to MongoDB automatically when the server starts.
- If MongoDB is not running, the app will log an error and exit.
