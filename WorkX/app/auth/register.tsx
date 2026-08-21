import { Alert, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import RegisterForm, { type UserRole } from "@/components/auth/RegisterForm";
import AuthModeToggle from "@/components/auth/AuthModeToggle";
import { registerUser } from "@/services/auth/auth.service";

import { colors, spacing, typography } from "@/theme";

export default function RegisterScreen() {
  const { t } = useTranslation();

  const { role: roleParam } = useLocalSearchParams<{ role?: UserRole }>();

  const [role, setRole] = useState<UserRole>(
    roleParam === "employer" ? "employer" : "seeker",
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();

  const handleSubmit = async () => {
    if (!name.trim()) {
      setFormError("Enter your full name.");
      return;
    }

    const normalizedPhone = phone.replace(/\s+/g, "");
    if (!/^\+?[1-9]\d{7,14}$/.test(normalizedPhone)) {
      setFormError("Enter a valid phone number with 8 to 15 digits.");
      return;
    }

    if (password.length < 8) {
      setFormError("Your password must contain at least 8 characters.");
      return;
    }

    setFormError(undefined);
    setLoading(true);

    try {
      await registerUser({
        name,
        phoneNumber: normalizedPhone,
        password,
        role: role === "seeker" ? "SEEKER" : "EMPLOYER",
      });

      if (role === "seeker") {
        router.push("/seeker/location");
      } else {
        router.push("/employer/location");
      }
    } catch (error) {
      Alert.alert(
        "Registration failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("auth.createAccount")}</Text>

      <AuthModeToggle mode="register" onChange={(mode) => {
        if (mode === "login") router.replace("/auth/login");
      }} />

      <RegisterForm
        role={role}
        name={name}
        phone={phone}
        password={password}
        onRoleChange={setRole}
        onNameChange={setName}
        onPhoneChange={setPhone}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        loading={loading}
        error={formError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },

  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xl,
  },
});
