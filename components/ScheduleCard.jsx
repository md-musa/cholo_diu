import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useAppSelector } from "@/store/storeConfig";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ScheduleCard = (props) => {
  const router = useRouter();
  const { activeBuses } = useAppSelector((state) => state.busLocation);
  const { _id, status, formattedTime, note, assignedBuses } = props.schedule;

  return (
    <View
      key={_id}
      className={`rounded-lg py-2 my-2 border ${
        status === "Ongoing" ? "bg-indigo-50 border-indigo-400" : "border-gray-400 bg-white shadow-md"
      }`}
    >
      {/* Top section with time and status */}
      <View className="flex-row px-3 justify-between items-center border-b border-gray-200">
        <View className="flex-1 pb-2 ">
          <Text className={`text-lg ${status === "Ongoing" ? "font-semibold text-indigo-500" : "text-gray-700"}`}>
            {formattedTime}
          </Text>
          {note && (
            <Text className={`text-sm ${status === "Ongoing" ? "font-semibold text-indigo-500" : "text-gray-700"}`}>
              Note: {note}
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

      <View className="mt-2">
        <Text className="text-md text-gray-700 px-3 my-1">Assigned Buses:</Text>

        {assignedBuses.length > 0 ? (
          <View className="flex-row flex-wrap px-3">
            {assignedBuses.map((bus) => {
              const isActive = activeBuses[bus.name];

              return (
                <TouchableOpacity
                  onPress={() => {
                    if (isActive) {
                      router.push({
                        pathname: "/home/watchBusLocation",
                        params: {
                          latitude: isActive.latitude,
                          longitude: isActive.longitude,
                        },
                      });
                    }
                  }}
                  key={bus._id}
                  className={`flex-row items-center px-2 py-1 mr-2 mb-2 rounded-full border ${
                    isActive ? "bg-yellow-50 border-yellow-300" : "bg-gray-100 border-gray-400"
                  }`}
                >
                  <Ionicons name="bus" size={16} color="#111827" />
                  <Text className="ml-1 text-sm text-gray-800 capitalize">{bus.name}</Text>
                  {isActive && <Ionicons name="location" size={16} color="#111827" className="ml-1" />}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text className="text-sm text-center text-gray-600">No bus assigned yet</Text>
        )}
      </View>
    </View>
  );
};

export default ScheduleCard;
