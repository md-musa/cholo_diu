import React from "react";
import { View, Text, TouchableOpacity, Image, Linking, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import Constants from "expo-constants";

export default function Settings() {
  const { userData, logout } = useAuth();
  const { name, email, role, route } = userData;

  const handleLogout = () => {
    logout();
  };

  const handleContact = () => {
    Linking.openURL("mailto:mohammad.musa706@gmail.com");
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Profile Header */}
      <View className="bg-indigo-600 pb-8 pt-12 px-6 rounded-b-3xl shadow-lg">
        <View className="items-center -mt-16">
          <View className="bg-white p-1 rounded-full shadow-xl">
            {/* <Image
              source={require('../../../../assets/images/profile_placeholder.png')}
              className="w-32 h-32 rounded-full border-4 border-indigo-100"
            /> */}
          </View>
          <Text className="text-2xl font-bold text-white mt-4">{name}</Text>
          <Text className="text-indigo-100">{email}</Text>
          
          <View className="flex-row mt-4 space-x-4">
            <View className="bg-indigo-500 px-4 py-2 rounded-full">
              <Text className="text-white text-sm capitalize">{role}</Text>
            </View>
            <View className="bg-indigo-500 px-4 mx-2 py-2 rounded-full">
              <Text className="text-white text-sm">Route: {route?.endLocation || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Settings Cards */}
      <View className="px-5 mt-2">
        {/* Account Settings */}
        <View className="bg-white rounded-2xl p-5 shadow-sm my-2">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Account Settings</Text>
          <SettingOption 
            icon="person-outline" 
            text="Edit Profile" 
            onPress={() => {}} 
          />
          <SettingOption 
            icon="notifications-outline" 
            text="Notification Preferences" 
            onPress={() => {}} 
          />
          <SettingOption 
            icon="lock-closed-outline" 
            text="Change Password" 
            onPress={() => {}} 
          />
        </View>

        {/* App Settings */}
        <View className="bg-white rounded-2xl p-5 shadow-sm my-2">
          <Text className="text-lg font-semibold text-gray-800 mb-4">App Settings</Text>
          <SettingOption 
            icon="moon-outline" 
            text="Dark Mode" 
            rightComponent={<ToggleSwitch />}
          />
          <SettingOption 
            icon="language" 
            text="Language" 
            rightComponent={<Text className="text-gray-500">English</Text>}
          />
          <SettingOption 
            icon="location-outline" 
            text="Location Services" 
            rightComponent={<ToggleSwitch />}
          />
        </View>

        {/* Support */}
        <View className="bg-white rounded-2xl p-5 shadow-sm my-2">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Support</Text>
          <SettingOption 
            icon="help-circle-outline" 
            text="Help Center" 
            onPress={() => {}} 
          />
          <SettingOption 
            icon="mail-outline" 
            text="Contact Support" 
            onPress={handleContact} 
          />
          <SettingOption 
            icon="shield-checkmark-outline" 
            text="Privacy Policy" 
            onPress={() => {}} 
          />
        </View>

        {/* Logout */}
        <TouchableOpacity 
          className="flex-row items-center justify-center bg-red-50 p-4 rounded-2xl border border-red-100 mt-5"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#dc2626" />
          <Text className="text-red-600 font-medium ml-3">Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View className="items-center my-8">
        <Text className="text-gray-400 text-sm">
          CHOLO v{Constants.expoConfig.version}
        </Text>
      </View>
    </ScrollView>
  );
}

// Reusable Components
const SettingOption = ({ icon, text, onPress, rightComponent, color = "gray" }) => (
  <TouchableOpacity 
    className="flex-row items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
    onPress={onPress}
    disabled={!onPress}
  >
    <View className="flex-row items-center">
      <Ionicons 
        name={icon} 
        size={22} 
        color={color === "gray" ? "#6b7280" : color} 
        style={{ marginRight: 12 }}
      />
      <Text className="text-gray-700">{text}</Text>
    </View>
    {rightComponent || <Ionicons name="chevron-forward" size={20} color="#9ca3af" />}
  </TouchableOpacity>
);

const ToggleSwitch = () => (
  <View className="w-12 h-6 bg-gray-200 rounded-full p-1">
    <View className="w-4 h-4 bg-white rounded-full shadow-md"></View>
  </View>
);