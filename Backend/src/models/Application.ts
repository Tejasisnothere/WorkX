import { Document, model, Schema, Types } from "mongoose";

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  SHORTLISTED = "SHORTLISTED",
  REJECTED = "REJECTED",
  HIRED = "HIRED",
}

export interface IApplication extends Document {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  seekerId: Types.ObjectId;
  employerId: Types.ObjectId;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    seekerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // Denormalized from the job at application time so employer-scoped
    // queries (GET /applications/:id ownership check) don't need an extra
    // Job lookup on every request.
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
    },
  },
  { timestamps: true }
);

// A seeker may only apply to a given job once.
applicationSchema.index({ seekerId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ employerId: 1 });
applicationSchema.index({ jobId: 1 });

export const Application = model<IApplication>("Application", applicationSchema);
