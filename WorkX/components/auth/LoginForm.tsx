import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { colors, spacing, typography } from "@/theme";

type LoginFormProps = {
  phone: string;
  password: string;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string;
};

export default function LoginForm({
  phone,
  password,
  onPhoneChange,
  onPasswordChange,
  onSubmit,
  loading = false,
  error,
}: LoginFormProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Sign in to continue finding or managing work.</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t("auth.phoneNumber")}</Text>
        <Input
          placeholder={t("auth.phonePlaceholder")}
          value={phone}
          onChangeText={onPhoneChange}
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t("auth.password")}</Text>
        <Input
          placeholder={t("auth.passwordPlaceholder")}
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Button title="Sign in" onPress={onSubmit} state={loading ? "loading" : "default"} />

      {error && <Text style={styles.formError}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  infoText: { ...typography.caption, color: colors.textSecondary, lineHeight: 17 },
  field: { marginBottom: spacing.md },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  formError: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.sm,
    textAlign: "center",
  },
});
