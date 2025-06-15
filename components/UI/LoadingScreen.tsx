import { colors } from "@/config/colors";
import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";

function LoadingScreen({ color = colors.secondary[600] }) {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color={color} />
    </View>
  );
}

export default LoadingScreen;
