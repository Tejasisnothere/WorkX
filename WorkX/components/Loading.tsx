import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
} from "react-native";

import {colors, spacing, typography} from "@/theme";

type LoadingProps = {
  message?: string;
};

export default function Loading({
  message = "Loading...",
}: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={colors.primary}
      />

      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  message: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});