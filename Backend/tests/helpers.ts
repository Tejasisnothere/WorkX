import { Application as ExpressApp } from "express";
import request from "supertest";

import { UserRole } from "../src/utils/roles";

let phoneCounter = 1000;

function nextPhone(): string {
  phoneCounter += 1;
  return `+1555${phoneCounter}`;
}

export interface TestUser {
  token: string;
  userId: string;
  phoneNumber: string;
}

export async function registerUser(app: ExpressApp, role: UserRole, name = "Test User"): Promise<TestUser> {
  const phoneNumber = nextPhone();
  const res = await request(app).post("/api/v1/auth/register").send({
    name,
    phoneNumber,
    password: "password123",
    role,
  });

  if (res.status !== 201) {
    throw new Error(`Failed to register test user: ${res.status} ${JSON.stringify(res.body)}`);
  }

  return {
    token: res.body.data.token,
    userId: res.body.data.user._id ?? res.body.data.user.id,
    phoneNumber,
  };
}

export async function createJob(
  app: ExpressApp,
  employerToken: string,
  overrides: Partial<Record<string, unknown>> = {}
): Promise<string> {
  const res = await request(app)
    .post("/api/v1/jobs")
    .set("Authorization", `Bearer ${employerToken}`)
    .send({
      title: "Backend Engineer",
      description: "Build cool stuff",
      companyName: "Acme Inc",
      location: "Remote",
      jobType: "Full-time",
      skills: ["node", "typescript"],
      ...overrides,
    });

  if (res.status !== 201) {
    throw new Error(`Failed to create test job: ${res.status} ${JSON.stringify(res.body)}`);
  }

  return res.body.data.job._id ?? res.body.data.job.id;
}
