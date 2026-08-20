import {
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import {useState} from "react";

import {colors, spacing, radius, typography} from "@/theme";

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
};

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const hasError = !!error;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={!disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          focused && styles.focused,
          hasError && styles.error,
          disabled && styles.disabled,
        ]}
        placeholderTextColor={colors.textMuted}
      />

      {hasError && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: spacing.lg,
  },

  label: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,

    backgroundColor: colors.surface,

    paddingHorizontal: spacing.md,

    ...typography.body,
    color: colors.text,
  },

  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  error: {
    borderColor: colors.error,
  },

  disabled: {
    backgroundColor: colors.background,
    color: colors.textMuted,
    opacity: 0.6,
  },

  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});