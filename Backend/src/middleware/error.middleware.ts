import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

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
 * Translates a raw error (which may come straight from Mongoose/MongoDB
 * rather than from application code) into an AppError. Centralizing this
 * means routes/services never need to special-case malformed ObjectIds or
 * unique-index violations themselves — every `findById(":id")` on a bad id
 * ends up as a clean 400 instead of an unhandled 500 with a driver stack
 * trace in the message.
 */
function toAppError(err: Error | AppError): AppError {
  if (err instanceof AppError) {
    return err;
  }

  // Malformed ObjectId (e.g. "/api/v1/jobs/not-an-id") — findById/findOne
  // throw CastError before the query ever reaches MongoDB.
  if (err instanceof mongoose.Error.CastError) {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Mongoose schema validation failures that bypassed Zod (e.g. a raw
  // `.save()` after mutating a document).
  if (err instanceof mongoose.Error.ValidationError) {
    return new AppError(err.message, 400);
  }

  // Duplicate key errors that weren't already caught and translated at
  // the service layer (belt-and-braces for any future unique index).
  if ((err as unknown as { code?: number }).code === 11000) {
    return new AppError("A record with these details already exists", 409);
  }

  return new AppError(err.message || "Internal Server Error", 500);
}

/**
 * Centralized error handler. Must be registered last, after all routes.
 * Keeps the response shape consistent: { success: false, message: string }
 *
 * In production, 500-level errors never leak their raw message (which may
 * contain internal details like file paths or driver internals) to the
 * client — the full error is still logged server-side for debugging.
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const appError = toAppError(err);
  const { statusCode } = appError;

  if (statusCode >= 500) {
    console.error("[error]", err);
  }

  const isProd = process.env.NODE_ENV === "production";
  const message = statusCode >= 500 && isProd ? "Internal Server Error" : appError.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
}
