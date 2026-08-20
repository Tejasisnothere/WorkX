import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import BottomSheet from "@/components/BottomSheet";
import Button from "@/components/Button";

import i18n from "@/i18n";
import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

export default function ProfileScreen() {
  const {t} = useTranslation();
  const [languageSheetVisible, setLanguageSheetVisible] = useState(false);

  const currentLanguage =
    i18n.language === "hi"
      ? "Hindi (हिंदी)"
      : "English";

  const changeLanguage = async (language: "en" | "hi") => {
    await i18n.changeLanguage(language);
    setLanguageSheetVisible(false);
  };

  const handleLogout = () => {
    // Authentication/logout logic will go here later.
    console.log("Logout pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {t("profile.title")}
        </Text>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Image
              source={require("@/assets/images/favicon.png")}
              style={styles.avatarImage}
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              Priya Sharma
            </Text>

            <Text style={styles.phone}>
              +91 98765 43210
            </Text>
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("profile.preferences")}
          </Text>

          <Pressable
            onPress={() => setLanguageSheetVisible(true)}
            style={({pressed}) => [
              styles.settingRow,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.settingLeft}>
              <Ionicons
                name="globe-outline"
                size={20}
                color={colors.textSecondary}
              />

              <Text style={styles.settingText}>
                {t("profile.language")}
              </Text>
            </View>

            <View style={styles.languageValue}>
              <Text style={styles.languageText}>
                {currentLanguage}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textSecondary}
              />
            </View>
          </Pressable>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <Button
          title={t("profile.logout")}
          variant="outline"
          onPress={handleLogout}
        />
      </View>

      {/* Language selector */}
      <BottomSheet
        visible={languageSheetVisible}
        title={t("profile.selectLanguage")}
        onClose={() => setLanguageSheetVisible(false)}
      >
        <Pressable
          style={styles.languageOption}
          onPress={() => changeLanguage("en")}
        >
          <Text style={styles.languageOptionText}>
            English
          </Text>

          {i18n.language === "en" && (
            <Ionicons
              name="checkmark"
              size={20}
              color={colors.primary}
            />
          )}
        </Pressable>

        <Pressable
          style={styles.languageOption}
          onPress={() => changeLanguage("hi")}
        >
          <Text style={styles.languageOptionText}>
            हिंदी
          </Text>

          {i18n.language === "hi" && (
            <Ionicons
              name="checkmark"
              size={20}
              color={colors.primary}
            />
          )}
        </Pressable>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
  },

  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    overflow: "hidden",
    backgroundColor: colors.primaryLight,
    marginRight: spacing.md,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  phone: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  section: {
    marginTop: spacing.xl,
  },

  sectionTitle: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },

  settingRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  settingText: {
    ...typography.bodySmall,
    color: colors.text,
    marginLeft: spacing.md,
    fontWeight: "600",
  },

  languageValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  languageText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },

  logoutContainer: {
    marginTop: "auto",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

  languageOption: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  languageOptionText: {
    ...typography.body,
    color: colors.text,
  },
});