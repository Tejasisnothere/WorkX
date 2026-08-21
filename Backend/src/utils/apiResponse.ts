import { Response } from "express";

export function sendSuccess(res: Response, data: unknown, message = "Success", statusCode = 200): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}
