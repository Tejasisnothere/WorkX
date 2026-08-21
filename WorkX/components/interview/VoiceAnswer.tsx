import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

type VoiceAnswerProps = {
  recording: boolean;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
};

export default function VoiceAnswer({
  recording,
  disabled = false,
  onStart,
  onStop,
}: VoiceAnswerProps) {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Pressable
        disabled={disabled}
        onPress={recording ? onStop : onStart}
        style={[
          styles.button,
          recording && styles.recording,
          disabled && styles.disabled,
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={
              recording
                ? "stop"
                : "mic-outline"
            }
            size={24}
            color={colors.primary}
          />
        </View>

        <Text style={styles.text}>
          {recording
            ? t("interview.stopRecording")
            : t("interview.tapToSpeak")}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  button: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,

    paddingHorizontal: spacing.lg,
  },

  recording: {
    borderColor: colors.error,
    backgroundColor: colors.surface,
  },

  disabled: {
    opacity: 0.5,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight: spacing.md,
  },

  text: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
});