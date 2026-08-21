import { FlatList, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { useTranslation } from "react-i18next";
import { router } from "expo-router";

import Input from "@/components/Input";
import Button from "@/components/Button";
import JobListCard from "@/components/job/JobListCard";

import { colors, spacing, typography } from "@/theme";

const jobs = [
  {
    id: "1",
    matchRate: 95,
    title: "Assistant Tailor",
    company: "Kunal Garments",
    location: "Rampur",
    distance: "2 km",
    salary: "₹350/day",
    jobType: "Full time",
  },
  {
    id: "2",
    matchRate: 91,
    title: "Tailor",
    company: "Fashion Works",
    location: "Rampur",
    distance: "3 km",
    salary: "₹400/day",
    jobType: "Full time",
  },
  {
    id: "3",
    matchRate: 88,
    title: "Fruit Harvester",
    company: "Organic Farms",
    location: "Bhimtal",
    distance: "6 km",
    salary: "₹400/day",
    jobType: "Contract",
  },
  {
    id: "4",
    matchRate: 84,
    title: "Sewing Assistant",
    company: "Local Textiles",
    location: "Rampur",
    distance: "7 km",
    salary: "₹300/day",
    jobType: "Part time",
  },
];

export default function JobsScreen() {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{t("navigation.jobs")}</Text>

            <Input
              placeholder={t("jobs.search")}
              value={search}
              onChangeText={setSearch}
            />

            <View style={styles.filterRow}>
              <Text style={styles.sectionTitle}>{t("jobs.nearby")}</Text>

              <Button
                title={t("jobs.filters")}
                variant="outline"
                onPress={() => {
                  console.log("Open filters");
                }}
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <JobListCard
            matchRate={item.matchRate}
            title={item.title}
            company={item.company}
            location={item.location}
            distance={item.distance}
            salary={item.salary}
            jobType={item.jobType}
            onPress={() => {
              router.push(`/seeker/jobs/${item.id}`);
            }}
          />
        )}
      />
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
    paddingBottom: spacing.xxl,
  },

  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
});
