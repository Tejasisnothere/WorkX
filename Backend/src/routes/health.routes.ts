import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

/**
 * Used by Docker's HEALTHCHECK, ECS task health checks, and an ALB target
 * group. Reports 503 when the MongoDB connection isn't up so the
 * orchestrator can detect and restart/replace an unhealthy instance
 * instead of routing traffic to a container that can't actually serve
 * requests.
 */
router.get("/health", (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1; // 1 = connected

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    message: dbConnected ? "WorkX backend is healthy" : "WorkX backend is unhealthy: database not connected",
    db: mongoose.STATES[mongoose.connection.readyState],
  });
});

export default router;
