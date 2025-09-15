// app/(driver)/index/_layout.tsx
import { Stack } from "expo-router";

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
        }}
      />
      <Stack.Screen
        name="liveLocationSharing"
        options={{
          headerShown: false,
          title: "Location Sharing",
        }}
      />
    </Stack>
  );
}
