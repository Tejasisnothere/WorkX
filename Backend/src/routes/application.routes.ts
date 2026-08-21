import { Router } from "express";

import { apply, getById, getForJob, getMine, updateStatus } from "../controllers/application.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validateBody, validateQuery } from "../middleware/validate.middleware";
import { applicationsQuerySchema, updateApplicationStatusSchema } from "../utils/application.validation";
import { UserRole } from "../utils/roles";

const router = Router();

// Job-scoped application routes.
router.post("/jobs/:jobId/apply", authenticate, requireRole(UserRole.SEEKER), apply);
router.get(
  "/jobs/:jobId/applications",
  authenticate,
  requireRole(UserRole.EMPLOYER),
  validateQuery(applicationsQuerySchema),
  getForJob
);

// Order matters: /applications/me must be registered before
// /applications/:id, otherwise Express would match "me" as an :id param.
router.get(
  "/applications/me",
  authenticate,
  requireRole(UserRole.SEEKER),
  validateQuery(applicationsQuerySchema),
  getMine
);
router.get("/applications/:id", authenticate, getById);
router.patch(
  "/applications/:id",
  authenticate,
  requireRole(UserRole.EMPLOYER),
  validateBody(updateApplicationStatusSchema),
  updateStatus
);

export default router;
