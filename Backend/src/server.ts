import dotenv from "dotenv";

dotenv.config();

import { createApp } from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

async function start(): Promise<void> {
  try {
    await connectDB();

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`[server] WorkX backend running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
    });
  } catch (err) {
    console.error("[server] Failed to start server:", err);
    process.exit(1);
  }
}

start();

process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled Rejection:", reason);
});

process.on("SIGINT", () => {
  console.log("[server] SIGINT received, shutting down");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("[server] SIGTERM received, shutting down");
  process.exit(0);
});
