import { Tabs } from "expo-router";

export default function EmployerLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="post-job"
        options={{
          title: "Post Job",
        }}
      />

      <Tabs.Screen
        name="applications"
        options={{
          title: "Applications",
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}