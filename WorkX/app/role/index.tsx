import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import {useTranslation} from "react-i18next";

import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

type UserRole = "seeker" | "employer";

export default function RoleScreen() {
  const {t} = useTranslation();

  const handleRoleSelect = (role: UserRole) => {
    router.push({
      pathname:
        role === "employer"
          ? "/auth/employer-register"
          : "/auth/seeker-register",
      params: {
        role,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {t("role.title")}
        </Text>

        <Text style={styles.description}>
          {t("role.description")}
        </Text>

        <View style={styles.options}>
          <RoleCard
            icon="person-outline"
            title={t("role.seeker.title")}
            description={t("role.seeker.description")}
            onPress={() => handleRoleSelect("seeker")}
          />

          <RoleCard
            icon="business-outline"
            title={t("role.employer.title")}
            description={t("role.employer.description")}
            onPress={() => handleRoleSelect("employer")}
          />
        </View>
      </View>
    </View>
  );
}

type RoleCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
};

function RoleCard({
  icon,
  title,
  description,
  onPress,
}: RoleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={28}
          color={colors.primary}
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {title}
        </Text>

        <Text style={styles.cardDescription}>
          {description}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.textMuted}
      />
    </Pressable>
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

  options: {
    gap: spacing.md,
  },

  card: {
    minHeight: 96,
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,

    padding: spacing.lg,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight: spacing.md,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },

  cardDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 19,
  },

  pressed: {
    opacity: 0.75,
  },
});