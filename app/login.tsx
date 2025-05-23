import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { Link } from "expo-router";
import { showToast } from "@/utils/toastUtil";

const Login = () => {
  const { login, authLoading } = useAuth();
  const [email, setEmail] = useState("musa11@diu.edu.bd");
  const [password, setPassword] = useState("qwerty");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast({
        type: "info",
        text1: "Missing Information",
        text2: "Please enter both email and password to continue.",
      });
      return;
    }

    await login({ email, password });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-end px-10 mb-10">
        {/* Title and Caption (original version) */}
        <View className="">
          <Text className="text-title-2 font-semibold text-center mb-4">Track Your Campus Buses</Text>
          <Text className="text-body text-center text-gray-500 mb-10">
            Login to view real-time bus locations and schedules
          </Text>
        </View>

        {/* Form aligned to bottom */}
        <View className="">
          {/* Email Input */}
          <View className="my-5">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="email-outline" size={20} color="black" />
              <Text className="text-lg  mb-2">University Mail</Text>
            </View>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your university mail"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-xl px-4 py-4"
            />
          </View>

          {/* Password Input with toggle */}
          <View className="my-3">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="password" size={20} color="black" />
              <Text className="text-lg  mb-2">Password</Text>
            </View>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-4">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                className="flex-1"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <View className="mt-6">
            <TouchableOpacity
              onPress={handleLogin}
              disabled={authLoading}
              className="w-full bg-tertiary-900 p-3 rounded-xl flex-row justify-center"
            >
              {authLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-body text-center text-white">Login</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Forgot Password and Sign Up Links */}
          <View className="mt-4 items-center">
            <TouchableOpacity className="mb-4">
              <Text className="text-blue-600">Forgot Password?</Text>
            </TouchableOpacity>
            <View className="flex-row">
              <Text className="text-gray-600">Don't have an account? </Text>
              <Link href="/register" className="text-blue-600">
                Sign Up
              </Link>
            </View>
          </View>
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default Login;
