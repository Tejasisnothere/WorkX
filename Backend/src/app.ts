import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";

import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import healthRoutes from "./routes/health.routes";

export function createApp(): Application {
  const app: Application = express();

  // Core middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  const apiV1 = "/api/v1";
  app.use(apiV1, healthRoutes);

  // NOTE: auth, user, job, application, and savedJob routes will be
  // mounted here in later stages. Do not add business logic yet.

  // 404 + centralized error handling (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
