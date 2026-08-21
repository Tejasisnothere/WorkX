import { apiRequest } from "@/services/api";
import { getAuthToken } from "@/services/auth/auth.service";

type ApplicationStatus = "APPLIED" | "SHORTLISTED" | "REJECTED" | "HIRED";

type ApplicationsResponse = {
  applications: Array<{ _id: string; status: ApplicationStatus }>;
  pagination: { totalItems: number };
};

export async function getMyApplications(): Promise<ApplicationsResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("No authenticated session");

  return apiRequest<ApplicationsResponse>("/applications/me?page=1&limit=50", {}, token);
}
