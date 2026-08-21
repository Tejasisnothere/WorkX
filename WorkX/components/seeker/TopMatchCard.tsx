import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

import Card from "@/components/Card";
import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

type TopMatchCardProps = {
  matchRate: number;
  title: string;
  company: string;
  location: string;
  distance: string;
  salary: string;
  onPress?: () => void;
  onSave?: () => void;
  saved?: boolean;
};

export default function TopMatchCard({
  matchRate,
  title,
  company,
  location,
  distance,
  salary,
  onPress,
  onSave,
  saved = false,
}: TopMatchCardProps) {
  const {t} = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.wrapper,
        pressed && styles.pressed,
      ]}
    >
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>
              {matchRate}% {t("home.matchRate")}
            </Text>
          </View>

          <Pressable
            onPress={onSave}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              saved
                ? t("jobs.removeFromSaved")
                : t("jobs.saveJob")
            }
          >
            <Ionicons
              name={
                saved
                  ? "heart"
                  : "heart-outline"
              }
              size={22}
              color={
                saved
                  ? colors.error
                  : colors.textSecondary
              }
            />
          </Pressable>
        </View>

        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text
          style={styles.company}
          numberOfLines={1}
        >
          {company}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons
              name="location-outline"
              size={15}
              color={colors.textSecondary}
            />

            <Text style={styles.detailText}>
              {location}
            </Text>
          </View>

          <Text style={styles.separator}>
            •
          </Text>

          <Text style={styles.detailText}>
            {distance}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.salary}>
            {salary}
          </Text>

          <View style={styles.viewJob}>
            <Text style={styles.viewJobText}>
              {t("jobs.viewJob")}
            </Text>

            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.primary}
            />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 280,
  },

  card: {
    padding: spacing.lg,
  },

  pressed: {
    opacity: 0.8,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  matchBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  matchText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },

  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  company: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  details: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  detailText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },

  separator: {
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  salary: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: "700",
  },

  viewJob: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  viewJobText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
});