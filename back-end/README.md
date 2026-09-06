# CollabBoard Backend

This is the Express, MongoDB, and Socket.IO backend for the CollabBoard application.

## Prerequisites

- Node.js and npm installed
- MongoDB running locally, or a MongoDB connection string
- The repository cloned to your computer

## Run the application locally

The backend and frontend run as separate processes. Start MongoDB first, then open two terminal windows.

### 1. Configure the backend

From the repository root, switch to the backend folder:

```bash
cd back-end
npm install
```

Create a `.env` file in `back-end`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/collabboard
JWT_SECRET=replace-with-a-long-random-secret
```

Update `MONGO_URI` if you are using MongoDB Atlas or another remote MongoDB server.

### 2. Start the backend

Run this in the first terminal, from `back-end`:

```bash
npm run dev
```

This uses Node's watch mode and restarts the server when files change. To run without watch mode, use:

```bash
npm start
```

The API and Socket.IO server are available at `http://localhost:5000`.

### 3. Start the frontend

Run this in the second terminal, from the repository root:

```bash
cd front-end
npm install
npm start
```

Open `http://localhost:3000` in your browser. The frontend is configured to call the backend at `http://localhost:5000`.

## Verify the backend

Open the following URL or request it with a browser or API client:

```text
http://localhost:5000/
```

The response should be:

```text
CollabBoard API is running...
```

If the backend exits with a MongoDB connection error, make sure MongoDB is running and that `MONGO_URI` is correct.

## API routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
