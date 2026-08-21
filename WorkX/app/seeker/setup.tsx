import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";

import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";

import InterviewProgress from "@/components/interview/InterviewProgress";
import InterviewQuestion from "@/components/interview/InterviewQuestion";
import VoiceAnswer from "@/components/interview/VoiceAnswer";
import TextAnswer from "@/components/interview/TextAnswer";

import {useAIInterview} from "@/hooks/use-AI-interview";
import {useVoiceRecorder} from "@/hooks/useVoiceRecorder";

import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

/*
 * TEMPORARY USER DATA
 *
 * Later these values will come from:
 * Registration
 * Location
 * Profession
 * Saved user/session state
 */
const interviewUser = {
  phone: "3454245569",
  name: "Tanishq",
  age: 35,
  lat: 55.5,
  long: 34,
  language: "english",
  profession: "software engineer",
};

export default function SeekerSetupScreen() {
  const {t} = useTranslation();

  const {
    question,
    questionNumber,
    totalQuestions,
    status,
    error,
    start,
    submitAudio,
  } = useAIInterview(interviewUser);

  const {
    isRecording,
    durationMillis,
    startRecording,
    stopRecording,
    error: recorderError,
  } = useVoiceRecorder({
    onRecordingComplete: async (uri) => {
      await submitAudio(uri);
    },
  });

  /*
   * Interview completed
   */
  if (status === "completed") {
    return (
      <View style={styles.completedContainer}>
        <View style={styles.completedIcon}>
          <Ionicons
            name="checkmark"
            size={42}
            color={colors.success}
          />
        </View>

        <Text style={styles.completedTitle}>
          {t("interview.completedTitle")}
        </Text>

        <Text style={styles.completedDescription}>
          {t("interview.completedDescription")}
        </Text>
      </View>
    );
  }

  /*
   * Starting interview
   */
  if (status === "starting") {
    return (
      <View style={styles.centered}>
        <Loading
          message={t("interview.starting")}
        />
      </View>
    );
  }

  /*
   * Interview error
   */
  if (status === "error") {
    return (
      <View style={styles.centered}>
        <ErrorState
          title={t("interview.errorTitle")}
          description={
            error ?? t("interview.error")
          }
          onRetry={start}
        />
      </View>
    );
  }

  /*
   * Normal interview screen
   */
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}

        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            {t("interview.profileSetup")}
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Progress */}

        <InterviewProgress
          current={questionNumber}
          total={totalQuestions}
        />

        {/* Question */}

        {question && (
          <InterviewQuestion
            question={question}
          />
        )}

        {/* Voice input */}

        <VoiceAnswer
          recording={isRecording}
          disabled={
            status === "submitting" ||
            status === "starting"
          }
          onStart={startRecording}
          onStop={stopRecording}
        />

        {/* Recording duration */}

        {isRecording && (
          <Text style={styles.recordingTime}>
            {formatDuration(durationMillis)}
          </Text>
        )}

        {/* Recorder error */}

        {recorderError && (
          <Text style={styles.recorderError}>
            {recorderError}
          </Text>
        )}

        {/* Text answer */}

        <TextAnswer
          value=""
          onChangeText={() => {}}
          onSubmit={() => {
            // Text API will be connected later.
          }}
          disabled={
            status === "submitting" ||
            isRecording
          }
        />

        {/* Uploading answer */}

        {status === "submitting" && (
          <View style={styles.submitting}>
            <Loading
              message={t(
                "interview.submitting",
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function formatDuration(
  milliseconds: number,
) {
  const totalSeconds = Math.floor(
    milliseconds / 1000,
  );

  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const seconds =
    totalSeconds % 60;

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: "700",
  },

  headerSpacer: {
    width: 40,
  },

  recordingTime: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: "center",
    marginTop: spacing.md,
  },

  recorderError: {
    ...typography.caption,
    color: colors.error,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  submitting: {
    marginTop: spacing.lg,
  },

  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  completedContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  completedIcon: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },

  completedTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },

  completedDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});