import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { Link, useRouter } from "expo-router";
import { ToastUtil } from "@/utils/toastUtil";
import LoadingIndicator from "@/components/UI/LoadingIndicator";
import { useLoginMutation } from "@/store/features/auth/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ASYNC_STORAGE_KEYS, USER_ROLES } from "@/constants";
import { useAppDispatch } from "@/store/storeConfig";
import { setCredentials } from "@/store/features/auth/authSlice";
import { colors } from "@/config/colors";
import LigalLinks from "../../components/LegalLinks";
import ForgotPassword from "@/components/ForgotPassword";

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    let valid = true;
    let newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "University email is required";
      valid = false;
    } else {
      if (!(email.endsWith("diu.edu.bd") || email.endsWith("daffodilvarsity.edu.bd"))) {
        newErrors.email = "Use your university email";
        valid = false;
      }
    }

    // ✅ Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      const result = await login({ email, password }).unwrap();
      const { accessToken, user } = result;

      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN, accessToken);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.CURRENT_ROUTE, JSON.stringify(user.routeId));

      dispatch(setCredentials({ user, route: user.routeId, accessToken }));

      switch (user.role) {
        case USER_ROLES.EMPLOYEE:
        case USER_ROLES.STUDENT:
          router.replace("/(passenger)");
          break;
        case USER_ROLES.DRIVER:
          router.replace("/(driver)");
          break;
        default:
          router.replace("/(auth)/login");
      }
    } catch (err) {
      const errorMsg = err?.data?.errorMessages?.[0]?.message || err?.error || "Login failed. Please try again.";
      ToastUtil.error(errorMsg);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View className="flex-1 justify-end px-10 mb-10">
          {/* Title and Caption */}
          <View>
            <Text className="text-title-2 font-semibold text-center mb-4">Track Your Campus Buses</Text>
            <Text className="text-body text-center text-muted-500 mb-10">
              See bus locations and schedules in real time
            </Text>
          </View>

          {/* Form */}
          <View>
            {/* Email Input */}
            <View className="my-5">
              <View className="flex-row items-center gap-2 my-1">
                <MaterialCommunityIcons name="email-outline" size={20} color={colors.muted[700]} />
                <Text className="text-lg text-muted-700">University Mail</Text>
              </View>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="Enter your university mail"
                keyboardType="email-address"
                autoCapitalize="none"
                className={`border rounded-xl px-4 py-4 ${errors.email ? "border-red-500" : "border-muted-300"}`}
              />
              {errors.email ? <Text className="text-red-500 mt-1">{errors.email}</Text> : null}
            </View>

            {/* Password Input */}
            <View className="my-3">
              <View className="flex-row items-center gap-2 my-1">
                <MaterialIcons name="password" size={20} color={colors.muted[700]} />
                <Text className="text-lg text-muted-700">Password (min 6 characters)</Text>
              </View>
              <View
                className={`flex-row items-center border rounded-xl px-4 py-4 ${
                  errors.password ? "border-red-500" : "border-muted-300"
                }`}
              >
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  className="flex-1"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text className="text-red-500 mt-1">{errors.password}</Text> : null}
            </View>

            {/* Login Button */}
            <View className="mt-6">
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                className="w-full bg-secondary-900 p-3 rounded-xl flex-row justify-center"
              >
                {isLoading ? (
                  <LoadingIndicator color="white" />
                ) : (
                  <Text className="text-body text-center text-white">Login</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Forgot Password and Sign Up Links */}
            <View className="mt-4 items-center">
              {/* <TouchableOpacity className="mb-4">
              <Text className="text-secondary-700">Forgot Password?</Text>
            </TouchableOpacity> */}
              <ForgotPassword />
              <View className="flex-row">
                <Text className="text-muted-600">Don't have an account? </Text>
                <Link href="/register" className="text-secondary-700">
                  Sign Up
                </Link>
              </View>
            </View>
          </View>

          <LigalLinks />
        </View>
        <Toast />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
