export type InterviewUser = {
  phone: string;
  name: string;
  age: number
  lat: number;
  long: number;
  language: string;
  profession: string;
};

export type InterviewStatus =
  | "starting"
  | "ready"
  | "recording"
  | "submitting"
  | "completed"
  | "error";

export type InterviewResponse = {
  thread_id: string;
  status: "in_progress" | "completed";
  question?: string;
};