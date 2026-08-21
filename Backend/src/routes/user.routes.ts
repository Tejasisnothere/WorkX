import { Router } from "express";

import { getMe, updateMe } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { updateProfileSchema } from "../utils/validation";

const router = Router();

router.get("/users/me", authenticate, getMe);
router.patch("/users/me", authenticate, validateBody(updateProfileSchema), updateMe);

export default router;
