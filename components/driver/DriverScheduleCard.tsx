import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";
import moment from "moment";
import { colors } from "@/config/colors";

const DriverScheduleCard = ({ data }) => {
  const { scheduleId, busId, tripStatus, tripId } = data;

  // Convert schedule time to today's date for comparison
  const today = moment().format("YYYY-MM-DD");
  const dateTime = moment(`${today} ${scheduleId.time}`, "YYYY-MM-DD HH:mm");

  const formattedTime = dateTime.format("hh:mm A"); // 12-hour format
  const leftTime = dateTime.fromNow(); // e.g., "in 2 hours"

  // Status styling
  const statusStyle =
    tripStatus === "ongoing"
      ? "bg-green-100 text-green-700"
      : tripStatus === "completed"
      ? "bg-gray-200 text-gray-600"
      : "bg-blue-100 text-blue-700";

  return (
    <View className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-200">
      {/* Top row: tripStatus + time left */}
      <View className="flex-row justify-between items-start mb-3">
        <Text className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>
          {tripStatus.toUpperCase()}
        </Text>
        <Text className="text-xs text-gray-500">{leftTime}</Text>
      </View>

      {/* Bus info */}
      <View className="flex-row items-center mb-2">
        <MaterialCommunityIcons name="bus" size={20} color="#374151" />
        <Text className="ml-2 text-base font-semibold text-gray-800">{busId.name}</Text>
        <Text className="ml-2 text-sm text-gray-500">({busId.busType})</Text>
      </View>

      {/* Direction */}
      <View className="flex-row items-center mb-1">
        <Feather name="repeat" size={18} color={colors.secondary[500]} style={{ marginRight: 6 }} />
        <Text className="text-md text-muted-800 capitalize">
          {scheduleId?.direction === "to_campus"
            ? `${scheduleId.routeId.routeName} → Campus`
            : `Campus → ${scheduleId.routeId.routeName}`}
        </Text>
      </View>

      {/* Departure time */}
      <View className="flex-row items-center mb-2">
        <Ionicons name="time" size={18} color="#374151" />
        <Text className="ml-2 text-sm text-gray-600">{formattedTime}</Text>
      </View>

      {/* Start Trip Button */}
      <TouchableOpacity
        className={`py-2 px-4 rounded-lg items-center ${
          tripStatus === "completed" ? "bg-gray-300" : "bg-secondary-500"
        }`}
        disabled={tripStatus === "completed"}
        onPress={() => console.log(`Starting trip with ID: ${tripId}`)}
      >
        <Text className="text-white font-semibold">{tripStatus === "completed" ? "Trip Completed" : "Start Trip"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DriverScheduleCard;
