import mongoose from "mongoose";

/**
 * Connects to MongoDB using the MONGODB_URI environment variable.
 * Throws if the URI is missing or the connection fails, so the caller
 * (server.ts) can decide how to handle startup failure.
 */
export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri);

  console.log(`[db] MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB disconnected");
  });
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
