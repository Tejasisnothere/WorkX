import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

type AuthMode = "register" | "login";

type AuthModeToggleProps = {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

export default function AuthModeToggle({ mode, onChange }: AuthModeToggleProps) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      <ModeOption
        label="Create account"
        selected={mode === "register"}
        onPress={() => onChange("register")}
      />
      <ModeOption
        label="Sign in"
        selected={mode === "login"}
        onPress={() => onChange("login")}
      />
    </View>
  );
}

function ModeOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected && styles.selectedOption,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.xl,
  },
  option: {
    flex: 1,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
  },
  selectedOption: {
    backgroundColor: colors.surface,
  },
  optionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  selectedOptionText: {
    color: colors.text,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.75,
  },
});
