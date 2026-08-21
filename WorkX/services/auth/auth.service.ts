import AsyncStorage from "@react-native-async-storage/async-storage";

import {apiRequest} from "@/services/api";

const AUTH_TOKEN_KEY = "auth_token";

export type ApiUserRole = "SEEKER" | "EMPLOYER";

export type AuthUser = {
  _id: string;
  name: string;
  phoneNumber: string;
  role: ApiUserRole;
  profile?: {
    bio?: string;
    location?: string;
    skills?: string[];
    experience?: string[];
  };
};

type AuthResponse = {
  user: AuthUser;
  token: string;
};

export async function registerUser(input: {
  name: string;
  phoneNumber: string;
  password: string;
  role: ApiUserRole;
}): Promise<AuthResponse> {
  const result = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      name: input.name.trim(),
      phoneNumber: input.phoneNumber.replace(/\s+/g, ""),
    }),
  });

  await saveAuthToken(result.token);
  return result;
}

export async function loginUser(input: {
  phoneNumber: string;
  password: string;
}): Promise<AuthResponse> {
  const result = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  await saveAuthToken(result.token);
  return result;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("No authenticated session");
  }

  const result = await apiRequest<{user: AuthUser}>("/auth/me", {}, token);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  const token = await getAuthToken();

  try {
    if (token) {
      await apiRequest<null>("/auth/logout", {
        method: "POST",
      }, token);
    }
  } finally {
    await clearAuthToken();
  }
}

export async function saveAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export async function clearAuthToken(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}