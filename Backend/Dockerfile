# syntax=docker/dockerfile:1

# ---- Build stage ----
# Compiles TypeScript to dist/. This stage's node_modules (including
# devDependencies like typescript) never ship in the final image.
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS production

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /usr/src/app/dist ./dist

# The official node:*-alpine image already creates an unprivileged "node"
# user (uid 1000) — run as that instead of root inside the container.
USER node

# MongoDB runs outside this container; connection is via MONGODB_URI.
# The app is stateless: no volumes are declared because nothing is
# written to the local filesystem at runtime.
EXPOSE 5000

# Used by `docker ps`, ECS task health checks, and `docker compose up`.
# Pure Node http call — no curl/wget needed in the alpine image.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 5000) + '/api/v1/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "dist/server.js"]
