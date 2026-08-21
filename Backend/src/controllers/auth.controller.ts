import { Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { getUserById, loginUser, registerUser } from "../services/auth.service";

export const register = asyncHandler(async (req, res: Response) => {
  const { user, token } = await registerUser(req.body);
  sendSuccess(res, { user, token }, "User registered successfully", 201);
});

export const login = asyncHandler(async (req, res: Response) => {
  const { user, token } = await loginUser(req.body);
  sendSuccess(res, { user, token }, "Login successful");
});

/**
 * Stateless JWT logout: there is no server-side session or token
 * blacklist (by design — see architecture notes on keeping JWT simple).
 * The client is responsible for discarding the token. This endpoint
 * exists mainly for API completeness and a consistent client contract.
 */
export const logout = asyncHandler(async (_req, res: Response) => {
  sendSuccess(res, null, "Logout successful");
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await getUserById(req.user!.userId);
  sendSuccess(res, { user }, "Current user retrieved");
});
