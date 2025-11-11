import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Picker } from "@react-native-picker/picker";
import { Link, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useRegisterMutation } from "@/store/features/auth/authApi";
import { useGetRoutesQuery } from "@/store/features/route/routeApi";
import { ASYNC_STORAGE_KEYS, USER_ROLES } from "@/constants";
import { useAppDispatch } from "@/store/storeConfig";
import { setCredentials } from "@/store/features/auth/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastUtil } from "@/utils/toastUtil";
import { colors } from "@/config/colors";
import LoadingIndicator from "@/components/UI/LoadingIndicator";
import LigalLinks from "../../components/LegalLinks";

const Register = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    routeId: "",
    role: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ name: "", routeId: "", role: "", email: "", password: "" });

  const { data: routes } = useGetRoutesQuery();
  const [register, { isLoading }] = useRegisterMutation();

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", routeId: "", role: "", email: "", password: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      valid = false;
    }

    if (!formData.routeId) {
      newErrors.routeId = "Please select a bus route";
      valid = false;
    }

    if (!formData.role) {
      newErrors.role = "Please select your role";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "University email is required";
      valid = false;
    } else {
      const email = formData.email.trim().toLowerCase();
      if (!(email.endsWith("diu.edu.bd") || email.endsWith("daffodilvarsity.edu.bd"))) {
        newErrors.email = "Use your university email";
        valid = false;
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegistration = async () => {
    if (!validateForm()) return;

    try {
      let notificationToken = "";

      const payload = { ...formData, notificationToken };
      const result = await register(payload);

      const { accessToken, user } = result.data;
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
      ToastUtil.error(err?.data?.errorMessages?.[0]?.message || "Registration failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white my-2">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-end px-10">
            {/* Full Name */}
            <View className="my-3">
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons name="person-outline" size={20} color={colors.muted[700]} />
                <Text className="text-lg text-muted-700">Full Name</Text>
              </View>
              <TextInput
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                placeholder="Enter your full name"
                className={`border rounded-xl px-4 py-4 ${errors.name ? "border-red-500" : "border-muted-300"}`}
                editable={!isLoading}
              />
              {errors.name ? <Text className="text-red-500 mt-1">{errors.name}</Text> : null}
            </View>

            {/* Route */}
            <View className="my-3">
              <View className="flex-row items-center gap-2 mb-2">
                <FontAwesome5 name="route" size={20} color={colors.muted[700]} />
                <Text className="text-lg text-muted-700">Bus Route</Text>
              </View>
              <View className={`border rounded-xl ${errors.routeId ? "border-red-500" : "border-muted-300"}`}>
                <Picker
                  selectedValue={formData.routeId}
                  onValueChange={(value) => handleInputChange("routeId", value)}
                  enabled={!isLoading}
                >
                  <Picker.Item label="Select your bus route" value="" />
                  {routes?.map((route) => (
                    <Picker.Item key={route._id} label={`${route.routeNo}: ${route.routeName}`} value={route._id} />
                  ))}
                </Picker>
              </View>
              {errors.routeId ? <Text className="text-red-500 mt-1">{errors.routeId}</Text> : null}
            </View>

            {/* Role */}
            <View className="my-3">
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons name="person-add-outline" size={20} color={colors.muted[700]} />
                <Text className="text-lg text-muted-700">Role</Text>
              </View>
              <View className={`border rounded-xl ${errors.role ? "border-red-500" : "border-muted-300"}`}>
                <Picker
                  selectedValue={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                  enabled={!isLoading}
                >
                  <Picker.Item label="Select your role" value="" />
                  <Picker.Item label="Student" value="student" />
                  <Picker.Item label="Employee" value="employee" />
                </Picker>
              </View>
              {errors.role ? <Text className="text-red-500 mt-1">{errors.role}</Text> : null}
            </View>

            {/* Email */}
            <View className="my-3">
              <View className="flex-row items-center gap-2 mb-2">
                <MaterialCommunityIcons name="email-outline" size={20} color={colors.muted[700]} />
                <Text className="text-lg text-muted-700">University Email</Text>
              </View>
              <TextInput
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                placeholder="abc@diu.edu.bd"
                keyboardType="email-address"
                autoCapitalize="none"
                className={`border rounded-xl px-4 py-4 ${errors.email ? "border-red-500" : "border-muted-300"}`}
                editable={!isLoading}
              />
              {errors.email ? <Text className="text-red-500 mt-1">{errors.email}</Text> : null}
            </View>

            {/* Password */}
            <View className="my-3">
              <View className="flex-row items-center gap-2 mb-2">
                <MaterialIcons name="lock-outline" size={20} color={colors.muted[700]} />
                <Text className="text-lg text-muted-700">Password</Text>
              </View>
              <View
                className={`flex-row items-center border rounded-xl px-4 py-4 ${
                  errors.password ? "border-red-500" : "border-muted-300"
                }`}
              >
                <TextInput
                  value={formData.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  className="flex-1"
                  editable={!isLoading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text className="text-red-500 mt-1">{errors.password}</Text> : null}
            </View>

            {/* Register Button */}
            <View className="mt-6">
              <TouchableOpacity
                onPress={handleRegistration}
                disabled={isLoading}
                className="w-full bg-secondary-900 p-3 rounded-xl flex-row justify-center"
              >
                {isLoading ? (
                  <LoadingIndicator color="white" />
                ) : (
                  <Text className="text-body text-center text-white">Register</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Already have account */}
            <View className="mt-4 items-center">
              <View className="flex-row">
                <Text className="text-muted-600">Already have an account? </Text>
                <Link href="/login" className="text-secondary-700">
                  Sign In
                </Link>
              </View>
            </View>
          </View>
          <LigalLinks />
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

export default Register;
