import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BroadcastProvider } from "@/contexts/BroadcastContext";
import Toast from "react-native-toast-message";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-white">
        <AuthProvider>
          <BroadcastProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "white" },
              }}
            />
            <Toast />
          </BroadcastProvider>
        </AuthProvider>
      </View>
    </GestureHandlerRootView>
  );
}
