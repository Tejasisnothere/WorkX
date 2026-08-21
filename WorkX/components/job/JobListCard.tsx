import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

import Card from "@/components/Card";
import {colors, spacing, radius, typography} from "@/theme";

type JobListCardProps = {
  matchRate: number;
  title: string;
  company: string;
  location: string;
  distance: string;
  salary: string;
  jobType?: string;
  onPress?: () => void;
};

export default function JobListCard({
  matchRate,
  title,
  company,
  location,
  distance,
  salary,
  jobType,
  onPress,
}: JobListCardProps) {
  const {t} = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.wrapper,
        pressed && styles.pressed,
      ]}
    >
      <Card>
        <View style={styles.topRow}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>
              {matchRate}% {t("home.matchRate")}
            </Text>
          </View>

          {jobType && (
            <Text style={styles.jobType}>
              {jobType}
            </Text>
          )}
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

        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.textSecondary}
          />

          <Text style={styles.location}>
            {location}
          </Text>

          <Text style={styles.separator}>
            •
          </Text>

          <Text style={styles.location}>
            {distance}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.salary}>
            {salary}
          </Text>

          <View style={styles.details}>
            <Text style={styles.detailsText}>
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
    marginBottom: spacing.md,
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
    alignSelf: "flex-start",
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

  jobType: {
    ...typography.caption,
    color: colors.textSecondary,
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

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  location: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },

  separator: {
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  salary: {
    ...typography.body,
    color: colors.text,
    fontWeight: "700",
  },

  details: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  detailsText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "700",
  },
});