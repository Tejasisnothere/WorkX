import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {useState} from "react";
import {router} from "expo-router";
import {useTranslation} from "react-i18next";

import Button from "@/components/Button";
import ProfessionSelector from "@/components/professions/ProfessionSelector";

import {
  type ProfessionId,
} from "@/data/professions";

import {
  colors,
  spacing,
  typography,
} from "@/theme";

export default function ProfessionsScreen() {
  const {t} = useTranslation();

  const [selectedProfession, setSelectedProfession] =
    useState<ProfessionId | null>(null);

  const handleContinue = () => {
    if (!selectedProfession) {
      return;
    }

    console.log(
      "Selected profession:",
      selectedProfession,
    );

    router.replace("/seeker/setup");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.step}>
          {t("onboarding.step", {
            current: 1,
            total: 2,
          })}
        </Text>

        <Text style={styles.title}>
          {t("professions.title")}
        </Text>

        <Text style={styles.description}>
          {t("professions.description")}
        </Text>

        <ProfessionSelector
          selectedProfession={selectedProfession}
          onSelect={setSelectedProfession}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t("professions.continue")}
          onPress={handleContinue}
          state={
            selectedProfession
              ? "default"
              : "disabled"
          }
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  step: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: spacing.lg,
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});