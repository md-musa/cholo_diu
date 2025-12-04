import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import { useAppDispatch, useAppSelector } from '@/store/storeConfig';
import { clearCredentials } from '@/store/features/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axiosInstance from '@/config/axiosInstance';
import { ASYNC_STORAGE_KEYS } from '@/constants';
import musaImg1 from '../../../../assets/images/p1.png';
import musaImg2 from '../../../../assets/images/p2.png';

export default function Settings() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, route } = useAppSelector(state => state.auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axiosInstance.get('/auth/user', {
          params: { userId: user._id },
        });
        setUserData(data);
      } catch (error) {
        //console.log("Failed to fetch user data:", error.message);
      }
    };
    getUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
            await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.CURRENT_ROUTE);
            await AsyncStorage.clear();

            dispatch(clearCredentials());

            router.replace('/(auth)/login');
          } catch (err) {
            console.log('Logout failed:', err.message);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-muted-100">
      {/* Profile Header */}
      <View className="bg-secondary-600 pb-8 pt-12 px-6 rounded-b-3xl shadow-lg">
        <View className="items-center -mt-16">
          <View className="bg-white p-1 rounded-full shadow-xl">
            {/* <Image
              source={require("../../../../assets/images/profile_placeholder.png")}
              className="w-32 h-32 rounded-full border-4 border-secondary-100"
            /> */}
          </View>
          <Text className="text-2xl font-bold text-white mt-4">{userData?.name}</Text>
          <Text className="text-secondary-100">{userData?.email}</Text>
          <View className="flex-row mt-4 space-x-4">
            <View className="bg-secondary-500 px-4 py-2 rounded-full mx-2">
              <Text className="text-white text-sm capitalize">Role: {userData?.role}</Text>
            </View>
            <View className="bg-secondary-500 px-4 py-2 rounded-full mx-2">
              <Text className="text-white text-sm">Route: {route?.routeName || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-5 mt-4">
        {/* Support Section */}
        <SectionCard title="Support">
          <SettingOption
            icon="mail-outline"
            text="Contact Support"
            onPress={() => Linking.openURL('mailto:mohammad.musa.dev@gmail.com')}
          />
          <SettingOption
            icon="shield-checkmark-outline"
            text="Privacy Policy"
            onPress={() => router.push('/(passenger)/(tabs)/setting/privacyAndPolicy')}
          />
          {/* <SettingOption
            icon="document-text-outline"
            text="Terms of Service"
            onPress={() => router.push("/(passenger)/setting/termsAndCondition")}
          /> */}

          <SettingOption
            icon="remove-circle-outline"
            text="Delete Account & Data"
            onPress={() => router.push('/(passenger)/setting/deleteAccount')}
          />
        </SectionCard>

        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-red-50 p-4 rounded-2xl border border-red-300 mt-5"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#dc2626" />
          <Text className="text-red-600 font-medium ml-3">Log Out</Text>
        </TouchableOpacity>

        <View className="border-b border-gray-300 my-10" />

        <SectionCard title="Developed By">
          <View className="flex-row items-center space-x-6 bg-white rounded-xl">
            {/* Left Column - Image */}
            <View className="w-[35%] ">
              <Image source={musaImg1} className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-lg" />
            </View>

            {/* Right Column - Details */}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-muted-800">Mohammad Musa</Text>
              <Text className="text-muted-600 mt-1 text-md">Full-Stack Software Developer</Text>

              {/* Social Links */}
              <View className="flex-row mt-4 space-x-4">
                <SocialLink
                  url="https://www.facebook.com/md.musa706"
                  icon={<FontAwesome name="facebook-f" size={18} color="#3b5998" />}
                  bgColor="bg-blue-100"
                />

                <SocialLink
                  url="mailto:mohammad.musa.dev@gmail.com"
                  icon={<MaterialIcons name="email" size={20} color="#d44638" />}
                  bgColor="bg-red-100"
                />

                <SocialLink
                  url="https://github.com/md-musa"
                  icon={<FontAwesome name="github" size={20} color="#333" />}
                  bgColor="bg-gray-100"
                />
              </View>
            </View>
          </View>
        </SectionCard>

        <SectionCard title="Growth & Future Plans">
          <Text className="mt-2 text-muted-700 mb-1 font-semibold">Notice:</Text>
          <Text className="text-muted-700 text-sm mb-2">
            The server is running on limited resources, as we do not have any funding. It may sometimes be slow or
            temporarily unavailable. We apologize for any inconvenience.
          </Text>

          <Text className="mt-4 text-muted-700 mb-1 font-semibold">
            If funding is provided, the project can be improved by adding the following features:
          </Text>

          <ListItem text="🗺️ Integrate Google Maps for a more interactive and user-friendly map experience." />
          <ListItem text="📍 Install a GPS tracker on each bus for automatic real-time location updates, so users don’t need to manually share their location. Bus locations can be viewed at any time." />
          <ListItem text="📅 Create a smart scheduling system to plan the number of buses required for each schedule based on class and work schedules." />
          <ListItem text="💬 Add a messaging feature so each route's community members can communicate, receive notices, and stay updated." />
        </SectionCard>

        {/* App Version */}
        <View className="items-center my-8">
          <Text className="text-muted-400 text-sm">CHOLO v{Constants.expoConfig.version}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

/* ================= Reusable Components ================= */

const SectionCard = ({ title, children }) => (
  <View className="bg-white border border-muted-300 rounded-2xl p-5 shadow-sm my-2">
    <Text className="text-lg font-semibold text-muted-800 mb-4">{title}</Text>
    {children}
  </View>
);

const SettingOption = ({ icon, text, onPress, rightComponent, color = 'gray' }) => (
  <TouchableOpacity
    className="flex-row items-center justify-between py-4 border-b border-muted-100 last:border-b-0"
    onPress={onPress}
    disabled={!onPress}
  >
    <View className="flex-row items-center">
      <Ionicons name={icon} size={22} color={color === 'gray' ? '#6b7280' : color} style={{ marginRight: 12 }} />
      <Text className="text-muted-700">{text}</Text>
    </View>
    {rightComponent || <Ionicons name="chevron-forward" size={20} color="#9ca3af" />}
  </TouchableOpacity>
);

const SocialLink = ({ url, icon, bgColor }) => (
  <TouchableOpacity onPress={() => Linking.openURL(url)} className={`mx-2 ${bgColor} p-2 rounded-full`}>
    {icon}
  </TouchableOpacity>
);

const ListItem = ({ text }) => (
  <View className="flex-row items-start mb-2">
    <Ionicons name="ellipse" size={6} color="#6b7280" style={{ marginTop: 6, marginRight: 8 }} />
    <Text className="text-muted-700 text-sm">{text}</Text>
  </View>
);
