import {
  Text,
  View,
  StyleSheet,
} from "react-native";

import {colors, spacing, typography} from "@/theme";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
};

export default function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && (
        <View style={styles.icon}>
          {icon}
        </View>
      )}

      <Text style={styles.title}>
        {title}
      </Text>

      {description && (
        <Text style={styles.description}>
          {description}
        </Text>
      )}

      {action && (
        <View style={styles.action}>
          {action}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  icon: {
    marginBottom: spacing.lg,
  },

  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },

  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },

  action: {
    marginTop: spacing.sm,
  },
});