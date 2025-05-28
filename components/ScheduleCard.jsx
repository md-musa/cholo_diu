import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useAppSelector } from "@/store/storeConfig";
import { Ionicons } from "@expo/vector-icons";

const ScheduleCard = (props) => {
  const { activeBuses } = useAppSelector((state) => state.busLocation);
  const { _id, status, formattedTime, userType, note, assignedBuses } = props.schedule;

  return (
    <View
      key={_id}
      className={`rounded-lg py-2 my-2 border ${
        status === "Ongoing" ? "bg-indigo-50 border-indigo-400" : "border-gray-300 bg-white shadow-sm"
      }`}
    >
      {/* Top section with time and status */}
      <View className="flex-row px-3 justify-between items-center">
        <View className="flex-1">
          <Text className={`text-lg ${status === "Ongoing" ? "font-semibold text-indigo-500" : "text-gray-700"}`}>
            {formattedTime}
          </Text>
          {note && (
            <Text className={`text-sm ${status === "Ongoing" ? "font-semibold text-indigo-500" : "text-gray-700"}`}>
              N.B: {note}
            </Text>
          )}
        </View>

        {status && (
          <Text
            className={`text-sm ${
              status === "Next"
                ? "text-primary-900 bg-primary-50 border border-primary-400"
                : "text-purple-900 bg-purple-100 border border-purple-400"
            } py-1 px-2 rounded-full`}
          >
            {status} Sche.
          </Text>
        )}
      </View>

      {/* Assigned Buses - Compact horizontal list */}
      {assignedBuses?.length > 0 && (
        <View className="mt-2">
          <Text className="text-sm text-gray-700 px-3 my-1">Assigned Buses:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-3">
            {assignedBuses.map((bus) => (
              <View
                key={bus._id}
                className="flex-row items-center bg-gray-100 px-2 py-1 mr-2 rounded-full border border-gray-300"
              >
                <Ionicons name="bus" size={16} color={"#111827"} />
                <Text className="ml-1 text-sm text-gray-800 capitalize">{bus.name}</Text>
                {/* {activeBuses[bus.name] && <Ionicons name="location" size={14} color={"#10b981"} className="ml-1" />} */}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {
        <View className="mt-2">
          <Text className="text-sm text-gray-700 px-3 my-1">Location Shared Buses:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-3">
            {Object.values(activeBuses).map((bus) => (
              <View
                key={bus.trip._id}
                className="flex-row items-center bg-gray-100 px-2 py-1 mr-2 rounded-full border border-gray-300"
              >
                <Ionicons name="bus" size={16} color={"#111827"} />
                <Text className="ml-1 text-sm text-gray-800 capitalize">{bus.trip.busName}</Text>
                <Ionicons name="location" size={14} color={"#10b981"} className="ml-1" />
              </View>
            ))}
          </ScrollView>
        </View>
      }
    </View>
  );
};

export default ScheduleCard;
