import {StyleSheet, Text, View} from "react-native";
import {useTranslation} from "react-i18next";

import Input from "@/components/Input";
import Button from "@/components/Button";

import {
  colors,
  spacing,
  typography,
} from "@/theme";

type TextAnswerProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export default function TextAnswer({
  value,
  onChangeText,
  onSubmit,
  disabled = false,
}: TextAnswerProps) {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.orText}>
        {t("interview.orType")}
      </Text>

      <Input
        placeholder={t("interview.answerPlaceholder")}
        value={value}
        onChangeText={onChangeText}
      />

      <Button
        title={t("interview.submit")}
        onPress={onSubmit}
        state={
          disabled || !value.trim()
            ? "disabled"
            : "default"
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },

  orText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
});