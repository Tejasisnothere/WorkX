import {
  Text,
  View,
  StyleSheet,
} from "react-native";

import {useTranslation} from "react-i18next";

import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

type MatchRateCardProps = {
  rate: number;
  location: string;
};

export default function MatchRateCard({
  rate,
  location,
}: MatchRateCardProps) {
  const {t} = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {rate}% {t("home.matchRate")}
        </Text>

        <Text style={styles.description}>
          {t("home.matchDescription", {
            location,
          })}
        </Text>
      </View>

      <View style={styles.rateCircle}>
        <Text style={styles.rateText}>
          {rate}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryLight,

    borderRadius: radius.lg,
    padding: spacing.lg,

    minHeight: 74,
  },

  content: {
    flex: 1,
    paddingRight: spacing.md,
  },

  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  description: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 17,
  },

  rateCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,

    backgroundColor: colors.primary,

    alignItems: "center",
    justifyContent: "center",
  },

  rateText: {
    ...typography.body,
    fontWeight: "700",
    color: colors.text,
  },
});