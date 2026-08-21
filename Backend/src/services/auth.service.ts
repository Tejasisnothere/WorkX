import { IUser, User } from "../models/User";
import { UserRole } from "../utils/roles";
import { AppError } from "../middleware/error.middleware";
import { signToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

export interface RegisterInput {
  name: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
}

export interface LoginInput {
  phoneNumber: string;
  password: string;
}

export interface AuthResult {
  user: IUser;
  token: string;
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const phoneNumber = input.phoneNumber.trim();

  const existing = await User.findOne({ phoneNumber });
  if (existing) {
    throw new AppError("Phone number is already registered", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await User.create({
    name: input.name.trim(),
    phoneNumber,
    passwordHash,
    role: input.role,
    profile: {},
  });

  const token = signToken({ userId: user._id.toString(), role: user.role });

  return { user, token };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const phoneNumber = input.phoneNumber.trim();

  // passwordHash has `select: false` on the schema, so it must be
  // explicitly requested here for comparison.
  const user = await User.findOne({ phoneNumber }).select("+passwordHash");

  if (!user) {
    throw new AppError("Invalid phone number or password", 401);
  }

  const isMatch = await comparePassword(input.password, user.passwordHash);
  if (!isMatch) {
    throw new AppError("Invalid phone number or password", 401);
  }

  const token = signToken({ userId: user._id.toString(), role: user.role });

  return { user, token };
}

export async function getUserById(userId: string): Promise<IUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
}
