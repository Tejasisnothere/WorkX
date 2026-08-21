import { z } from "zod";

// Kept simple per Stage 5 scope — no filters, just pagination.
export const savedJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
