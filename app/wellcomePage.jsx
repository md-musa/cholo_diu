import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import coverImage from "@/assets/images/login_bg.png";

const Start = () => {
  return (
    <SafeAreaView className="flex justify-end h-full bg-white">
      {/* App Logo (if available) */}
      {/* <View className="items-center mt-10">
        <Image 
          source={coverImage} // Add your university/bus logo
          className="w-20 h-20 rounded-full mb-4"
        />
      </View> */}

      {/* Hero Image (Bus-themed instead of generic) */}
      <Image source={coverImage} className="w-4/5 h-[30%] mx-auto rounded-lg mt-5" resizeMode="contain" />

      {/* Improved Title & Subtitle */}
      <Text className="text-3xl font-bold text-center mt-10 mb-2 px-5 text-slate-800">DIU Bus Tracker</Text>
      <Text className="text-lg text-gray-500 text-center px-8 mb-4">Track your university buses in real-time</Text>
      <Text className="text-footnote text-gray-400 text-center px-8 mb-8">
        Never miss your bus again! Get live updates on bus locations and schedules.
      </Text>

      {/* Action Buttons */}
      <View className="mt-10 mb-10">
        <Link
          href="/login"
          className="my-2 flex-row text-center items-center justify-center shadow-sm bg-tertiary-900 py-2 rounded-full mx-6"
        >
          <Text className="text-white text-lg font-semibold ml-2">Login</Text>
        </Link>
        <Link
          href="/register"
          className="my-2 flex-row text-center items-center justify-center shadow-sm bg-tertiary-900 py-2 rounded-full mx-6"
        >
          <Text className="text-white text-lg font-semibold ml-2">Registration</Text>
        </Link>

        {/* Optional: Guest Access */}
        {/* <Link
          href="/home"
          className="my-3 flex-row justify-center items-center border border-gray-300 py-3 px-8 rounded-full mx-6"
        >
          <Text className="text-gray-700 font-medium">Continue as Guest</Text>
        </Link> */}
      </View>

      {/* Footer (optional) */}
      <Text className="text-center text-gray-400 text-xs mb-5">© 2024 Daffodil International University</Text>
    </SafeAreaView>
  );
};

export default Start;
