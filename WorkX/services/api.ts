import {Platform} from "react-native";

const defaultApiUrl =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000/api/v1"
    : "http://localhost:5000/api/v1";

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? defaultApiUrl).replace(/\/$/, "");

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `Unable to reach the WorkX server at ${API_URL}. For Expo Go on a physical phone, set EXPO_PUBLIC_API_URL in .env to your computer's Wi-Fi IP; 10.0.2.2 works only in an Android emulator.`,
    );
  }

  const responseText = await response.text();
  let body: {
    data?: T;
    message?: string;
  } = {};

  if (responseText) {
    try {
      body = JSON.parse(responseText) as typeof body;
    } catch {
      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }
      throw new Error("The WorkX server returned an invalid response.");
    }
  }

  if (!response.ok) {
    throw new Error(body.message ?? "Request failed");
  }

  return body.data as T;
}
