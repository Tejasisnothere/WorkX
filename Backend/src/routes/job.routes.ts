import { Router } from "express";

import { create, getById, getMine, list, remove, update } from "../controllers/job.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validateBody, validateQuery } from "../middleware/validate.middleware";
import { createJobSchema, jobQuerySchema, myJobsQuerySchema, updateJobSchema } from "../utils/job.validation";
import { UserRole } from "../utils/roles";

const router = Router();

// Order matters: /jobs/my must be registered before /jobs/:id, otherwise
// Express would match "my" as an :id param on the more general route.
router.get("/jobs/my", authenticate, requireRole(UserRole.EMPLOYER), validateQuery(myJobsQuerySchema), getMine);

router.post("/jobs", authenticate, requireRole(UserRole.EMPLOYER), validateBody(createJobSchema), create);
router.get("/jobs", authenticate, validateQuery(jobQuerySchema), list);
router.get("/jobs/:id", authenticate, getById);
router.patch("/jobs/:id", authenticate, requireRole(UserRole.EMPLOYER), validateBody(updateJobSchema), update);
router.delete("/jobs/:id", authenticate, requireRole(UserRole.EMPLOYER), remove);

export default router;
