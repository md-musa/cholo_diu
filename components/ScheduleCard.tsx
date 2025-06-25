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
      <View className="border-b border-muted-200 px-3 py-1">
        <View className="flex-row justify-center items-center">
          <View className="flex-1 pb-2 flex-row items-center">
            <FontAwesome5
              name="clock"
              size={16}
              color={status === SCHEDULE_STATUS.NEXT ? colors.secondary[500] : colors.muted[500]}
              style={{ marginRight: 8 }}
            />
            <Text
              className={`text-lg ${
                status === SCHEDULE_STATUS.NEXT ? "font-semibold text-secondary-600" : "text-muted-800"
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
                    : "text-purple-900 bg-purple-100 border border-purple-400"
                } py-1 px-4 rounded-full font-semibold`}
              >
                {status}
              </Text>
            </View>
          )}
        </View>
        {/* couldbe shuttle service */}
        {serviceType && (
          <View className="flex-row bg-secondary-600 rounded-full px-2 my-1">
            <Text className="text-sm mr-2 text-muted-100 capitalize">{serviceType}</Text>
          </View>
        )}

        {note && (
          <View className="flex-row items-start">
            <MaterialCommunityIcons
              name="note-text-outline"
              size={17}
              color={status === SCHEDULE_STATUS.NEXT ? colors.secondary[500] : colors.muted[500]}
              style={{ marginRight: 4 }}
            />
            <Text>
              <Text
                className={`text-sm font-semibold ${
                  status === SCHEDULE_STATUS.NEXT ? "text-secondary-500" : "text-muted-700"
                }`}
              >
                Note:
              </Text>
              <Text
                className={`text-sm capitalize ${
                  status === SCHEDULE_STATUS.NEXT ? "font-semibold text-secondary-500" : "text-muted-700"
                }`}
              >
                {" " + note}
              </Text>
            </Text>
          </View>
        )}
      </View>

      <View className="px-3 py-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-md text-muted-700">Assigned Buses:</Text>
        </View>

        {assignedBuses.length > 0 ? (
          <View className="flex-row flex-wrap">
            {assignedBuses.map((bus) => {
              const isActive = bus.name && activeBuses[bus.name];

              const handleBusPress = () => {
                if (isActive) {
                  router.push({
                    pathname: "/home/watchBusLocation",
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
                  key={bus._id}
                  className={`flex-row items-center px-2 py-1 mr-2 mb-2 rounded-full border ${
                    isActive ? "bg-yellow-50 border-yellow-300" : "bg-muted-100 border-muted-400"
                  }`}
                >
                  <Ionicons name="bus" size={16} color={colors.muted[800]} />
                  <Text className="ml-1 text-sm text-muted-800 capitalize">{bus.name}</Text>
                  {isActive && <Ionicons name="location" size={16} color="#f59e42" />}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="flex-row items-center justify-center">
            <MaterialIcons name="info-outline" size={16} color={colors.muted[500]} style={{ marginRight: 4 }} />
            <Text className="text-sm text-center text-muted-600">No bus assigned yet</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ScheduleCard;
