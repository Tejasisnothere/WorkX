import { Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { getMyProfile, updateMyProfile } from "../services/user.service";

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await getMyProfile(req.user!.userId);
  sendSuccess(res, { user }, "Profile retrieved");
});

export const updateMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await updateMyProfile(req.user!.userId, req.body);
  sendSuccess(res, { user }, "Profile updated");
});
