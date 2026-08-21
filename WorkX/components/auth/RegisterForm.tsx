import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

import Input from "@/components/Input";
import Button from "@/components/Button";

import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

export type UserRole = "seeker" | "employer";

type RegisterFormProps = {
  role: UserRole;
  name: string;
  phone: string;

  onRoleChange: (role: UserRole) => void;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onSubmit: () => void;

  loading?: boolean;
};

export default function RegisterForm({
  role,
  name,
  phone,
  onRoleChange,
  onNameChange,
  onPhoneChange,
  onSubmit,
  loading = false,
}: RegisterFormProps) {
  const {t} = useTranslation();

  const isValid =
    name.trim().length > 0 &&
    phone.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <Ionicons
          name="phone-portrait-outline"
          size={20}
          color={colors.primary}
        />

        <Text style={styles.infoText}>
          {t("auth.phoneInfo")}
        </Text>
      </View>

      <Text style={styles.sectionLabel}>
        {t("auth.iWantTo")}
      </Text>

      <View style={styles.roleSelector}>
        <RoleOption
          selected={role === "seeker"}
          title={t("role.seeker.title")}
          onPress={() => onRoleChange("seeker")}
        />

        <RoleOption
          selected={role === "employer"}
          title={t("role.employer.title")}
          onPress={() => onRoleChange("employer")}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          {t("auth.fullName")}
        </Text>

        <Input
          placeholder={t("auth.fullNamePlaceholder")}
          value={name}
          onChangeText={onNameChange}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          {t("auth.phoneNumber")}
        </Text>

        <Input
          placeholder={t("auth.phonePlaceholder")}
          value={phone}
          onChangeText={onPhoneChange}
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Button
        title={t("auth.register")}
        onPress={onSubmit}
        state={
          loading
            ? "loading"
            : isValid
              ? "default"
              : "disabled"
        }
      />
    </View>
  );
}

type RoleOptionProps = {
  selected: boolean;
  title: string;
  onPress: () => void;
};

function RoleOption({
  selected,
  title,
  onPress,
}: RoleOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.roleOption,
        selected && styles.selectedRole,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.roleText,
          selected && styles.selectedRoleText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },

  infoText: {
    flex: 1,
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 17,
    marginLeft: spacing.sm,
  },

  sectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },

  roleSelector: {
    flexDirection: "row",
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.xl,
  },

  roleOption: {
    flex: 1,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
  },

  selectedRole: {
    backgroundColor: colors.surface,
  },

  roleText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: "600",
  },

  selectedRoleText: {
    color: colors.text,
    fontWeight: "700",
  },

  field: {
    marginBottom: spacing.md,
  },

  label: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },

  pressed: {
    opacity: 0.75,
  },
});