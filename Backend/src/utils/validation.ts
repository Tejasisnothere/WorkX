import { z } from "zod";

import { UserRole } from "./roles";

// Loose E.164-style validation: optional leading "+", 8-15 digits total,
// first digit non-zero. Simple on purpose — no country-specific rules,
// no SMS/OTP verification (out of scope for this stage).
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

const phoneNumberField = z
  .string()
  .trim()
  .regex(PHONE_REGEX, "Invalid phone number format (use digits only, optionally prefixed with +)");

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phoneNumber: phoneNumberField,
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Role must be SEEKER or EMPLOYER" }),
  }),
});

export const loginSchema = z.object({
  phoneNumber: phoneNumberField,
  password: z.string().min(1, "Password is required"),
});

const profileSchema = z
  .object({
    bio: z.string().max(1000).optional(),
    location: z.string().max(200).optional(),
    skills: z.array(z.string()).optional(),
    experience: z.array(z.string()).optional(),
  })
  .strict();

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    profile: profileSchema.optional(),
  })
  .strict();
