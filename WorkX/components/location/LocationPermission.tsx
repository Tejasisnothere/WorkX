import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

import Button from "@/components/Button";

import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

type LocationPermissionProps = {
  onAllow: () => void;
  onSkip?: () => void;
  loading?: boolean;
};

export default function LocationPermission({
  onAllow,
  onSkip,
  loading = false,
}: LocationPermissionProps) {
  const {t, i18n} = useTranslation();

console.log("LANG:", i18n.language);
console.log("TITLE:", t("location.title"));``

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="location"
            size={42}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>
          {t("location.title")}
        </Text>

        <Text style={styles.description}>
          {t("location.description")}
        </Text>

        <View style={styles.infoCard}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={colors.success}
          />

          <Text style={styles.infoText}>
            {t("location.privacy")}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={t("location.allow")}
          onPress={onAllow}
          state={loading ? "loading" : "default"}
        />

        {onSkip && (
          <Button
            title={t("location.notNow")}
            variant="outline"
            onPress={onSkip}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },

  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.md,
  },

  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 340,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.xl,
  },

  infoText: {
    flex: 1,
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginLeft: spacing.sm,
  },

  footer: {
    gap: spacing.md,
  },
});