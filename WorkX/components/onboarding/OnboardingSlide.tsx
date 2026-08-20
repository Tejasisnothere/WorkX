import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing, radius, typography } from "@/theme";

type OnboardingSlideProps = {
  title: string;
  description: string;
  step: number;
  totalSteps: number;
  buttonLabel: string;
  skipLabel?: string;
  onContinue: () => void;
  onSkip?: () => void;
};

export default function OnboardingSlide({
  title,
  description,
  step,
  totalSteps,
  buttonLabel,
  skipLabel,
  onContinue,
  onSkip,
}: OnboardingSlideProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Illustration placeholder */}
        <View style={styles.illustration}>
          <View style={styles.illustrationCircle}>
            <Text style={styles.illustrationText}>{step}</Text>
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.pagination}>
          {Array.from({ length: totalSteps }).map((_, index) => {
            const active = index + 1 === step;

            return (
              <View
                key={index}
                style={[styles.dot, active && styles.activeDot]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        {onSkip && skipLabel && (
          <Pressable onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}></Text>
          </Pressable>
        )}

        <Pressable onPress={onContinue} style={styles.continueButton}>
          <Text style={styles.continueText}>{buttonLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  illustration: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },

  illustrationCircle: {
    width: 150,
    height: 150,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  illustrationText: {
    fontSize: 56,
    fontWeight: "700",
    color: colors.primary,
  },

  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.md,
  },

  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 340,
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },

  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  skipButton: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  skipText: {
    ...typography.button,
    color: colors.textSecondary,
  },

  continueButton: {
    flex: 2,
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  continueText: {
    ...typography.button,
    color: colors.text,
  },
});
