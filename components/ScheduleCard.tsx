import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAppSelector } from "@/store/storeConfig";
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/config/colors";
import { SCHEDULE_STATUS } from "@/constants";
import moment from "moment";

// Interfaces
interface AssignedBus {
  _id: string;
  busId: { _id: string; name: string };
  driverId?: { _id: string; name: string };
  trip?: {
    status: string;
    startTime?: string;
    endTime?: string;
  };
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

// ------------------ Header ------------------
const ScheduleHeader: React.FC<{ status: string; formattedTime: string; note?: string }> = ({
  status,
  formattedTime,
  note,
}) => {
  return (
    <View className="border-b border-muted-200 px-3 py-2">
      <View className="flex-row justify-center items-center">
        {/* Time */}
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

        {/* Status */}
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

      {/* Note */}
      {note && (
        <View className="flex-row items-start mt-1">
          <Text>
            <Text className="text-sm font-semibold text-muted-700">Note:</Text>
            <Text className="text-sm text-muted-700"> {" " + (note.charAt(0).toUpperCase() + note.slice(1))}</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

// ------------------ Bus Item ------------------
const AssignedBusItem: React.FC<{ bus: AssignedBus; isActive: any; onPress: () => void }> = ({
  bus,
  isActive,
  onPress,
}) => {
  // Determine trip status
  const tripStatus = bus.trip?.status || "scheduled";
  let statusText = tripStatus;
  let statusColor = "bg-gray-200 text-gray-700"; // default for scheduled

  if (tripStatus === "departed") {
    if (bus.trip?.startTime) {
      const dur = moment.duration(moment().diff(moment(bus.trip.startTime)));
      const h = dur.hours();
      const m = dur.minutes();
      const compact = h && m ? `${h}h ${m}m ago` : h ? `${h}h ago` : m ? `${m}m ago` : "just now";
      statusText = `departed ${compact}`;
    } else {
      statusText = "departed";
    }
    statusColor = "bg-secondary-100 text-secondary-700";
  } else if (tripStatus === "completed") {
    statusText = "completed";
    statusColor = "bg-green-100 text-green-700";
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      key={bus._id}
      className="flex-row items-center px-3 py-2 rounded-2xl border border-gray-300 bg-gray-50 my-1"
    >
      {/* 1st Column: Bus */}
      <View className="flex-1 flex-row items-center">
        <MaterialCommunityIcons name="bus" size={18} color="#4B5563" />
        <Text className="ml-2 text-sm text-gray-800 capitalize">{bus.busId.name}</Text>
      </View>

      {/* 2nd Column: Status Label */}
      <View className="flex-1 flex-row items-center justify-end">
        <Text className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor}`}>{statusText}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ------------------ Bus List ------------------
const AssignedBusList: React.FC<{ assignedBuses: AssignedBus[] }> = ({ assignedBuses }) => {
  const router = useRouter();
  const { activeBuses } = useAppSelector((state) => state.busLocation);

  if (assignedBuses.length === 0) {
    return (
      <View className="flex-row items-center justify-center py-2">
        <MaterialIcons name="info-outline" size={16} color={colors.muted[500]} style={{ marginRight: 4 }} />
        <Text className="text-sm text-center text-muted-600">No bus assigned yet</Text>
      </View>
    );
  }

  return (
    <View className="flex-col py-2">
      {assignedBuses.map((bus, index) => {
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

        return <AssignedBusItem key={index} bus={bus} isActive={isActive} onPress={handleBusPress} />;
      })}
    </View>
  );
};

// ------------------ Schedule Card ------------------
const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule }) => {
  const { status, formattedTime, note, assignedBuses } = schedule;

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
      <ScheduleHeader status={status} formattedTime={formattedTime} note={note} />
      <View className="px-3">
        <Text className="text-md text-muted-700 text-center">Assigned Buses</Text>
        <AssignedBusList key={Math.random()} assignedBuses={assignedBuses} />
      </View>
    </View>
  );
};

export default ScheduleCard;
