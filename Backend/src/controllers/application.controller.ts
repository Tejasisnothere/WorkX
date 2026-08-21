import { Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { ValidatedQueryRequest } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { UserRole } from "../utils/roles";
import {
  applyToJob,
  getApplicationById,
  getApplicationsForJob,
  getMyApplications,
  updateApplicationStatus,
} from "../services/application.service";

interface ApplicationsQuery {
  page: number;
  limit: number;
}

export const apply = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const application = await applyToJob(req.user!.userId, req.params.jobId);
  sendSuccess(res, { application }, "Application submitted successfully", 201);
});

export const getMine = asyncHandler(
  async (req: AuthenticatedRequest & ValidatedQueryRequest<ApplicationsQuery>, res: Response) => {
    const { page, limit } = req.validatedQuery!;
    const result = await getMyApplications(req.user!.userId, page, limit);
    sendSuccess(res, result, "Your applications retrieved");
  }
);

export const getForJob = asyncHandler(
  async (req: AuthenticatedRequest & ValidatedQueryRequest<ApplicationsQuery>, res: Response) => {
    const { page, limit } = req.validatedQuery!;
    const result = await getApplicationsForJob(req.params.jobId, req.user!.userId, page, limit);
    sendSuccess(res, result, "Applications retrieved");
  }
);

export const getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user!.role === UserRole.SEEKER ? "SEEKER" : "EMPLOYER";
  const application = await getApplicationById(req.params.id, req.user!.userId, role);
  sendSuccess(res, { application }, "Application retrieved");
});

export const updateStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const application = await updateApplicationStatus(req.params.id, req.user!.userId, req.body.status);
  sendSuccess(res, { application }, "Application status updated");
});
