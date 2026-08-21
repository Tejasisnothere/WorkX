import {View, StyleSheet, ViewProps} from "react-native";

import {colors, spacing, radius} from "@/theme";

type CardProps = ViewProps & {
  children: React.ReactNode;
};

export default function Card({
  children,
  style,
  ...props
}: CardProps) {
  return (
    <View
      {...props}
      style={[styles.card, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
});