import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAppSelector } from "@/store/storeConfig";
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"; // Added more icon sets
import { useRouter } from "expo-router";
import { colors } from "@/config/colors";
import { SCHEDULE_STATUS } from "@/constants";

interface AssignedBus {
  _id: string;
  name: string;
  [key: string]: any;
}

export interface Schedule {
  _id: string;
  status: string;
  formattedTime: string;
  note?: string;
  serviceType?: string;
  assignedBuses: AssignedBus[];
}

interface ScheduleCardProps {
  schedule: Schedule;
}

const ScheduleCard: React.FC<ScheduleCardProps> = (props) => {
  const router = useRouter();
  const { activeBuses } = useAppSelector((state) => state.busLocation);
  const { status, formattedTime, note, assignedBuses, serviceType } = props.schedule;
  console.log("Assigned Buses:", JSON.stringify(assignedBuses, null, 2));
  console.log(JSON.stringify(props, null, 2));
  return (
    <View
      className={`rounded-lg my-2 border ${
        status === SCHEDULE_STATUS.NEXT
          ? "bg-secondary-50 border-secondary-400"
          : status === SCHEDULE_STATUS.ACTIVE
          ? "border-pink-400 bg-pink-50 shadow-md"
          : "border-muted-400 bg-white shadow-md"
      }`}
    >
      {/* Top section with time and status */}
      <View className="border-b border-muted-200 px-3 py-2">
        <View className="flex-row justify-center items-center">
          <View className="flex-1 pb-1 flex-row items-center">
            <FontAwesome5
              name="clock"
              size={16}
              color={
                status === SCHEDULE_STATUS.ACTIVE
                  ? "#ec4899"
                  : status === SCHEDULE_STATUS.NEXT
                  ? colors.secondary[500]
                  : colors.muted[500]
              }
              style={{ marginRight: 8 }}
            />
            <Text
              className={`text-lg ${
                status === SCHEDULE_STATUS.ACTIVE
                  ? "font-semibold text-pink-500"
                  : status === SCHEDULE_STATUS.NEXT
                  ? "font-semibold text-secondary-600"
                  : "text-muted-800"
              }`}
            >
              {formattedTime}
            </Text>
          </View>

          {status && (
            <View className="flex-row items-center">
              <Text
                className={`text-sm ${
                  status === SCHEDULE_STATUS.ACTIVE
                    ? "text-pink-500 bg-pink-50 border border-pink-400"
                    : "text-secondary-700 bg-secondary-100 border border-secondary-400"
                } px-4 py-0.5 rounded-full font-semibold capitalize`}
              >
                {status}
              </Text>
            </View>
          )}
        </View>
        {/* couldbe shuttle service */}
        {/* {serviceType && (
          <View className="absolute right-2 top-2 bg-secondary-600 rounded-full px-2 my-1">
            <Text className="text-sm mr-2 text-muted-100 capitalize">{serviceType}</Text>
          </View>
        )} */}

        {note && (
          <View className="flex-row items-start">
            <Text>
              <Text className="text-sm font-semibold text-muted-700">Note:</Text>
              <Text className={`text-sm text-muted-700`}>{" " + (note.charAt(0).toUpperCase() + note.slice(1))}</Text>
            </Text>
          </View>
        )}
      </View>

      <View className="px-3">
        <Text className="text-md text-muted-700 text-center">Assigned Buses</Text>
        {/* <View className="flex-row items-center mb-1">
          <Ionicons name="bus" size={16} color={colors.muted[500]} style={{ marginRight: 6 }} />
        </View> */}

        {assignedBuses.length > 0 ? (
          <View className="flex-col py-2">
            {assignedBuses.map((bus) => {
              const isActive = bus.busId.name && activeBuses[bus.busId.name];

              const handleBusPress = () => {
                if (isActive) {
                  router.push({
                    pathname: "/(passenger)/watchBusLocation",
                    params: {
                      latitude: isActive.latitude,
                      longitude: isActive.longitude,
                    },
                  });
                }
              };

              return (
                <TouchableOpacity
                  onPress={handleBusPress}
                  key={bus.busId._id}
                  className="flex-row items-center px-3 py-2 rounded-2xl border border-gray-300 bg-gray-50 my-1"
                >
                  {/* 1st Column: Bus */}
                  <View className="flex-1 flex-row items-center">
                    <MaterialCommunityIcons name="bus" size={18} color="#4B5563" />
                    <Text className="ml-2 text-sm text-gray-800 capitalize">{bus.busId.name}</Text>
                  </View>

                  {/* 2nd Column: Driver
                  <View className="flex-1 flex-row items-center">
                    <Ionicons name="" size={16} color="#4B5563" />
                    <Text className="ml-2 text-sm text-gray-800 capitalize">{bus.driverId.name}</Text>
                  </View> */}

                  {/* 3rd Column: Status */}
                  <View className="flex-1 flex-row items-center justify-end">
                    <Ionicons
                      name={
                        bus.status === "departed" ? "time" : bus.status === "completed" ? "checkmark-circle" : "calendar"
                      }
                      size={16}
                      color={bus.status === "departed" ? "#2563EB" : bus.status === "completed" ? "#16A34A" : "#6B7280"}
                    />
                    <Text
                      className={`ml-2 text-sm capitalize ${
                        bus.status === "departed"
                          ? "text-blue-600"
                          : bus.status === "completed"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {bus.status || "scheduled"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="flex-row items-center justify-center py-2">
            <MaterialIcons name="info-outline" size={16} color={colors.muted[500]} style={{ marginRight: 4 }} />
            <Text className="text-sm text-center text-muted-600">No bus assigned yet</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ScheduleCard;
