import { View } from "react-native";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function HomeScreen() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  return (
    <View style={{backgroundColor: "#fff", flex: 1, padding: 20}}>
      <Button title="Find Jobs" onPress={() => console.log("pressed")} />

      <Button
        title="Cancel"
        variant="secondary"
        onPress={() => console.log("cancel")}
      />

      <Button
        title="Delete"
        variant="danger"
        onPress={() => console.log("delete")}
      />

      <Button title="Applying..." state="loading" onPress={() => {}} />

      <Button title="Disabled" state="disabled" onPress={() => {}} />
    </View>
  );
}
