import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Linking, ScrollView, Image } from "react-native";
import Constants from "expo-constants";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import { clearCredentials } from "@/store/features/auth/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axiosInstance from "@/config/axiosInstance";
import musaImg from "@/assets/images/musa2.jpg";
import NavbarDriver from "../../components/NavbarDriver";

export default function Settings() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, route } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/user", {
          params: { userId: user._id },
        });
        setUserData(data);
      } catch (error) {
        console.log("Failed to fetch user data:", error.message);
      }
    };
    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      router.dismissAll();
      await AsyncStorage.clear();
      router.replace("/(auth)/login");
      dispatch(clearCredentials());
    } catch (err) {
      console.log("Logout failed:", err.message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-muted-100">
      <NavbarDriver />
      {/* Profile Header */}
      <View className="bg-secondary-600 py-14 rounded-b-3xl shadow-lg">
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
          </View>
        </View>
      </View>

      <View className="px-5 mt-4">
        {/* Support Section */}
        {/* <SectionCard title="Support">
          <SettingOption
            icon="mail-outline"
            text="Contact Support"
            onPress={() => Linking.openURL("mailto:mohammad.musa706@gmail.com")}
          />
          <SettingOption
            icon="shield-checkmark-outline"
            text="Privacy Policy"
            // onPress={() => router.push("/(passenger)/setting/privacyAndPolicy")}
          />
        </SectionCard> */}

        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-red-50 p-4 rounded-2xl border border-red-300 mt-5"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#dc2626" />
          <Text className="text-red-600 font-medium ml-3">Log Out</Text>
        </TouchableOpacity>

        <View className="border-b border-gray-300 my-10" />

        {/* Developer Profile */}
        {/* <SectionCard title="Developer">
          <View className="items-center mb-4">
            <Image source={musaImg} className="w-32 h-32 rounded-full border-2 border-muted-300" />
            <Text className="text-xl font-bold text-muted-900 mt-3">Mohammad Musa</Text>
            <Text className="text-muted-600">Software Developer</Text>
            <Text className="text-muted-500 text-sm mt-1 text-center px-4">
              Building innovative mobile solutions with React Native and Node.js.
            </Text>
            <View className="flex-row mt-3">
              <SocialLink
                url="https://facebook.com/yourprofile"
                icon={<FontAwesome name="facebook" size={15} color="#3b5998" />}
                bgColor="bg-blue-100"
              />
              <SocialLink
                url="https://linkedin.com/in/yourprofile"
                icon={<FontAwesome name="linkedin" size={18} color="#0077b5" />}
                bgColor="bg-blue-100"
              />
              <SocialLink
                url="mailto:mohammad.musa706@gmail.com"
                icon={<MaterialIcons name="email" size={18} color="#d44638" />}
                bgColor="bg-red-100"
              />
              <SocialLink
                url="https://github.com/yourprofile"
                icon={<FontAwesome name="github" size={18} color="#333" />}
                bgColor="bg-muted-100"
              />
            </View>
          </View>
        </SectionCard> */}

        {/* Future Features */}
        {/* <SectionCard title="Planned Features">
          <ListItem text="Push notifications for bus arrivals" />
          <ListItem text="Offline route access" />
          <ListItem text="Real-time bus crowd tracking" />
        </SectionCard> */}

        {/* Known Bugs */}
        {/* <SectionCard title="Known Bugs">
          <ListItem text="Occasional delay in bus location updates" />
          <ListItem text="Route data mismatch on slow networks" />
        </SectionCard> */}

        {/* Current Limitations */}
        {/* <SectionCard title="Current Limitations">
          <ListItem text="No multi-language support yet" />
          <ListItem text="Only available for selected campus routes" />
        </SectionCard> */}

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

const SettingOption = ({ icon, text, onPress, rightComponent, color = "gray" }) => (
  <TouchableOpacity
    className="flex-row items-center justify-between py-4 border-b border-muted-100 last:border-b-0"
    onPress={onPress}
    disabled={!onPress}
  >
    <View className="flex-row items-center">
      <Ionicons name={icon} size={22} color={color === "gray" ? "#6b7280" : color} style={{ marginRight: 12 }} />
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
