import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {useTranslation} from "react-i18next";

import {
  colors,
  spacing,
  radius,
  typography,
} from "@/theme";

import {
  professions,
  type ProfessionId,
} from "@/data/professions";

type ProfessionSelectorProps = {
  selectedProfession: ProfessionId | null;
  onSelect: (profession: ProfessionId) => void;
};

export default function ProfessionSelector({
  selectedProfession,
  onSelect,
}: ProfessionSelectorProps) {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      {professions.map((profession) => {
        const selected =
          selectedProfession === profession.id;

        return (
          <Pressable
            key={profession.id}
            onPress={() => onSelect(profession.id)}
            style={({pressed}) => [
              styles.option,
              selected && styles.selectedOption,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.icon}>
              {profession.icon}
            </Text>

            <Text
              style={[
                styles.label,
                selected && styles.selectedLabel,
              ]}
            >
              {t(`professions.${profession.id}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  option: {
    minHeight: 44,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  icon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },

  label: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: "600",
  },

  selectedLabel: {
    color: colors.text,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },
});