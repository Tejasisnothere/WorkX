import "@/i18n";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="seeker"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="employer"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Modal",
        }}
      />

      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="language"
        options={{
          headerShown: false,
        }}
      />  
    </Stack>
  );
}
