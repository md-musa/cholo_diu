import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Schedules",
        headerTitleAlign: "left",
        headerStyle: {
          backgroundColor: "white",
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold",
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} className="bg-gray-100 rounded-full p-1 mx-2">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("setting")} className="mr-2">
            <Ionicons name="menu" size={27} color="black" />
          </TouchableOpacity>
        ),
        headerBackTitleVisible: true,
      })}
    />
  );
};

export default Layout;
