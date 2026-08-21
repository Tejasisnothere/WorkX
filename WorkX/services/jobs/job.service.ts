import { apiRequest } from "@/services/api";
import { getAuthToken } from "@/services/auth/auth.service";

export type Job = {
  _id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: string;
  salary?: string;
  skills: string[];
  status: "OPEN" | "CLOSED";
  createdAt: string;
};

type PaginatedJobs = {
  jobs: Job[];
  pagination: { page: number; limit: number; totalItems: number; totalPages: number };
};

export async function getOpenJobs(limit = 10): Promise<PaginatedJobs> {
  const token = await getAuthToken();
  if (!token) throw new Error("No authenticated session");

  return apiRequest<PaginatedJobs>(`/jobs?status=OPEN&page=1&limit=${limit}`, {}, token);
}
