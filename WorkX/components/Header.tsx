import {
  Image,
  Text,
  View,
  StyleSheet,
  Pressable,
} from "react-native";

import {useTranslation} from "react-i18next";

import {colors, spacing, typography, radius} from "@/theme";

type HomeHeaderProps = {
  name: string;
  avatarUri?: string;
  onStatusPress?: () => void;
};

export default function HomeHeader({
  name,
  avatarUri,
  onStatusPress,
}: HomeHeaderProps) {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        {avatarUri ? (
          <Image
            source={{uri: avatarUri}}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={styles.welcome}>
            {t("home.welcomeBack")}
          </Text>

          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onStatusPress}
        style={styles.statusButton}
        accessibilityRole="button"
        accessibilityLabel={t("common.connectionStatus")}
      >
        <View style={styles.statusDot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },

  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    marginRight: spacing.md,
  },

  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  avatarText: {
    ...typography.body,
    fontWeight: "700",
    color: colors.primary,
  },

  textContainer: {
    flex: 1,
  },

  welcome: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },

  name: {
    ...typography.body,
    fontWeight: "700",
    color: colors.text,
  },

  statusButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
    backgroundColor: colors.success,
  },
});