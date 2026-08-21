import type {
  InterviewResponse,
  InterviewUser,
} from "./types";

const AI_BASE_URL = "https://andrews-bag-whole-competing.trycloudflare.com";

export async function startInterview(
  user: InterviewUser,
): Promise<InterviewResponse> {
  const payload = {
    name: user.name,
    profession: user.profession,
    age: user.age,
    phone: user.phone,
    lat: user.lat,
    long: user.long,
    language: user.language,
  };

  const response = await fetch(
    `${AI_BASE_URL}/interview/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();

    console.error(
      "START ERROR:",
      response.status,
      errorBody,
    );

    throw new Error(
      `Failed to start interview: ${response.status}`,
    );
  }

  const data =
    (await response.json()) as InterviewResponse;

  console.log("START RESPONSE:", data);

  return data;
}

export async function submitAudioAnswer(
  user: InterviewUser,
  audioUri: string,
): Promise<InterviewResponse> {
  const formData = new FormData();

  // formData.append("name", user.name);
  // formData.append("profession", user.profession);
  // formData.append("age", String(user.age));
  formData.append("phone", user.phone);
  // formData.append("lat", String(user.lat));
  // formData.append("long", String(user.long));
  // formData.append("language", user.language);

  formData.append("audio", {
    uri: audioUri,
    name: "answer.m4a",
    type: "audio/m4a",
  } as any);

  console.log(formData);

  const response = await fetch(
    `${AI_BASE_URL}/interview/answer`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();

    console.error(
      "AUDIO ERROR:",
      response.status,
      errorBody,
    );

    throw new Error(
      `Failed to submit audio: ${response.status}`,
    );
  }

  const data =
    (await response.json()) as InterviewResponse;

  console.log("AUDIO RESPONSE:", data);

  return data;
}