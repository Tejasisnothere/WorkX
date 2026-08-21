import { Document, model, Schema, Types } from "mongoose";

export enum JobStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface IJob extends Document {
  _id: Types.ObjectId;
  employerId: Types.ObjectId;
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: string;
  salary?: string;
  skills: string[];
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    companyName: { type: String, required: true, trim: true, maxlength: 150 },
    location: { type: String, required: true, trim: true },
    jobType: { type: String, required: true, trim: true },
    salary: { type: String, trim: true },
    skills: { type: [String], default: [] },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.OPEN,
    },
  },
  { timestamps: true }
);

// Reasonable indexes for the filtering/search this stage requires.
jobSchema.index({ employerId: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });
// Text index supports the free-text `search` query param against
// title/description/companyName without pulling in Elasticsearch.
jobSchema.index({ title: "text", description: "text", companyName: "text" });

export const Job = model<IJob>("Job", jobSchema);
