import { z } from "zod";

import { ApplicationStatus } from "../models/Application";

export const updateApplicationStatusSchema = z
  .object({
    status: z.nativeEnum(ApplicationStatus, {
      errorMap: () => ({ message: "Status must be one of APPLIED, SHORTLISTED, REJECTED, HIRED" }),
    }),
  })
  .strict();

// Both listing endpoints (my applications / applications for a job) only
// need pagination — no filters required by this stage.
export const applicationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
