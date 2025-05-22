import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "expo-router";
import Toast from "react-native-toast-message";
import { showToast } from "@/utils/toastUtil";
import { AuthUtil } from "@/utils/authUtil";
import { RouteService } from "@/services/routeService";

const Register = () => {
  const { register, authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    routeId: "",
    role: "",
    email: "",
    password: "",
  });
  console.log("[register] formData", formData);
  const [availRoutes, setAvailRoutes] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await RouteService.getRoutes();
        setAvailRoutes(res.data || []);
      } catch (err) {
        console.error("🛣 API Error:", err);

        showToast({
          type: "error",
          text1: "Network Error",
          text2: "Failed to load routes. Please try again.",
        });
      }
    };

    fetchRoutes();
  }, []);

  const handleRegister = async () => {
    console.log("---------");
    console.log("[register] formData", formData);
    if (!AuthUtil.validateRegistrationForm(formData)) return;

    await register(formData);
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isLoading = authLoading;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-end px-10 mb-10">
          {/* Header - Matches Login Page Style */}
          <View className="">
            <Text className="text-title-2 font-semibold text-center mb-4">Track Your Campus Buses</Text>
            <Text className="text-body text-center text-gray-500 mb-10">
              Register to view real-time bus locations and schedules
            </Text>
          </View>

          {/* Name Input */}
          <View className="my-3">
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="person-outline" size={20} color="black" />
              <Text className="text-lg ">Full Name</Text>
            </View>
            <TextInput
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Enter your full name"
              className="border border-gray-400 rounded-xl px-4 py-4"
              editable={!isLoading}
            />
          </View>

          {/* Route Picker */}
          <View className="my-3">
            <View className="flex-row items-center gap-2 mb-2">
              <FontAwesome5 name="route" size={20} color="black" />
              <Text className="text-lg ">Bus Route</Text>
            </View>
            <View className="border border-gray-400 rounded-xl">
              <Picker
                selectedValue={formData.routeId}
                onValueChange={(value) => handleInputChange("routeId", value)}
                enabled={!isLoading}
              >
                <Picker.Item label="Select your bus route" value="" />
                {availRoutes.map((route) => (
                  <Picker.Item
                    key={route._id}
                    label={`${route.name}: ${route.startLocation} <> ${route.endLocation}`}
                    value={route._id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Role Picker */}
          <View className="my-3">
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="person-add-outline" size={20} color="black" />
              <Text className="text-lg ">Role</Text>
            </View>
            <View className="border border-gray-400 rounded-xl">
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
          </View>

          {/* Email Input */}
          <View className="my-3">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialCommunityIcons name="email-outline" size={20} color="black" />
              <Text className="text-lg ">University Email</Text>
            </View>
            <TextInput
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="abc@diu.edu.bd"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-400 rounded-xl px-4 py-4"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View className="my-3">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="lock-outline" size={20} color="black" />
              <Text className="text-lg ">Password</Text>
            </View>
            <View className="flex-row items-center border border-gray-400 rounded-xl px-4 py-4">
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
          </View>

          {/* Register Button - Matches Login Button Style */}
          <View className="mt-6">
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              className="w-full bg-tertiary-900 p-3 rounded-xl flex-row justify-center"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-body text-center text-white">Register</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Already have an account - Matches Login Page Link Style */}
          <View className="mt-4 items-center">
            <View className="flex-row">
              <Text className="text-gray-600">Already have an account? </Text>
              <Link href="/login" className="text-blue-600">
                Sign In
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default Register;
