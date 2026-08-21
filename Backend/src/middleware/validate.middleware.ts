import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

import { AppError } from "./error.middleware";

/**
 * Validates req.body against the given Zod schema. On success, replaces
 * req.body with the parsed (and coerced/trimmed) data. On failure, throws
 * a 400 AppError with a readable message.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      return next(new AppError(message || "Invalid request body", 400));
    }

    req.body = result.data;
    next();
  };
}

export interface ValidatedQueryRequest<T = unknown> extends Request {
  validatedQuery?: T;
}

/**
 * Validates req.query against the given Zod schema (with coercion — e.g.
 * page/limit strings become numbers). req.query itself is left untouched
 * (some Express versions make it read-only); the parsed result is attached
 * to req.validatedQuery instead.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: ValidatedQueryRequest, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const message = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      return next(new AppError(message || "Invalid query parameters", 400));
    }

    req.validatedQuery = result.data;
    next();
  };
}
