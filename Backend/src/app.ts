import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";

import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import applicationRoutes from "./routes/application.routes";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import jobRoutes from "./routes/job.routes";
import savedJobRoutes from "./routes/savedJob.routes";
import userRoutes from "./routes/user.routes";
import { parseCorsOrigin } from "./utils/cors";

export function createApp(): Application {
  const app: Application = express();

  // Running behind a load balancer / reverse proxy (ALB on ECS, Nginx on
  // EC2) in production — without this, req.ip and req.secure reflect the
  // proxy hop instead of the real client, which throws off rate limiting
  // and any future secure-cookie/HTTPS-redirect logic.
  app.set("trust proxy", 1);

  // Core middleware
  app.use(helmet());
  app.use(
    cors({
      origin: parseCorsOrigin(process.env.CORS_ORIGIN),
    })
  );
  // Explicit body size limit — an unbounded JSON body is a cheap DoS
  // vector against a small API like this one.
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Routes
  const apiV1 = "/api/v1";
  app.use(apiV1, healthRoutes);
  app.use(apiV1, authRoutes);
  app.use(apiV1, userRoutes);
  app.use(apiV1, jobRoutes);
  app.use(apiV1, applicationRoutes);
  app.use(apiV1, savedJobRoutes);

  // 404 + centralized error handling (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
