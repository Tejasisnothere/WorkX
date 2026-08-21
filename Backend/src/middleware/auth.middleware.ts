import { NextFunction, Request, Response } from "express";

import { UserRole } from "../utils/roles";
import { verifyToken } from "../utils/jwt";
import { AppError } from "./error.middleware";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

/**
 * Verifies the Bearer JWT in the Authorization header and attaches
 * { userId, role } to req.user. Throws 401 if missing/invalid/expired.
 */
export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Missing or invalid Authorization header", 401));
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}
