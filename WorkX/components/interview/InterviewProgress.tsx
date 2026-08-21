import {StyleSheet, Text, View} from "react-native";
import {useTranslation} from "react-i18next";

import {
  colors,
  spacing,
  typography,
} from "@/theme";

type InterviewProgressProps = {
  current: number;
  total: number;
};

export default function InterviewProgress({
  current,
  total,
}: InterviewProgressProps) {
  const {t} = useTranslation();

  const progress = current / total;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t("interview.profileSetup")}
        </Text>

        <Text style={styles.step}>
          {t("interview.step", {
            current,
            total,
          })}
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            {
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },

  title: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: "700",
  },

  step: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },

  track: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 999,
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
});