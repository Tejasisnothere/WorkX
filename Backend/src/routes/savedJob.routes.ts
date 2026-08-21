import { Router } from "express";

import { list, save, unsave } from "../controllers/savedJob.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validateQuery } from "../middleware/validate.middleware";
import { savedJobsQuerySchema } from "../utils/savedJob.validation";
import { UserRole } from "../utils/roles";

const router = Router();

router.post("/jobs/:jobId/save", authenticate, requireRole(UserRole.SEEKER), save);
router.delete("/jobs/:jobId/save", authenticate, requireRole(UserRole.SEEKER), unsave);
router.get("/saved-jobs", authenticate, requireRole(UserRole.SEEKER), validateQuery(savedJobsQuerySchema), list);

export default router;
