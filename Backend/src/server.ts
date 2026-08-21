import dotenv from "dotenv";

dotenv.config();

import http from "http";

import { createApp } from "./app";
import { connectDB, disconnectDB } from "./config/db";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

let server: http.Server | undefined;
let shuttingDown = false;

async function start(): Promise<void> {
  try {
    await connectDB();

    const app = createApp();

    server = app.listen(PORT, () => {
      console.log(`[server] WorkX backend running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
    });
  } catch (err) {
    console.error("[server] Failed to start server:", err);
    process.exit(1);
  }
}

/**
 * Stops accepting new connections, lets in-flight requests finish, then
 * closes the MongoDB connection before exiting. This is what makes
 * `docker stop` / ECS task stop / `kubectl delete pod`-style SIGTERM
 * deploys safe: without it, in-flight requests get dropped and the DB
 * connection is torn down mid-write.
 */
function shutdown(signal: string): void {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  console.log(`[server] ${signal} received, shutting down gracefully`);

  const forceExitTimer = setTimeout(() => {
    console.error("[server] Graceful shutdown timed out, forcing exit");
    process.exit(1);
  }, 10000);
  forceExitTimer.unref();

  if (!server) {
    disconnectDB().finally(() => process.exit(0));
    return;
  }

  server.close(async (err) => {
    if (err) {
      console.error("[server] Error while closing HTTP server:", err);
    }
    try {
      await disconnectDB();
      console.log("[server] Shutdown complete");
      clearTimeout(forceExitTimer);
      process.exit(err ? 1 : 0);
    } catch (disconnectErr) {
      console.error("[server] Error while disconnecting MongoDB:", disconnectErr);
      clearTimeout(forceExitTimer);
      process.exit(1);
    }
  });
}

start();

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// A rejected promise with no .catch() anywhere is a bug — log it loudly
// and fail fast via the same graceful-shutdown path rather than leaving
// the process running in a possibly-corrupted state.
process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled Rejection:", reason);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  console.error("[server] Uncaught Exception:", err);
  shutdown("uncaughtException");
});
