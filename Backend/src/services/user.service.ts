import { IUser, IUserProfile, User } from "../models/User";
import { AppError } from "../middleware/error.middleware";

export interface UpdateProfileInput {
  name?: string;
  profile?: IUserProfile;
}

export async function getMyProfile(userId: string): Promise<IUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
}

/**
 * Updates only the requesting user's own document. There is no target-user
 * parameter by design — the userId always comes from the authenticated
 * JWT (req.user.userId), so a user can never modify anyone else's profile.
 */
export async function updateMyProfile(userId: string, input: UpdateProfileInput): Promise<IUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (input.name !== undefined) {
    user.name = input.name.trim();
  }

  if (input.profile !== undefined) {
    user.profile = {
      ...user.profile,
      ...input.profile,
    };
  }

  await user.save();
  return user;
}
