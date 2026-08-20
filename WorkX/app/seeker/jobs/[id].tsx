import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import {router, useLocalSearchParams} from "expo-router";

import Card from "@/components/Card";
import Button from "@/components/Button";

import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

const jobs = {
  "1": {
    matchRate: 95,
    title: "Assistant Tailor",
    company: "Kunal Garments",
    location: "Rampur",
    distance: "2 km",
    salary: "₹350/day",
    jobType: "Full time",
    description:
      "Assist with garment preparation, stitching, alterations, and general tailoring work.",
    requirements: [
      "Basic tailoring experience",
      "Ability to operate sewing machines",
      "Attention to detail",
    ],
  },

  "2": {
    matchRate: 91,
    title: "Tailor",
    company: "Fashion Works",
    location: "Rampur",
    distance: "3 km",
    salary: "₹400/day",
    jobType: "Full time",
    description:
      "Work on garment stitching and alterations while maintaining quality standards.",
    requirements: [
      "Tailoring experience",
      "Basic stitching skills",
      "Reliable attendance",
    ],
  },
};

export default function JobDetailsScreen() {
  const {t} = useTranslation();
  const {id} = useLocalSearchParams<{id: string}>();

  const job = jobs[id as keyof typeof jobs];

  if (!job) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTitle}>
          {t("jobs.noJobs")}
        </Text>

        <Button
          title={t("common.back")}
          onPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.text}
          />
        </Pressable>

        <View style={styles.header}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>
              {job.matchRate}% {t("home.matchRate")}
            </Text>
          </View>

          <Text style={styles.title}>
            {job.title}
          </Text>

          <Text style={styles.company}>
            {job.company}
          </Text>
        </View>

        <Card style={styles.summaryCard}>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={20}
              color={colors.primary}
            />

            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>
                {t("jobs.location")}
              </Text>

              <Text style={styles.infoValue}>
                {job.location} • {job.distance}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="cash-outline"
              size={20}
              color={colors.primary}
            />

            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>
                {t("jobs.salary")}
              </Text>

              <Text style={styles.infoValue}>
                {job.salary}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="briefcase-outline"
              size={20}
              color={colors.primary}
            />

            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>
                {t("jobs.jobType")}
              </Text>

              <Text style={styles.infoValue}>
                {job.jobType}
              </Text>
            </View>
          </View>
        </Card>

        <Section
          title={t("jobs.description")}
        >
          <Text style={styles.body}>
            {job.description}
          </Text>
        </Section>

        <Section
          title={t("jobs.requirements")}
        >
          {job.requirements.map((requirement) => (
            <View
              key={requirement}
              style={styles.requirement}
            >
              <View style={styles.bullet} />

              <Text style={styles.body}>
                {requirement}
              </Text>
            </View>
          ))}
        </Section>

        <View style={styles.skillsSection}>
          <Text style={styles.sectionTitle}>
            {t("jobs.skills")}
          </Text>

          <View style={styles.skills}>
            <View style={styles.skill}>
              <Text style={styles.skillText}>
                Tailoring
              </Text>
            </View>

            <View style={styles.skill}>
              <Text style={styles.skillText}>
                Sewing
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title={t("jobs.apply")}
          onPress={() => {
            router.push("/seeker/application");
          }}
        />
      </View>
    </View>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({
  title,
  children,
}: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      {children}
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
    paddingBottom: 110,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },

  header: {
    marginBottom: spacing.xl,
  },

  matchBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },

  matchText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },

  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  company: {
    ...typography.body,
    color: colors.textSecondary,
  },

  summaryCard: {
    marginBottom: spacing.xl,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  infoText: {
    marginLeft: spacing.md,
    flex: 1,
  },

  infoLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },

  infoValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600",
  },

  section: {
    marginBottom: spacing.xl,
  },

  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },

  body: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 21,
  },

  requirement: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },

  bullet: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    marginTop: 7,
    marginRight: spacing.sm,
  },

  skillsSection: {
    marginBottom: spacing.xl,
  },

  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  skill: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  skillText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },

  notFound: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  notFoundTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
});