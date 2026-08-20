import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import {useState} from "react";
import {router} from "expo-router";
import {useTranslation} from "react-i18next";

import Button from "@/components/Button";
import LanguageSelector from "@/components/onboarding/LanguageSelector";

import i18n from "@/i18n";

import {
  languages,
  type LanguageCode,
} from "@/i18n/config";

import {
  saveLanguage,
} from "@/storage/preferences";

import {
  colors,
  spacing,
  typography,
} from "@/theme";

export default function LanguageScreen() {
  const {t} = useTranslation();

  const getInitialLanguage = (): LanguageCode => {
    const currentLanguage = i18n.language;

    return currentLanguage in languages
      ? (currentLanguage as LanguageCode)
      : "en";
  };

  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(getInitialLanguage);

  const handleSelect = async (
    language: LanguageCode,
  ) => {
    setSelectedLanguage(language);

    await i18n.changeLanguage(language);
  };

  const handleContinue = async () => {
    await saveLanguage(selectedLanguage);

    router.replace("/onboarding");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {t("language.title")}
        </Text>

        <Text style={styles.description}>
          {t("language.description")}
        </Text>

        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onSelect={handleSelect}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title={t("common.continue")}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },

  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});