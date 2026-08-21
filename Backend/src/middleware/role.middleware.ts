import { NextFunction, Response } from "express";

import { UserRole } from "../utils/roles";
import { AuthenticatedRequest } from "./auth.middleware";
import { AppError } from "./error.middleware";

/**
 * Restricts a route to one or more roles. Must run after authenticate().
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }

    next();
  };
}
