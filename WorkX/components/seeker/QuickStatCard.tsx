import {Text, View, StyleSheet} from "react-native";

import {colors, spacing, radius, typography} from "@/theme";

type QuickStatVariant = "primary" | "success";

type QuickStatCardProps = {
  value: string;
  label: string;
  description: string;
  variant?: QuickStatVariant;
};

export default function QuickStatCard({
  value,
  label,
  description,
  variant = "primary",
}: QuickStatCardProps) {
  const valueColor =
    variant === "success"
      ? colors.success
      : colors.primary;

  return (
    <View style={styles.card}>
      <Text
        style={[
          styles.value,
          {color: valueColor},
        ]}
      >
        {value} {label}
      </Text>

      <Text
        style={styles.description}
        numberOfLines={2}
      >
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 72,
  },

  value: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },

  description: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});