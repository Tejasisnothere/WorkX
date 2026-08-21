# WorkX Backend

Node.js + Express + TypeScript + MongoDB backend for the WorkX mobile employment app (React Native client). Stateless JWT authentication, two user roles (SEEKER / EMPLOYER), job postings, applications, and saved jobs.

---

## 1. Architecture Overview

```
src/
  app.ts                 Express app factory (middleware + route mounting)
  server.ts              Process entrypoint: connects DB, starts HTTP server,
                          handles graceful shutdown
  config/db.ts            MongoDB connection (with retry) via MONGODB_URI

  models/                 Mongoose schemas (User, Job, Application, SavedJob)
  routes/                 Express routers — wire URL + HTTP verb to a
                           controller, declare auth/role/validation middleware
  controllers/             Thin HTTP layer: read req, call a service, send a
                           response. No business logic lives here.
  services/                Business logic: authorization checks, MongoDB
                           queries, domain rules (e.g. "closed jobs can't
                           accept applications"). This is the layer that unit
                           tests target.
  middleware/              authenticate (JWT), requireRole (RBAC),
                            validateBody/validateQuery (Zod), errorHandler
  utils/                   Cross-cutting helpers: JWT signing, password
                            hashing, pagination math, Mongo error helpers,
                            CORS origin parsing, rate limiter
```

**Request flow:** `route -> authenticate -> requireRole -> validateBody/Query -> controller -> service -> model -> MongoDB`, with every controller wrapped in `asyncHandler` so a rejected promise anywhere in that chain lands in the centralized `errorHandler` instead of crashing the process or hanging the request.

**Design principles this codebase follows:**
- Controllers are thin. All business rules and authorization decisions live in `services/`.
- Every response has the same envelope: `{ success: boolean, data?, message }`.
- Every thrown error is (or gets normalized into) an `AppError(message, statusCode)`; the error middleware is the single place that decides the HTTP status and response shape, including translating raw Mongoose errors (bad ObjectId, unique-index violations) into clean 400/409s instead of leaking a 500 with driver internals.
- The app is fully stateless — no session store, no local file writes, no in-memory state that matters across requests. Any instance can serve any request; horizontal scaling and rolling deploys are safe.

### Data model

| Model | Purpose | Key indexes |
|---|---|---|
| `User` | Seekers and employers (`role` field) | unique `phoneNumber` |
| `Job` | Job postings, owned by an employer | `employerId`, `status`, `createdAt`, text index on title/description/companyName |
| `Application` | A seeker's application to a job | unique compound `(seekerId, jobId)`, `employerId`, `jobId` |
| `SavedJob` | A seeker's bookmark of a job | unique compound `(seekerId, jobId)` |

`Application` and `SavedJob` both denormalize `employerId`/`seekerId` onto the record at creation time so ownership checks (e.g. "can this employer see this application?") don't require a second lookup against `Job` on every request.

---

## 2. Setup Instructions

**Prerequisites:** Node.js 20+, npm, and either a local MongoDB instance or Docker.

```bash
git clone <repo-url>
cd workx-backend
cp .env.example .env      # edit values, especially JWT_SECRET
npm install
npm run dev                # http://localhost:5000
```

Verify it's up:
```bash
curl http://localhost:5000/api/v1/health
```

---

## 3. Environment Variables

Defined in `.env.example` — copy it to `.env` for local development.

| Variable | Required | Example | Notes |
|---|---|---|---|
| `PORT` | no (default `5000`) | `5000` | HTTP port the server listens on |
| `NODE_ENV` | no (default `development`) | `production` | Also gates whether 500-level error messages are shown raw (`development`) or generic (`production`) |
| `MONGODB_URI` | **yes** | `mongodb://localhost:27017/workx` | Full connection string; the app refuses to start without it |
| `JWT_SECRET` | **yes** | a long random string | Used to sign/verify auth tokens. The app throws on startup use if this is missing — **never** deploy with the `changeme` value from `.env.example` |
| `JWT_EXPIRES_IN` | no (default `7d`) | `7d`, `1h` | Any `jsonwebtoken` `expiresIn` value |
| `CORS_ORIGIN` | no (default `*`) | `https://app.workx.com,https://admin.workx.com` | `*` or a comma-separated allowlist. A wildcard is safe here because auth is a bearer token in the `Authorization` header, not a cookie — but production deployments should still set an explicit allowlist |

