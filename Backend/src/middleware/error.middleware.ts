import { NextFunction, Request, Response } from "express";

/**
 * Standard shape for application errors so controllers/services can
 * throw errors with a specific HTTP status code.
 */
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Catches unmatched routes and forwards a 404 AppError to the error handler.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

/**
 * Centralized error handler. Must be registered last, after all routes.
 * Keeps the response shape consistent: { success: false, message: string }
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  if (statusCode === 500) {
    console.error("[error]", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
