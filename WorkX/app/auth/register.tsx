import { StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import RegisterForm, { type UserRole } from "@/components/auth/RegisterForm";

import { colors, spacing, typography } from "@/theme";

export default function RegisterScreen() {
  const { t } = useTranslation();

  const { role: roleParam } = useLocalSearchParams<{ role?: UserRole }>();

  const [role, setRole] = useState<UserRole>(
    roleParam === "employer" ? "employer" : "seeker",
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      return;
    }

    setLoading(true);

    try {
      // Temporary:
      // Later this will call your registration API.
      console.log({
        name,
        phone,
        role,
      });

      if (role === "seeker") {
        router.push("/seeker/location");
      } else {
        router.push("/employer/location");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("auth.createAccount")}</Text>

      <RegisterForm
        role={role}
        name={name}
        phone={phone}
        onRoleChange={setRole}
        onNameChange={setName}
        onPhoneChange={setPhone}
        onSubmit={handleSubmit}
        loading={loading}
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
