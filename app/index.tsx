import { View, Text, Image, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useEffect, useCallback, useState } from "react";
import { Link, useRouter } from "expo-router";
// @ts-ignore
import coverImage from "@/assets/images/login_bg.png";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

import { ASYNC_STORAGE_KEYS, USER_ROLES } from "@/constants";
import { useAppDispatch } from "@/store/storeConfig";
import { AuthUser, clearCredentials, setCredentials } from "@/store/features/auth/authSlice";

// Prevent splash from auto-hiding
SplashScreen.preventAutoHideAsync();

interface DecodedToken {
  _id: string;
  role: USER_ROLES;
  email: string;
}

const Index = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
        const route = JSON.parse((await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.CURRENT_ROUTE)) || "null");

        if (!token) {
          dispatch(clearCredentials());
          router.push("/login");
          return;
        }

        const decoded = jwtDecode<DecodedToken>(token);

        const user: AuthUser = {
          _id: decoded._id,
          role: decoded.role,
          email: decoded.email,
        };

        dispatch(setCredentials({ user, route, accessToken: token }));
        router.push("/home");
      } catch (err) {
        console.error("Initialization error:", err);
        dispatch(clearCredentials());
        router.push("/login");
      } finally {
        setAppReady(true);
      }
    };

    initialize();
  }, [dispatch]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) return null;

  return (
    <SafeAreaView className="flex justify-end h-full bg-white" onLayout={onLayoutRootView}>
      <Image source={coverImage} className="w-4/5 h-[30%] mx-auto rounded-lg mt-5" resizeMode="contain" />
      <Text className="text-3xl font-bold text-center mt-10 mb-2 px-5 text-slate-800">DIU Bus Tracker</Text>
      <Text className="text-lg text-gray-500 text-center px-8 mb-4">Track your university buses in real-time</Text>
      <Text className="text-footnote text-gray-400 text-center px-8 mb-8">
        Never miss your bus again! Get live updates on bus locations and schedules.
      </Text>
      <View className="mt-10 mb-10">
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="my-2 flex-row text-center items-center justify-center shadow-sm bg-tertiary-900 py-2 rounded-full mx-6"
        >
          <Text className="text-white text-lg font-semibold ml-2">Login</Text>
        </TouchableOpacity>

        {/* @ts-ignore */}
        <TouchableOpacity
          onPress={() => router.push("/register")}
          className="my-2 flex-row text-center items-center justify-center shadow-sm bg-tertiary-900 py-2 rounded-full mx-6"
        >
          <Text className="text-white text-lg font-semibold ml-2">Registration</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Index;
