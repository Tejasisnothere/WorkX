import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { colors } from "@/theme/color";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonState = "default" | "disabled" | "loading";

type ButtonProps = {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  state?: ButtonState;
};

export default function Button({
  onPress,
  title,
  variant = "primary",
  state = "default",
}: ButtonProps) {
  const disabled = state === "disabled" || state === "loading";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        buttonStyles[variant],
        disabled && styles.disabled,
      ]}
    >
      {state === "loading" ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
  },

  disabled: {
    opacity: 0.5,
  },
});

const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
  },

  secondary: {
    backgroundColor: colors.surface,
  },

  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },

  danger: {
    backgroundColor: colors.error,
  },
};
