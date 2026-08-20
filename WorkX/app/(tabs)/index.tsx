import { View, Text } from "react-native";
import { useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import Button from "@/components/Button";

export default function HomeScreen() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <View style={{ backgroundColor: "#fff", flex: 1, padding: 20 }}>
      <Button title="Filters" onPress={() => setShowFilters(true)} />

      <BottomSheet
        visible={showFilters}
        title="Filter Jobs"
        onClose={() => setShowFilters(false)}
      >
        <Text>Location</Text>

        <Text>Skills</Text>

        <Button
          title="Apply Filters"
          onPress={() => {
            setShowFilters(false);
          }}
        />
      </BottomSheet>
    </View>
  );
}
