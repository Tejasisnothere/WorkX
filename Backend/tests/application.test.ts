import { Application as ExpressApp } from "express";
import request from "supertest";

import { createApp } from "../src/app";
import { UserRole } from "../src/utils/roles";
import { createJob, registerUser } from "./helpers";

const app: ExpressApp = createApp();

describe("Stage 4: Job Applications", () => {
  test("1. seeker applies to a job", async () => {
    const employer = await registerUser(app, UserRole.EMPLOYER);
    const seeker = await registerUser(app, UserRole.SEEKER);
    const jobId = await createJob(app, employer.token);

    const res = await request(app)
      .post(`/api/v1/jobs/${jobId}/apply`)
      .set("Authorization", `Bearer ${seeker.token}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.application.status).toBe("APPLIED");
    expect(res.body.data.application.seekerId).toBe(seeker.userId);
    expect(res.body.data.application.jobId).toBe(jobId);
  });

  test("2. duplicate application is rejected", async () => {
    const employer = await registerUser(app, UserRole.EMPLOYER);
    const seeker = await registerUser(app, UserRole.SEEKER);
    const jobId = await createJob(app, employer.token);

    const first = await request(app)
      .post(`/api/v1/jobs/${jobId}/apply`)
      .set("Authorization", `Bearer ${seeker.token}`);
    expect(first.status).toBe(201);

    const second = await request(app)
      .post(`/api/v1/jobs/${jobId}/apply`)
      .set("Authorization", `Bearer ${seeker.token}`);

    expect(second.status).toBe(409);
    expect(second.body.success).toBe(false);
    expect(second.body.message).toMatch(/already applied/i);
  });

  test("3. seeker sees their own applications", async () => {
    const employer = await registerUser(app, UserRole.EMPLOYER);
    const seekerA = await registerUser(app, UserRole.SEEKER);
    const seekerB = await registerUser(app, UserRole.SEEKER);
    const jobId = await createJob(app, employer.token);

    await request(app).post(`/api/v1/jobs/${jobId}/apply`).set("Authorization", `Bearer ${seekerA.token}`);
    await request(app).post(`/api/v1/jobs/${jobId}/apply`).set("Authorization", `Bearer ${seekerB.token}`);

    const res = await request(app).get("/api/v1/applications/me").set("Authorization", `Bearer ${seekerA.token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.applications).toHaveLength(1);
    expect(res.body.data.applications[0].seekerId).toBe(seekerA.userId);
  });

  test("4. employer sees applications for their job", async () => {
    const employer = await registerUser(app, UserRole.EMPLOYER);
    const otherEmployer = await registerUser(app, UserRole.EMPLOYER);
    const seekerA = await registerUser(app, UserRole.SEEKER);
    const seekerB = await registerUser(app, UserRole.SEEKER);
    const jobId = await createJob(app, employer.token);
    const otherJobId = await createJob(app, otherEmployer.token);

    await request(app).post(`/api/v1/jobs/${jobId}/apply`).set("Authorization", `Bearer ${seekerA.token}`);
    await request(app).post(`/api/v1/jobs/${jobId}/apply`).set("Authorization", `Bearer ${seekerB.token}`);
    await request(app).post(`/api/v1/jobs/${otherJobId}/apply`).set("Authorization", `Bearer ${seekerA.token}`);

    const res = await request(app)
      .get(`/api/v1/jobs/${jobId}/applications`)
      .set("Authorization", `Bearer ${employer.token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.applications).toHaveLength(2);
  });

  test("5. employer changes application status", async () => {
    const employer = await registerUser(app, UserRole.EMPLOYER);
    const seeker = await registerUser(app, UserRole.SEEKER);
    const jobId = await createJob(app, employer.token);

    const applyRes = await request(app)
      .post(`/api/v1/jobs/${jobId}/apply`)
      .set("Authorization", `Bearer ${seeker.token}`);
    const applicationId = applyRes.body.data.application._id ?? applyRes.body.data.application.id;

    const res = await request(app)
      .patch(`/api/v1/applications/${applicationId}`)
      .set("Authorization", `Bearer ${employer.token}`)
      .send({ status: "SHORTLISTED" });

    expect(res.status).toBe(200);
    expect(res.body.data.application.status).toBe("SHORTLISTED");
  });

  test("6. unauthorized employer cannot modify the application", async () => {
    const employer = await registerUser(app, UserRole.EMPLOYER);
    const otherEmployer = await registerUser(app, UserRole.EMPLOYER);
    const seeker = await registerUser(app, UserRole.SEEKER);
    const jobId = await createJob(app, employer.token);

    const applyRes = await request(app)
      .post(`/api/v1/jobs/${jobId}/apply`)
      .set("Authorization", `Bearer ${seeker.token}`);
    const applicationId = applyRes.body.data.application._id ?? applyRes.body.data.application.id;

    const res = await request(app)
      .patch(`/api/v1/applications/${applicationId}`)
      .set("Authorization", `Bearer ${otherEmployer.token}`)
      .send({ status: "REJECTED" });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test("7. seeker cannot modify application status", async () => {
    const employer = await registerUser(app, UserRole.EMPLOYER);
    const seeker = await registerUser(app, UserRole.SEEKER);
    const jobId = await createJob(app, employer.token);

    const applyRes = await request(app)
      .post(`/api/v1/jobs/${jobId}/apply`)
      .set("Authorization", `Bearer ${seeker.token}`);
    const applicationId = applyRes.body.data.application._id ?? applyRes.body.data.application.id;

    const res = await request(app)
      .patch(`/api/v1/applications/${applicationId}`)
      .set("Authorization", `Bearer ${seeker.token}`)
      .send({ status: "HIRED" });

    // requireRole(EMPLOYER) rejects the seeker before the service layer
    // even runs.
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test("8. seeker cannot apply to a closed job", async () => {
    const employer = await registerUser(app, UserRole.EMPLOYER);
    const seeker = await registerUser(app, UserRole.SEEKER);
    const jobId = await createJob(app, employer.token);

    const closeRes = await request(app)
      .patch(`/api/v1/jobs/${jobId}`)
      .set("Authorization", `Bearer ${employer.token}`)
      .send({ status: "CLOSED" });
    expect(closeRes.status).toBe(200);

    const res = await request(app)
      .post(`/api/v1/jobs/${jobId}/apply`)
      .set("Authorization", `Bearer ${seeker.token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/closed/i);
  });

  describe("additional access-control checks", () => {
    test("unauthenticated request to apply is rejected", async () => {
      const employer = await registerUser(app, UserRole.EMPLOYER);
      const jobId = await createJob(app, employer.token);

      const res = await request(app).post(`/api/v1/jobs/${jobId}/apply`);
      expect(res.status).toBe(401);
    });

    test("employer cannot apply to a job", async () => {
      const employer = await registerUser(app, UserRole.EMPLOYER);
      const otherEmployer = await registerUser(app, UserRole.EMPLOYER);
      const jobId = await createJob(app, employer.token);

      const res = await request(app)
        .post(`/api/v1/jobs/${jobId}/apply`)
        .set("Authorization", `Bearer ${otherEmployer.token}`);

      expect(res.status).toBe(403);
    });

    test("seeker cannot view another seeker's application by id", async () => {
      const employer = await registerUser(app, UserRole.EMPLOYER);
      const seekerA = await registerUser(app, UserRole.SEEKER);
      const seekerB = await registerUser(app, UserRole.SEEKER);
      const jobId = await createJob(app, employer.token);

      const applyRes = await request(app)
        .post(`/api/v1/jobs/${jobId}/apply`)
        .set("Authorization", `Bearer ${seekerA.token}`);
      const applicationId = applyRes.body.data.application._id ?? applyRes.body.data.application.id;

      const res = await request(app)
        .get(`/api/v1/applications/${applicationId}`)
        .set("Authorization", `Bearer ${seekerB.token}`);

      expect(res.status).toBe(403);
    });

    test("employer cannot view applications for a job they don't own", async () => {
      const employer = await registerUser(app, UserRole.EMPLOYER);
      const otherEmployer = await registerUser(app, UserRole.EMPLOYER);
      const seeker = await registerUser(app, UserRole.SEEKER);
      const jobId = await createJob(app, employer.token);

      await request(app).post(`/api/v1/jobs/${jobId}/apply`).set("Authorization", `Bearer ${seeker.token}`);

      const res = await request(app)
        .get(`/api/v1/jobs/${jobId}/applications`)
        .set("Authorization", `Bearer ${otherEmployer.token}`);

      expect(res.status).toBe(403);
    });

    test("owning employer can view a single application by id", async () => {
      const employer = await registerUser(app, UserRole.EMPLOYER);
      const seeker = await registerUser(app, UserRole.SEEKER);
      const jobId = await createJob(app, employer.token);

      const applyRes = await request(app)
        .post(`/api/v1/jobs/${jobId}/apply`)
        .set("Authorization", `Bearer ${seeker.token}`);
      const applicationId = applyRes.body.data.application._id ?? applyRes.body.data.application.id;

      const res = await request(app)
        .get(`/api/v1/applications/${applicationId}`)
        .set("Authorization", `Bearer ${employer.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.application._id ?? res.body.data.application.id).toBe(applicationId);
    });

    test("rejects an invalid status value on PATCH", async () => {
      const employer = await registerUser(app, UserRole.EMPLOYER);
      const seeker = await registerUser(app, UserRole.SEEKER);
      const jobId = await createJob(app, employer.token);

      const applyRes = await request(app)
        .post(`/api/v1/jobs/${jobId}/apply`)
        .set("Authorization", `Bearer ${seeker.token}`);
      const applicationId = applyRes.body.data.application._id ?? applyRes.body.data.application.id;

      const res = await request(app)
        .patch(`/api/v1/applications/${applicationId}`)
        .set("Authorization", `Bearer ${employer.token}`)
        .send({ status: "NOT_A_REAL_STATUS" });

      expect(res.status).toBe(400);
    });

    test("applying to a nonexistent job returns 404", async () => {
      const seeker = await registerUser(app, UserRole.SEEKER);
      const res = await request(app)
        .post("/api/v1/jobs/000000000000000000000000/apply")
        .set("Authorization", `Bearer ${seeker.token}`);

      expect(res.status).toBe(404);
    });
  });
});