Generate a strong `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## 4. Local Development (without Docker)

```bash
npm run dev         # nodemon + ts-node, restarts on file change
npm run typecheck   # tsc --noEmit
npm run build       # compiles to dist/
npm start           # runs the compiled build (dist/server.js)
npm test            # Jest + Supertest against an in-memory MongoDB
```

You'll need a MongoDB instance reachable at `MONGODB_URI` — either installed locally, or run just the `mongo` service from `docker-compose.yml`:
```bash
docker compose up mongo -d
```

---

## 5. Docker Usage

**Build & run the full stack (app + MongoDB) locally:**
```bash
cp .env.example .env      # docker compose reads this automatically
docker compose up --build
```
This starts `workx-mongo` (with a healthcheck), waits for it to report healthy, then starts `workx-backend` against it. Data persists in the `workx_mongo_data` named volume across restarts.

```bash
docker compose down          # stop
docker compose down -v       # stop and wipe the Mongo volume
```

**Build the app image standalone** (e.g. to run against an external MongoDB — RDS-style managed Mongo, Atlas, etc.):
```bash
docker build -t workx-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI="mongodb+srv://..." \
  -e JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")" \
  -e CORS_ORIGIN="https://app.workx.com" \
  -e NODE_ENV=production \
  workx-backend
