import { Stack } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";
import { Provider } from "react-redux";
import { store } from "@/store/storeConfig";
import BroadcastManager from "@/components/UI/BroadcastManager";
import BusLocationManager from "@/components/UI/BusLocationManager";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { useEffect } from "react";
import { Linking } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    const subscription = Linking.addEventListener("url", (event) => {
      //console.log("URL received: ", event);
    });

    return () => subscription.remove();
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 bg-white">
          <BroadcastManager />

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "white" },
            }}
          />
          <Toasts />

          <BusLocationManager />
        </View>
      </GestureHandlerRootView>
    </Provider>
  );
}
