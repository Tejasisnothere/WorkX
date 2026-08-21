import { z } from "zod";

import { JobStatus } from "../models/Job";

export const createJobSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  description: z.string().trim().min(1, "Description is required").max(5000),
  companyName: z.string().trim().min(1, "Company name is required").max(150),
  location: z.string().trim().min(1, "Location is required"),
  jobType: z.string().trim().min(1, "Job type is required"),
  salary: z.string().trim().max(100).optional(),
  skills: z.array(z.string().trim()).optional(),
});

// Same shape as create, but every field optional — PATCH allows partial
// updates. `.strict()` still rejects unknown fields (e.g. employerId).
export const updateJobSchema = z
  .object({
    title: z.string().trim().min(1).max(150).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    companyName: z.string().trim().min(1).max(150).optional(),
    location: z.string().trim().min(1).optional(),
    jobType: z.string().trim().min(1).optional(),
    salary: z.string().trim().max(100).optional(),
    skills: z.array(z.string().trim()).optional(),
    status: z.nativeEnum(JobStatus).optional(),
  })
  .strict();

// Query params arrive as strings; coerce page/limit to numbers with
// sane defaults and bounds so pagination can't be abused (e.g. limit=100000).
export const jobQuerySchema = z.object({
  search: z.string().trim().optional(),
  location: z.string().trim().optional(),
  jobType: z.string().trim().optional(),
  skills: z.string().trim().optional(), // comma-separated, split in the service
  status: z.nativeEnum(JobStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// GET /jobs/my only needs pagination — no search/filter fields apply to
// "jobs I own".
export const myJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
