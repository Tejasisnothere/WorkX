import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import HomeHeader from "@/components/Header";
import Loading from "@/components/Loading";
import QuickStatCard from "@/components/seeker/QuickStatCard";
import TopMatchCard from "@/components/seeker/TopMatchCard";
import { getMyApplications } from "@/services/applications/application.service";
import { getCurrentUser, type AuthUser } from "@/services/auth/auth.service";
import { getOpenJobs, type Job } from "@/services/jobs/job.service";
import { getCurrentAddress } from "@/services/location/location.service";
import { colors, spacing, typography } from "@/theme";

export default function SeekerHome() {
  const { t } = useTranslation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobCount, setJobCount] = useState(0);
  const [activeApplicationCount, setActiveApplicationCount] = useState(0);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [currentUser, jobResult, applications] = await Promise.all([
        getCurrentUser(),
        getOpenJobs(),
        getMyApplications(),
      ]);

      setUser(currentUser);
      setJobs(jobResult.jobs);
      setJobCount(jobResult.pagination.totalItems);
      setActiveApplicationCount(
        applications.applications.filter(
          (application) => application.status === "APPLIED" || application.status === "SHORTLISTED",
        ).length,
      );

      try {
        setAddress((await getCurrentAddress()) ?? currentUser.profile?.location ?? null);
      } catch {
        setAddress(currentUser.profile?.location ?? null);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("home.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return <View style={styles.centered}><Loading message={t("home.loadingDashboard")} /></View>;
  }

  if (error) {
    return <View style={styles.centered}><ErrorState title={t("home.loadError")} description={error} onRetry={loadDashboard} /></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <HomeHeader name={user?.name ?? ""} />

        {address ? (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.locationText} numberOfLines={1}>{address}</Text>
          </View>
        ) : null}

        <View style={styles.stats}>
          <QuickStatCard
            value={String(jobCount)}
            label={t("home.availableJobs")}
            description={t("home.openJobsDescription")}
            variant="primary"
          />
          <QuickStatCard
            value={String(activeApplicationCount)}
            label={t("home.active")}
            description={t("home.activeApplications")}
            variant="success"
          />
        </View>

        <Text style={styles.sectionTitle}>{t("home.openJobs")}</Text>

        {jobs.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matches}>
            {jobs.map((job) => (
              <TopMatchCard
                key={job._id}
                title={job.title}
                company={job.companyName}
                location={job.location}
                salary={job.salary ?? t("jobs.salaryNotListed")}
                onPress={() => router.push(`/seeker/jobs/${job._id}`)}
              />
            ))}
          </ScrollView>
        ) : <EmptyState title={t("jobs.noJobs")} description={t("jobs.noJobsDescription")} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  stats: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: -spacing.sm,
  },
  locationText: { ...typography.caption, color: colors.textMuted, flex: 1 },
  sectionTitle: { ...typography.h3, color: colors.text, marginTop: spacing.xl },
  matches: { gap: spacing.md, paddingTop: spacing.md },
  centered: { flex: 1, backgroundColor: colors.background, justifyContent: "center" },
});
