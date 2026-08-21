import {useCallback, useEffect, useState} from "react";

import {
  startInterview,
  submitAudioAnswer,
} from "@/services/AI/aiInterview.service";

import type {
  InterviewStatus,
  InterviewUser,
} from "@/services/AI/types";

const TOTAL_QUESTIONS = 7;

export function useAIInterview(
  user: InterviewUser,
) {
  const [question, setQuestion] =
    useState<string | null>(null);

  const [questionNumber, setQuestionNumber] =
    useState(1);

  const [status, setStatus] =
    useState<InterviewStatus>("starting");

  const [error, setError] =
    useState<string | null>(null);

  const start = useCallback(async () => {
    try {
      setStatus("starting");
      setError(null);

      const result =
        await startInterview(user);

      if (result.completed) {
        setStatus("completed");
        return;
      }

      if (!result.question) {
        throw new Error(
          "AI did not return the first question.",
        );
      }

      setQuestion(result.question);
      setQuestionNumber(1);
      setStatus("ready");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start interview.",
      );

      setStatus("error");
    }
  }, [user]);

  useEffect(() => {
    start();
  }, [start]);

  const submitAudio = async (
    audioUri: string,
  ) => {
    try {
      setStatus("submitting");
      setError(null);

      const result =
        await submitAudioAnswer(
          user,
          audioUri,
        );

      if (result.completed) {
        setStatus("completed");
        return;
      }

      if (!result.question) {
        throw new Error(
          "AI did not return the next question.",
        );
      }

      setQuestion(result.question);

      setQuestionNumber((current) =>
        current + 1,
      );

      setStatus("ready");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit answer.",
      );

      setStatus("error");
    }
  };

  return {
    question,
    questionNumber,
    totalQuestions: TOTAL_QUESTIONS,
    status,
    error,
    start,
    submitAudio,
  };
}