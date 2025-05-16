import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import coverImage from "@/assets/images/login_bg.png";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

const Index = () => {
  const router = useRouter();
  const { useData, authLoading, authInitialized } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      if (authInitialized) {
        setAppReady(true);
      }
    };
    prepareApp();
  }, [authInitialized]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) return null; 

  return (
    <SafeAreaView
      className="flex justify-end h-full bg-white"
      onLayout={onLayoutRootView}
    >
      <Image
        source={coverImage}
        className="w-4/5 h-[30%] mx-auto rounded-lg mt-5"
        resizeMode="contain"
      />
      <Text className="text-3xl font-bold text-center mt-10 mb-2 px-5 text-slate-800">
        DIU Bus Tracker
      </Text>
      <Text className="text-lg text-gray-500 text-center px-8 mb-4">
        Track your university buses in real-time
      </Text>
      <Text className="text-footnote text-gray-400 text-center px-8 mb-8">
        Never miss your bus again! Get live updates on bus locations and schedules.
      </Text>

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
      </View>

      {/* <Text className="text-center text-gray-400 text-xs mb-5">
        © 2024 Daffodil International University
      </Text> */}
    </SafeAreaView>
  );
};

export default Index;
