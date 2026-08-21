import { Alert, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import AuthModeToggle from "@/components/auth/AuthModeToggle";
import LoginForm from "@/components/auth/LoginForm";
import { loginUser } from "@/services/auth/auth.service";
import { colors, spacing, typography } from "@/theme";

export default function LoginScreen() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();

  const handleSubmit = async () => {
    const phoneNumber = phone.replace(/\s+/g, "");
    if (!/^\+?[1-9]\d{7,14}$/.test(phoneNumber)) {
      setFormError("Enter a valid phone number with 8 to 15 digits.");
      return;
    }
    if (!password) {
      setFormError("Enter your password.");
      return;
    }

    setFormError(undefined);
    setLoading(true);
    try {
      const { user } = await loginUser({ phoneNumber, password });
      router.replace(user.role === "SEEKER" ? "/seeker" : "/employer");
    } catch (error) {
      Alert.alert("Sign in failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <AuthModeToggle mode="login" onChange={(mode) => {
        if (mode === "register") router.replace("/auth/register");
      }} />
      <LoginForm
        phone={phone}
        password={password}
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
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.xl },
});
