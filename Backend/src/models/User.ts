import { Document, model, Schema, Types } from "mongoose";

import { UserRole } from "../utils/roles";

export interface IUserProfile {
  bio?: string;
  location?: string;
  skills?: string[];
  experience?: string[];
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  phoneNumber: string;
  passwordHash: string;
  role: UserRole;
  profile: IUserProfile;
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    bio: { type: String, trim: true, maxlength: 1000 },
    location: { type: String, trim: true },
    skills: { type: [String], default: [] },
    experience: { type: [String], default: [] },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    // phoneNumber is the account identity / login credential (no email in
    // this app). Stored in a normalized form — see utils/validation.ts for
    // the format enforced at the request-validation layer.
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    profile: { type: userProfileSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// Note: `unique: true` on the phoneNumber field above already creates this
// index — no need to also call schema.index({ phoneNumber: 1 }).

// Ensure passwordHash never leaks through JSON responses, even if a
// document is serialized without explicitly excluding it.
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const { passwordHash, ...rest } = ret;
    return rest;
  },
});

export const User = model<IUser>("User", userSchema);