```

**Image characteristics:**
- Multi-stage build — the final image contains only compiled `dist/`, production `node_modules`, and no TypeScript/dev toolchain.
- Runs as the non-root `node` user, not root.
- `HEALTHCHECK` hits `GET /api/v1/health` using Node's built-in `http` module (no curl/wget dependency in the alpine base).
- No volumes are declared for the app container — it doesn't write anything to the local filesystem at runtime, so it's safe to run multiple replicas or replace the container on every deploy.

---

## 6. API Endpoint Summary

Base path: `/api/v1`. All non-auth, non-health endpoints require `Authorization: Bearer <token>`.

| Method | Path | Auth | Role | Purpose |
|---|---|---|---|---|
| GET | `/health` | none | — | Liveness/readiness (checks MongoDB connection) |
| POST | `/auth/register` | none | — | Create a SEEKER or EMPLOYER account |
| POST | `/auth/login` | none | — | Exchange credentials for a JWT |
| POST | `/auth/logout` | required | any | Stateless no-op (client discards the token) |
| GET | `/auth/me` | required | any | Current user, resolved from the token |
| GET | `/users/me` | required | any | Own profile |
| PATCH | `/users/me` | required | any | Update own profile |
| POST | `/jobs` | required | EMPLOYER | Create a job posting |
| GET | `/jobs` | required | any | Search/list jobs (filters: `search`, `location`, `jobType`, `skills`, `status`, `page`, `limit`) |
| GET | `/jobs/my` | required | EMPLOYER | List jobs owned by the current employer |
| GET | `/jobs/:id` | required | any | Job detail |
| PATCH | `/jobs/:id` | required | EMPLOYER (owner) | Update a job, including opening/closing it |
| DELETE | `/jobs/:id` | required | EMPLOYER (owner) | Delete a job |
| POST | `/jobs/:jobId/apply` | required | SEEKER | Apply to a job |
| GET | `/applications/me` | required | SEEKER | List own applications |
| GET | `/applications/:id` | required | owning SEEKER or owning EMPLOYER | Application detail |
| GET | `/jobs/:jobId/applications` | required | EMPLOYER (owner) | List applicants for a job |
| PATCH | `/applications/:id` | required | EMPLOYER (owner) | Change application status |
| POST | `/jobs/:jobId/save` | required | SEEKER | Bookmark a job |
| DELETE | `/jobs/:jobId/save` | required | SEEKER | Remove a bookmark |
| GET | `/saved-jobs` | required | SEEKER | List own bookmarked jobs |

Every response is shaped `{ success, data, message }` on success, or `{ success: false, message }` on error. A Postman collection covering the saved-jobs flow lives in `postman/`.

---

## 7. Authentication Flow

1. **Register** (`POST /auth/register`) with `name`, `phoneNumber`, `password`, `role` (`SEEKER` or `EMPLOYER`). Password is hashed with bcrypt (10 salt rounds) before storage; the raw password is never persisted.
2. Response includes a signed JWT (`{ userId, role }` payload, `JWT_EXPIRES_IN` lifetime) and the created user (password hash never included — stripped by a schema-level `toJSON` transform, so it can't leak even if a route forgets to `.select("-passwordHash")`).
3. **Login** (`POST /auth/login`) with `phoneNumber` + `password` returns the same shape.
4. The client stores the token and sends it as `Authorization: Bearer <token>` on every subsequent request.
5. `authenticate` middleware verifies the token's signature and expiry, and attaches `{ userId, role }` to `req.user`. Invalid/expired/missing tokens → `401`.
6. `requireRole(...)` middleware (used after `authenticate`) enforces which of `SEEKER`/`EMPLOYER` may hit a given route → `403` if the role doesn't match.
7. Beyond role, several routes enforce **ownership** in the service layer (e.g. only the employer who created a job can update it; only the seeker who applied can view their own application) → `403` if the authenticated user isn't the owner.
8. Logout is a stateless no-op — there's no server-side session or token blacklist, so the client is responsible for discarding the token. This is a deliberate simplicity trade-off; if forced logout / token revocation becomes a requirement later, that's a schema and infra change (e.g. a token-blacklist collection or short-lived tokens + refresh tokens), not something this endpoint currently does.

Auth endpoints (`/auth/register`, `/auth/login`) are additionally rate-limited (20 requests / 15 minutes / IP) to blunt credential-stuffing and brute-force attempts.

---

## 8. Seeker Capabilities

- Register/login as `SEEKER`, manage own profile (`/users/me`)
- Browse and search jobs (`/jobs`, `/jobs/:id`)
- Apply to open jobs (`/jobs/:jobId/apply`) — blocked for closed jobs and duplicate applications
- View their own applications and each one's status (`/applications/me`, `/applications/:id`)
- Save/unsave jobs and view their saved list (`/jobs/:jobId/save`, `/saved-jobs`)
- Cannot: view other seekers' applications, change an application's status, create/edit/delete jobs, or view another seeker's saved jobs

## 9. Employer Capabilities

- Register/login as `EMPLOYER`, manage own profile (`/users/me`)
- Create, update, close, and delete their own job postings (`/jobs`, `/jobs/:id`, `/jobs/my`)
- View applicants for jobs they own (`/jobs/:jobId/applications`) and change an applicant's status (`/applications/:id` → `APPLIED` / `SHORTLISTED` / `REJECTED` / `HIRED`)
- Cannot: apply to jobs, save jobs, view or modify another employer's jobs or applicants

---

## 10. Deployment Notes (EC2 / ECS)

This app is a single stateless container plus an external MongoDB — no Kubernetes, no message queue, no cache layer required.

**Common to both targets:**
- Build the image from the provided `Dockerfile` (`docker build -t workx-backend .`), push to ECR or another registry.
- Provide `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production` as environment variables / secrets — never bake secrets into the image.
- Point a load balancer's health check at `GET /api/v1/health`. It returns `200` only when the process is up **and** the MongoDB connection is live (`503` otherwise), so the LB can pull an unhealthy instance out of rotation instead of sending it traffic it can't serve.
- The app calls `app.set("trust proxy", 1)`, so it correctly reads client IP/protocol when sitting behind an ALB or an Nginx reverse proxy on EC2 — important for the rate limiter and for any future logging.
- Send `SIGTERM` to stop a container (both `docker stop` and ECS task stop do this by default). The app stops accepting new connections, finishes in-flight requests, closes the MongoDB connection, then exits — deploys and autoscaling-in events won't drop live requests.

**EC2 (simplest path):**
- Run MongoDB as its own instance/service (self-managed, or a managed Mongo offering), and run the app container via `docker run` or `docker compose` (pointing `MONGODB_URI` at that external Mongo — don't use the bundled `docker-compose.yml` `mongo` service for anything but local dev).
- Put the app behind Nginx or an ALB for TLS termination; the app itself speaks plain HTTP.
- Use a process supervisor for the container (systemd unit calling `docker run --restart unless-stopped`, or a small docker-compose file) so it survives instance reboots.

**ECS (Fargate or EC2 launch type):**
- Push the image to ECR.
- Define a single-container task definition; inject `MONGODB_URI`/`JWT_SECRET`/`CORS_ORIGIN` via `secrets` (Secrets Manager / SSM Parameter Store) rather than plain `environment` for anything sensitive.
- Point the ALB target group's health check path at `/api/v1/health`.
- Run MongoDB separately — Atlas, DocumentDB, or a self-managed EC2/EBS instance — the app never assumes Mongo lives in the same task/cluster.
- Set the container's stop timeout ≥ 10s (matching the app's own 10s forced-shutdown timer) so ECS doesn't SIGKILL before the graceful-shutdown path finishes.
- Scale horizontally by increasing desired task count — the app has no local state, so any number of tasks can run behind the same target group.

**Not included by design** (per project scope): no Kubernetes manifests, no Redis/Kafka, no service mesh, no AI integration. If any of these become requirements later, they're additive infrastructure changes on top of this same stateless container — they don't require rearchitecting the app.

---

## 11. Testing

`tests/application.test.ts` covers the Stage 4 application flow end-to-end (Jest + Supertest + `mongodb-memory-server`, no external MongoDB needed to run it). `postman/` has a runnable collection for the saved-jobs flow. Both exercise the real Express app (`createApp()`), not mocks, so they double as authorization-boundary regression tests (e.g. "seeker cannot view another seeker's application").
