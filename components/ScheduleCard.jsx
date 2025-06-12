import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useAppSelector } from "@/store/storeConfig";
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"; // Added more icon sets
import { useRouter } from "expo-router";

const ScheduleCard = (props) => {
  const router = useRouter();
  const { activeBuses } = useAppSelector((state) => state.busLocation);
  const { _id, status, formattedTime, note, assignedBuses } = props.schedule;

  // Icon for status
  const getStatusIcon = () => {
    if (status === "Ongoing")
      return <MaterialIcons name="play-circle-outline" size={18} color="#6366f1" className="mr-1" />;
    if (status === "Next") return <MaterialIcons name="schedule" size={18} color="#7c3aed" className="mr-1" />;
    return <MaterialIcons name="history" size={18} color="#6b7280" className="mr-1" />;
  };

  return (
    <View
      key={_id}
      className={`rounded-lg my-2 border ${
        status === "Ongoing" ? "bg-indigo-50 border-indigo-400" : "border-gray-400 bg-white shadow-md"
      }`}
    >
      {/* Top section with time and status */}
      <View className="border-b border-gray-200 px-3 py-1">
        <View className="flex-row justify-center items-center">
          <View className="flex-1 pb-2 flex-row items-center">
            <FontAwesome5
              name="clock"
              size={16}
              color={status === "Ongoing" ? "#6366f1" : "#6b7280"}
              className="mr-2"
            />
            <Text className={`text-lg ${status === "Ongoing" ? "font-semibold text-indigo-600" : "text-gray-800"}`}>
              {formattedTime}
            </Text>
          </View>

          {status && (
            <View className="flex-row items-center">
              <Text
                className={`text-sm ${
                  status === "Next"
                    ? "text-primary-900 bg-primary-50 border border-primary-400"
                    : "text-purple-900 bg-purple-100 border border-purple-400"
                } py-1 px-4 rounded-full font-semibold`}
              >
                {status}
              </Text>
            </View>
          )}
        </View>

        {note && (
          <View className="flex-row items-start">
            <MaterialCommunityIcons
              name="note-text-outline"
              size={17}
              color={status === "Ongoing" ? "#6366f1" : "#6b7280"}
              className="mr-1"
            />
            <Text>
              <Text className={`text-sm font-semibold ${status === "Ongoing" ? "text-indigo-500" : "text-gray-700"}`}>
                Note:
              </Text>
              <Text
                className={`text-sm capitalize ${
                  status === "Ongoing" ? "font-semibold text-indigo-500" : "text-gray-700"
                }`}
              >
                {" "}
                {note}
              </Text>
            </Text>
          </View>
        )}
      </View>

      <View className="px-3 py-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-md text-gray-700">Assigned Buses:</Text>
        </View>

        {assignedBuses.length > 0 ? (
          <View className="flex-row flex-wrap">
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
                  {isActive && <Ionicons name="location" size={16} color="#f59e42" className="ml-1" />}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="flex-row items-center justify-center">
            <MaterialIcons name="info-outline" size={16} color="#6b7280" className="mr-1" />
            <Text className="text-sm text-center text-gray-600">No bus assigned yet</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ScheduleCard;
