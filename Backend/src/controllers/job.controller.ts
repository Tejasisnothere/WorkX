import { Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { ValidatedQueryRequest } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../middleware/error.middleware";
import {
  createJob,
  deleteJob,
  getJobById,
  getMyJobs,
  JobQuery,
  listJobs,
  updateJob,
} from "../services/job.service";

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const job = await createJob(req.user!.userId, req.body);
  sendSuccess(res, { job }, "Job created successfully", 201);
});

export const list = asyncHandler(async (req: ValidatedQueryRequest<JobQuery>, res: Response) => {
  const result = await listJobs(req.validatedQuery!);
  sendSuccess(res, result, "Jobs retrieved");
});

export const getById = asyncHandler(async (req, res: Response) => {
  const job = await getJobById(req.params.id);
  sendSuccess(res, { job }, "Job retrieved");
});

export const getMine = asyncHandler(async (req: AuthenticatedRequest & ValidatedQueryRequest, res: Response) => {
  const { page, limit } = (req.validatedQuery as { page: number; limit: number }) || { page: 1, limit: 10 };
  const result = await getMyJobs(req.user!.userId, page, limit);
  sendSuccess(res, result, "Your jobs retrieved");
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.params.id) {
    throw new AppError("Job id is required", 400);
  }
  const job = await updateJob(req.params.id, req.user!.userId, req.body);
  sendSuccess(res, { job }, "Job updated successfully");
});

export const remove = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await deleteJob(req.params.id, req.user!.userId);
  sendSuccess(res, null, "Job deleted successfully");
});
