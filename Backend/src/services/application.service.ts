import { FilterQuery } from "mongoose";

import { Application, ApplicationStatus, IApplication } from "../models/Application";
import { Job, JobStatus } from "../models/Job";
import { AppError } from "../middleware/error.middleware";
import { buildPagination, paginationSkip } from "../utils/pagination";
import { isDuplicateKeyError } from "../utils/mongoErrors";

export interface PaginatedApplications {
  applications: IApplication[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

/**
 * Seeker applies to a job. Enforces: job exists and is open, and the
 * seeker hasn't already applied (belt-and-braces: checked here AND backed
 * by the unique compound index, in case of a race between two requests).
 */
export async function applyToJob(seekerId: string, jobId: string): Promise<IApplication> {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.status === JobStatus.CLOSED) {
    throw new AppError("This job is closed and no longer accepting applications", 400);
  }

  const existing = await Application.findOne({ seekerId, jobId });
  if (existing) {
    throw new AppError("You have already applied to this job", 409);
  }

  try {
    const application = await Application.create({
      jobId: job._id,
      seekerId,
      employerId: job.employerId,
      status: ApplicationStatus.APPLIED,
    });
    return application;
  } catch (err: unknown) {
    // Race condition fallback: two concurrent requests both pass the
    // findOne check above, but only one insert can win against the
    // unique(seekerId, jobId) index.
    if (isDuplicateKeyError(err)) {
      throw new AppError("You have already applied to this job", 409);
    }
    throw err;
  }
}

export async function getMyApplications(
  seekerId: string,
  page: number,
  limit: number
): Promise<PaginatedApplications> {
  const filter: FilterQuery<IApplication> = { seekerId };
  const skip = paginationSkip(page, limit);

  const [applications, totalItems] = await Promise.all([
    Application.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("jobId"),
    Application.countDocuments(filter),
  ]);

  return {
    applications,
    pagination: buildPagination(page, limit, totalItems),
  };
}

export async function getApplicationsForJob(
  jobId: string,
  employerId: string,
  page: number,
  limit: number
): Promise<PaginatedApplications> {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  if (job.employerId.toString() !== employerId) {
    throw new AppError("You do not have permission to view applications for this job", 403);
  }

  const filter: FilterQuery<IApplication> = { jobId };
  const skip = paginationSkip(page, limit);

  const [applications, totalItems] = await Promise.all([
    Application.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("seekerId"),
    Application.countDocuments(filter),
  ]);

  return {
    applications,
    pagination: buildPagination(page, limit, totalItems),
  };
}

/**
 * Loads an application and enforces view access: the seeker who applied,
 * or the employer who owns the job it's attached to.
 */
export async function getApplicationById(
  applicationId: string,
  requesterId: string,
  requesterRole: "SEEKER" | "EMPLOYER"
): Promise<IApplication> {
  // Fetch un-populated first so the ownership check compares raw
  // ObjectIds (populating first would swap seekerId's type at runtime).
  const application = await Application.findById(applicationId);
  if (!application) {
    throw new AppError("Application not found", 404);
  }

  const isOwningSeeker = requesterRole === "SEEKER" && application.seekerId.toString() === requesterId;
  const isOwningEmployer = requesterRole === "EMPLOYER" && application.employerId.toString() === requesterId;

  if (!isOwningSeeker && !isOwningEmployer) {
    throw new AppError("You do not have permission to view this application", 403);
  }

  await application.populate(["jobId", "seekerId"]);

  return application;
}

/**
 * Only the employer who owns the underlying job may change an
 * application's status. Seekers are never allowed to modify their own
 * application (they could otherwise self-promote to HIRED).
 */
export async function updateApplicationStatus(
  applicationId: string,
  employerId: string,
  status: ApplicationStatus
): Promise<IApplication> {
  const application = await Application.findById(applicationId);
  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (application.employerId.toString() !== employerId) {
    throw new AppError("You do not have permission to modify this application", 403);
  }

  application.status = status;
  await application.save();

  return application;
}
