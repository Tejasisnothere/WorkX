import mongoose from "mongoose";

const MAX_CONNECT_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Connects to MongoDB using the MONGODB_URI environment variable.
 *
 * Retries a few times with a fixed delay before giving up. This matters in
 * Docker Compose / ECS: `depends_on` only waits for the container to
 * *start*, not for mongod to actually be accepting connections yet, so the
 * very first connection attempt on a cold start can legitimately fail.
 *
 * Throws if the URI is missing, or if every retry attempt fails, so the
 * caller (server.ts) can decide how to handle startup failure.
 */
export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  mongoose.set("strictQuery", true);

  for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt += 1) {
    try {
      await mongoose.connect(mongoUri);
      break;
    } catch (err) {
      const isLastAttempt = attempt === MAX_CONNECT_ATTEMPTS;
      console.error(
        `[db] MongoDB connection attempt ${attempt}/${MAX_CONNECT_ATTEMPTS} failed:`,
        err instanceof Error ? err.message : err
      );
      if (isLastAttempt) {
        throw err;
      }
      await sleep(RETRY_DELAY_MS);
    }
  }

  console.log(`[db] MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB disconnected");
  });
}

/**
 * Closes the MongoDB connection. Safe to call even if never connected —
 * used by the graceful-shutdown path in server.ts.
 */
export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
