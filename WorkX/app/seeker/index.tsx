import { ScrollView, View, StyleSheet } from "react-native";

import { useTranslation } from "react-i18next";

import HomeHeader from "@/components/Header";
import MatchRateCard from "@/components/seeker/MathRateCard";
import QuickStatCard from "@/components/seeker/QuickStatCard";
import VoiceSearch from "@/components/seeker/VoiceSearch";
import TopMatchCard from "@/components/seeker/TopMatchCard";

import { colors, spacing } from "@/theme";

export default function SeekerHome() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HomeHeader
          name="Priya Sharma"
          avatarUri="https://example.com/avatar.jpg"
        />

        <MatchRateCard rate={87} location="Rampur" />

        <View style={styles.stats}>
          <QuickStatCard
            value="3"
            label={t("home.newJobs")}
            description={t("home.aiRecommendedJobs")}
            variant="primary"
          />

          <QuickStatCard
            value="2"
            label={t("home.active")}
            description={t("home.interviewsConfirmed")}
            variant="success"
          />
        </View>

        <VoiceSearch
          onPress={() => {
            console.log("Voice search pressed");
          }}
        />

        <View style={styles.matchesHeader}>
          <SectionTitle />
          <View>{/* We'll make this a Pressable later */}</View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.matches}
        >
          <TopMatchCard
            matchRate={95}
            title="Assistant Tailor"
            company="Kunal Garments"
            location="Rampur"
            distance="2 km"
            salary="₹350/day"
          />

          <TopMatchCard
            matchRate={82}
            title="Fruit Harvester"
            company="Organic Farms"
            location="Bhimtal"
            distance="6 km"
            salary="₹400/day"
          />
        </ScrollView>
      </ScrollView>
    </View>
  );
}

function SectionTitle() {
  const { t } = useTranslation();

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },

  stats: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  matchesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xl,
  },

  matches: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
});
