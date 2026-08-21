# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS production

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

# MongoDB runs outside this container; connection is via MONGODB_URI.
EXPOSE 5000

CMD ["node", "dist/server.js"]
