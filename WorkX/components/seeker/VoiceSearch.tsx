import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

type VoiceSearchProps = {
  onPress?: () => void;
  disabled?: boolean;
};

export default function VoiceSearch({
  onPress,
  disabled = false,
}: VoiceSearchProps) {
  const {t} = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        styles.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={t("home.voiceSearchPlaceholder")}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name="mic-outline"
          size={20}
          color={colors.primary}
        />
      </View>

      <Text
        style={styles.text}
        numberOfLines={1}
      >
        {t("home.voiceSearchPlaceholder")}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,

    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: radius.full,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight: spacing.md,
  },

  text: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },

  pressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.5,
  },
});