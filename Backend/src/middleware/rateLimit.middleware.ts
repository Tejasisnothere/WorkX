import rateLimit from "express-rate-limit";

/**
 * Applied only to /auth/login and /auth/register. These are the two
 * unauthenticated endpoints that accept a password, so they're the ones
 * worth protecting against credential-stuffing / brute-force attempts.
 * Every other route already requires a valid JWT.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});
