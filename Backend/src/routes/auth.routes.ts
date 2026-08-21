import { Router } from "express";

import { login, logout, me, register } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimit.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../utils/validation";

const router = Router();

router.post("/auth/register", authRateLimiter, validateBody(registerSchema), register);
router.post("/auth/login", authRateLimiter, validateBody(loginSchema), login);
router.post("/auth/logout", authenticate, logout);
router.get("/auth/me", authenticate, me);

export default router;
