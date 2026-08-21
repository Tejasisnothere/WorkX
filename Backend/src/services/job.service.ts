import { FilterQuery } from "mongoose";

import { IJob, Job, JobStatus } from "../models/Job";
import { AppError } from "../middleware/error.middleware";
import { buildPagination, paginationSkip } from "../utils/pagination";
import { escapeRegex } from "../utils/mongoErrors";

export interface CreateJobInput {
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: string;
  salary?: string;
  skills?: string[];
}

export interface UpdateJobInput {
  title?: string;
  description?: string;
  companyName?: string;
  location?: string;
  jobType?: string;
  salary?: string;
  skills?: string[];
  status?: JobStatus;
}

export interface JobQuery {
  search?: string;
  location?: string;
  jobType?: string;
  skills?: string; // comma-separated
  status?: JobStatus;
  page: number;
  limit: number;
}

export interface PaginatedJobs {
  jobs: IJob[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export async function createJob(employerId: string, input: CreateJobInput): Promise<IJob> {
  const job = await Job.create({
    employerId,
    title: input.title,
    description: input.description,
    companyName: input.companyName,
    location: input.location,
    jobType: input.jobType,
    salary: input.salary,
    skills: input.skills || [],
    // status defaults to OPEN via the schema — not set explicitly here.
  });

  return job;
}

export async function listJobs(query: JobQuery): Promise<PaginatedJobs> {
  const filter: FilterQuery<IJob> = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.location) {
    // User input is escaped before being embedded in a RegExp — otherwise
    // regex metacharacters in the query param could throw or cause
    // catastrophic backtracking (ReDoS) against the collection.
    filter.location = { $regex: escapeRegex(query.location), $options: "i" };
  }
  if (query.jobType) {
    filter.jobType = { $regex: `^${escapeRegex(query.jobType)}$`, $options: "i" };
  }
  if (query.skills) {
    const skillList = query.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillList.length > 0) {
      filter.skills = { $in: skillList.map((s) => new RegExp(`^${escapeRegex(s)}$`, "i")) };
    }
  }
  if (query.status) {
    filter.status = query.status;
  }

  const skip = paginationSkip(query.page, query.limit);

  const [jobs, totalItems] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    pagination: buildPagination(query.page, query.limit, totalItems),
  };
}

export async function getJobById(jobId: string): Promise<IJob> {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  return job;
}

export async function getMyJobs(employerId: string, page: number, limit: number): Promise<PaginatedJobs> {
  const filter: FilterQuery<IJob> = { employerId };
  const skip = paginationSkip(page, limit);

  const [jobs, totalItems] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    pagination: buildPagination(page, limit, totalItems),
  };
}

/**
 * Loads a job and verifies the requesting employer owns it. Used by both
 * update and delete so ownership is enforced in exactly one place.
 */
async function getOwnedJobOrThrow(jobId: string, employerId: string): Promise<IJob> {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  if (job.employerId.toString() !== employerId) {
    throw new AppError("You do not have permission to modify this job", 403);
  }
  return job;
}

export async function updateJob(jobId: string, employerId: string, input: UpdateJobInput): Promise<IJob> {
  const job = await getOwnedJobOrThrow(jobId, employerId);

  Object.assign(job, input);
  await job.save();

  return job;
}

export async function deleteJob(jobId: string, employerId: string): Promise<void> {
  const job = await getOwnedJobOrThrow(jobId, employerId);
  await job.deleteOne();
}
