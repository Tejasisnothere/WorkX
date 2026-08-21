import {
  Text,
  View,
  Pressable,
  StyleSheet,
} from "react-native";

import Card from "@/components/Card";
import {colors, spacing, typography} from "@/theme";

type JobCardProps = {
  title: string;
  company: string;
  location: string;
  salary?: string;
  distance?: string;
  onPress?: () => void;
};

export default function JobCard({
  title,
  company,
  location,
  salary,
  distance,
  onPress,
}: JobCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {title}
            </Text>

            <Text style={styles.company}>
              {company}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.detail}>
            📍 {location}
          </Text>

          {distance && (
            <Text style={styles.detail}>
              • {distance}
            </Text>
          )}

          {salary && (
            <Text style={styles.salary}>
              {salary}
            </Text>
          )}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.md,
  },

  titleContainer: {
    gap: spacing.xs,
  },

  title: {
    ...typography.h3,
    color: colors.text,
  },

  company: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  details: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  detail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  salary: {
    ...typography.bodySmall,
    color: colors.success,
    fontWeight: "600",
  },
});