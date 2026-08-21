import { FilterQuery } from "mongoose";

import { ISavedJob, SavedJob } from "../models/SavedJob";
import { Job } from "../models/Job";
import { AppError } from "../middleware/error.middleware";
import { buildPagination, paginationSkip } from "../utils/pagination";
import { isDuplicateKeyError } from "../utils/mongoErrors";

export interface PaginatedSavedJobs {
  savedJobs: ISavedJob[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export async function saveJob(seekerId: string, jobId: string): Promise<ISavedJob> {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const existing = await SavedJob.findOne({ seekerId, jobId });
  if (existing) {
    throw new AppError("You have already saved this job", 409);
  }

  try {
    return await SavedJob.create({ seekerId, jobId });
  } catch (err: unknown) {
    // Race condition fallback: two concurrent requests both pass the
    // findOne check above, but only one insert can win against the
    // unique(seekerId, jobId) index.
    if (isDuplicateKeyError(err)) {
      throw new AppError("You have already saved this job", 409);
    }
    throw err;
  }
}

export async function unsaveJob(seekerId: string, jobId: string): Promise<void> {
  const result = await SavedJob.findOneAndDelete({ seekerId, jobId });
  if (!result) {
    throw new AppError("Saved job not found", 404);
  }
}

export async function getSavedJobs(seekerId: string, page: number, limit: number): Promise<PaginatedSavedJobs> {
  const filter: FilterQuery<ISavedJob> = { seekerId };
  const skip = paginationSkip(page, limit);

  const [savedJobs, totalItems] = await Promise.all([
    SavedJob.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("jobId"),
    SavedJob.countDocuments(filter),
  ]);

  return {
    savedJobs,
    pagination: buildPagination(page, limit, totalItems),
  };
}
