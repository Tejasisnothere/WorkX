import {StyleSheet, Text, View} from "react-native";

import {
  colors,
  spacing,
  typography,
} from "@/theme";

type InterviewQuestionProps = {
  question: string;
};

export default function InterviewQuestion({
  question,
}: InterviewQuestionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        {question}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },

  question: {
    ...typography.h2,
    color: colors.text,
    lineHeight: 32,
  },
});