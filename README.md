# CollabBoard

CollabBoard is a real-time task management board with a React frontend and an Express backend. Tasks are stored in MongoDB, authenticated users use JWTs, and Socket.IO broadcasts task changes to connected clients.

## Project structure

```text
CollabBoard89/
├── back-end/       Express API, MongoDB models, authentication, and Socket.IO
├── front-end/      React task board interface
├── requirements.txt Dependency reference
└── README.md       Project documentation
```

## Technology stack

- Frontend: React and Create React App
- Backend: Node.js, Express, and Socket.IO
- Database: MongoDB with Mongoose
- Authentication: JWT and bcryptjs
- Communication: REST API and WebSockets

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB running locally, or a MongoDB Atlas connection string
- Git, if cloning the repository

## Installation

From the project root, install dependencies for both applications:

```bash
cd back-end
npm install

cd ../front-end
npm install
```

## Configuration

Create `back-end/.env` with the following values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/collabboard
JWT_SECRET=replace-with-a-long-random-secret
```

For MongoDB Atlas or another remote database, replace `MONGO_URI` with the appropriate connection string.

## Run locally

Start MongoDB first. Then open two terminals from the project root.

### Terminal 1: backend

```bash
cd back-end
npm run dev
```

The backend API and Socket.IO server run at `http://localhost:5000`.

To run the backend without automatic restarts:

```bash
npm start
```

### Terminal 2: frontend

```bash
cd front-end
npm start
```

Open `http://localhost:3000` in a browser. The frontend is configured to communicate with the backend at `http://localhost:5000`.

## Verify the backend

Open `http://localhost:5000/`. A working backend returns:

```text
CollabBoard API is running...
```

If the backend exits with a MongoDB error, confirm that MongoDB is running and that `MONGO_URI` is correct.

## API endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

See [back-end/README.md](back-end/README.md) for the backend-specific setup and endpoint details.

## Frontend commands

Run these commands from `front-end`:

```bash
npm start       # Start the development server
npm test        # Run the test runner
npm run build   # Create a production build
```

## Troubleshooting

- **Cannot connect to MongoDB:** Start the MongoDB service or update `MONGO_URI`.
- **Frontend cannot load tasks:** Confirm that the backend is running on port `5000`.
- **Port already in use:** Stop the process using port `3000` or `5000`, or configure a different backend `PORT` and update the frontend API URL accordingly.
