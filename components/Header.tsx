import { View, Text } from "react-native";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const Header = () => {
  const { userData } = useAuth();
  // console.log("userdata hader ", userData);
  return (
    <View className="py-4 px-4 items-center text-black font-semibold flex-row justify-between">
      <View className="flex-row items-center">
        <Ionicons name="person" size={20} color="black" />
        <Text className="capitalize text-xl font-semibold text-black align-top ml-2">
          {userData?.user?.role}
        </Text>
      </View>
    </View>
  );
};

export default Header;
