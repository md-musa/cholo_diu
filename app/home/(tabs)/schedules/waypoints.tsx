import React from "react";
import { View, Text, FlatList } from "react-native";
import { useAppSelector } from "@/store/storeConfig";
import { getWaypoints } from "@/assets/routes";

const Waypoints = () => {
  const { route } = useAppSelector((state) => state.auth);

  if (!route) {
    return <Text className="text-center mt-4">No route selected</Text>;
  }

  const waypoints = getWaypoints(route.name) || [];

  if (waypoints.length === 0) {
    return <Text className="text-center mt-4">No waypoints available for this route</Text>;
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Text className="text-center text-xl font-bold mt-4 mb-2">{route.endLocation} to Campus</Text>
      <FlatList
        data={waypoints}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item, index }) => (
          <View className="flex-row items-center space-x-4 mb-3 bg-white p-3 rounded-xl shadow-sm">
            <View className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-lg font-bold text-gray-800">{index + 1}</Text>
            </View>
            <Text className="text-lg mx-4 text-gray-800">{item.location}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Waypoints;
