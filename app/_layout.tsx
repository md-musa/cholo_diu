import { Stack } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { View } from "react-native";
import { Provider } from "react-redux";
import { store } from "@/store/storeConfig";
import BroadcastManager from "@/components/UI/BroadcastManager";
import BusLocationManager from "@/components/UI/BusLocationManager";

export default function RootLayout() {
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
