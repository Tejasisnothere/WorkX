import { Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { ValidatedQueryRequest } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { getSavedJobs, saveJob, unsaveJob } from "../services/savedJob.service";

interface SavedJobsQuery {
  page: number;
  limit: number;
}

export const save = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const savedJob = await saveJob(req.user!.userId, req.params.jobId);
  sendSuccess(res, { savedJob }, "Job saved successfully", 201);
});

export const unsave = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await unsaveJob(req.user!.userId, req.params.jobId);
  sendSuccess(res, null, "Job removed from saved jobs");
});

export const list = asyncHandler(
  async (req: AuthenticatedRequest & ValidatedQueryRequest<SavedJobsQuery>, res: Response) => {
    const { page, limit } = req.validatedQuery!;
    const result = await getSavedJobs(req.user!.userId, page, limit);
    sendSuccess(res, result, "Saved jobs retrieved");
  }
);
