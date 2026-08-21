import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

import {
  languages,
  type LanguageCode,
} from "@/i18n/config";

type LanguageSelectorProps = {
  selectedLanguage: LanguageCode;
  onSelect: (language: LanguageCode) => void;
};

export default function LanguageSelector({
  selectedLanguage,
  onSelect,
}: LanguageSelectorProps) {
  return (
    <View style={styles.container}>
      {Object.entries(languages).map(([code, language]) => {
        const languageCode = code as LanguageCode;
        const selected = languageCode === selectedLanguage;

        return (
          <Pressable
            key={languageCode}
            onPress={() => onSelect(languageCode)}
            style={({pressed}) => [
              styles.option,
              selected && styles.selectedOption,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.textContainer}>
              <Text style={styles.nativeName}>
                {language.nativeName}
              </Text>

              <Text style={styles.englishName}>
                {language.englishName}
              </Text>
            </View>

            <View
              style={[
                styles.radio,
                selected && styles.selectedRadio,
              ]}
            >
              {selected && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={colors.white}
                />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },

  option: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,

    paddingHorizontal: spacing.lg,
  },

  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  textContainer: {
    flex: 1,
  },

  nativeName: {
    ...typography.body,
    color: colors.text,
    fontWeight: "700",
  },

  englishName: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  radio: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,

    alignItems: "center",
    justifyContent: "center",
  },

  selectedRadio: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  pressed: {
    opacity: 0.8,
  },
});