# WorkX Backend

Backend REST API for WorkX, a mobile-first employment app (SEEKER / EMPLOYER roles).

> **Status:** Stage 1 — project scaffolding only. No auth, jobs, applications, or
> business logic yet. Just the app shell, DB connection, and health check.

## Stack

Node.js · Express · TypeScript · Mongoose (MongoDB) · dotenv · cors · helmet

## Getting Started (local)

```bash
npm install
cp .env.example .env   # already done in this scaffold; edit MONGODB_URI if needed
npm run dev
```

The server starts on `http://localhost:5000` (or whatever `PORT` you set).

## Getting Started (Docker)

```bash
docker compose up --build
```

This starts the backend container plus a MongoDB container. The app connects to
Mongo via `MONGODB_URI=mongodb://mongo:27017/workx` inside the compose network.

## Test the health check

```bash
curl http://localhost:5000/api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "WorkX backend is healthy"
}
```

## Project Structure

```
src/
├── config/db.ts            MongoDB connection (Mongoose)
├── models/                 (empty — Stage 2+)
├── controllers/             (empty — Stage 2+)
├── services/                (empty — Stage 2+)
├── routes/health.routes.ts  GET /api/v1/health
├── middleware/error.middleware.ts  Centralized error handling (AppError, 404, handler)
├── utils/                   (empty — Stage 2+)
├── app.ts                   Express app: middleware + route mounting
└── server.ts                Entry point: loads env, connects DB, starts server
```

## Notes

- This backend is fully independent of the separate WorkX AI service — no AI
  calls, SDKs, queues, or webhooks live here.
- MongoDB is external to the app container (see `docker-compose.yml`); in
  production this should point at MongoDB Atlas via `MONGODB_URI`.
