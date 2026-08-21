import { Document, model, Schema, Types } from "mongoose";

export interface ISavedJob extends Document {
  _id: Types.ObjectId;
  seekerId: Types.ObjectId;
  jobId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const savedJobSchema = new Schema<ISavedJob>(
  {
    seekerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  },
  { timestamps: true }
);

// A seeker may only save a given job once.
savedJobSchema.index({ seekerId: 1, jobId: 1 }, { unique: true });

export const SavedJob = model<ISavedJob>("SavedJob", savedJobSchema);
