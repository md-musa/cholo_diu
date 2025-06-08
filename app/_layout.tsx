import { Stack, useRouter } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { View } from "react-native";
import { Provider } from "react-redux";
import { store } from "@/store/storeConfig";
import BroadcastManager from "@/components/UI/BroadcastManager";
import BusLocationManager from "@/components/UI/BusLocationManager";
import { toast, Toasts } from "@backpackapp-io/react-native-toast";
import { useEffect } from "react";
import { Linking } from "react-native";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Linking.addEventListener("url", (event) => {
      console.log("URL received: ", event);
    });

    return () => subscription.remove();
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 bg-white">
          <BusLocationManager />
          <BroadcastManager />

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "white" },
            }}
          />
          <Toast />
        </View>
      </GestureHandlerRootView>
    </Provider>
  );
}
