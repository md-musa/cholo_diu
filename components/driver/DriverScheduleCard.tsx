import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import moment from "moment";
import { colors } from "@/config/colors";
import { useCreateTripMutation, useUpdateTripMutation } from "@/store/features/trip/tripApi";
import { TRIP_STATUS } from "@/constants";
import { useRouter } from "expo-router";
import { startBroadcasting } from "@/store/features/broadcast/broadcastSlice";
import { useAppDispatch } from "@/store/storeConfig";

const DriverScheduleCard = ({ data, refetchSchedule }: any) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { scheduleId, busId, tripStatus: rawTripStatus, tripId } = data || {};
  console.log("DriverScheduleCard data:", JSON.stringify(data, null, 2));

  const tripStatus = rawTripStatus || TRIP_STATUS.SCHEDULED;

  const [createTrip, { isLoading: isCreating }] = useCreateTripMutation();
  const [updateTrip, { isLoading: isUpdating }] = useUpdateTripMutation();

  const handleUpdate = async (id: string | null) => {
    try {
      if (!id) {
        // Create new trip
        const payload = {
          assignmentId: data?._id,
          status: TRIP_STATUS.ONGOING,
        };
        const result = await createTrip({ payload }).unwrap();
        console.log("Trip created:", result);
      } else {
        // Update existing trip
        const result = await updateTrip({
          id,
          payload: { status: TRIP_STATUS.COMPLETED },
        }).unwrap();
        console.log("Trip updated:", result);
      }
      refetchSchedule();
    } catch (err) {
      console.error("Failed to update/create trip:", err);
    }
  };

  const handleLocationShare = (tripId: string) => {
    console.log("Starting location share for trip:", tripId);

    dispatch(
      startBroadcasting({
        busName: busId?.name,
        busType: scheduleId.userType,
        tripId: tripId,
        note: "",
      })
    );
    router.navigate("/liveLocationSharing");
  };

  // Time formatting safely
  const today = moment().format("YYYY-MM-DD");
  const scheduleTime = scheduleId?.time || "00:00";
  const dateTime = moment(`${today} ${scheduleTime}`, "YYYY-MM-DD HH:mm");
  const formattedTime = dateTime.format("hh:mm A");

  // Bus name safely
  const capitalizedBusName = busId?.name ? busId.name.charAt(0).toUpperCase() + busId.name.slice(1) : "Unknown Bus";

  // Status styles
  const statusStyles: Record<string, string> = {
    [TRIP_STATUS.SCHEDULED]: "bg-blue-100 text-blue-700",
    [TRIP_STATUS.ONGOING]: "bg-yellow-100 text-yellow-700",
    [TRIP_STATUS.COMPLETED]: "bg-gray-200 text-gray-600",
    [TRIP_STATUS.CANCELED]: "bg-red-100 text-red-700",
  };
  const statusStyle = statusStyles[tripStatus] || "bg-gray-100 text-gray-600";

  const isLoading = isCreating || isUpdating;

  return (
    <View className="bg-white rounded-2xl shadow-md p-5 mb-4 border border-gray-200">
      {/* Top row: time + trip status */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="clock" size={24} color="#374151" />
          <Text className="ml-3 text-lg font-bold text-gray-800">{formattedTime}</Text>
        </View>
        <Text className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>
          {tripStatus.toUpperCase()}
        </Text>
      </View>

      {/* Bus info */}
      <View className="flex-row items-center mb-4">
        <MaterialCommunityIcons name="bus" size={24} color="#374151" />
        <Text className="ml-3 text-lg font-semibold text-gray-800">{capitalizedBusName}</Text>
      </View>

      {/* Direction */}
      <View className="flex-row items-center mb-4">
        <Feather name="repeat" size={20} color={colors.secondary[500]} style={{ marginRight: 8 }} />
        <Text className="text-lg text-muted-800 capitalize">
          {scheduleId?.direction === "to_campus"
            ? `${scheduleId?.routeId?.routeName || "Route"} → Campus`
            : `Campus → ${scheduleId?.routeId?.routeName || "Route"}`}
        </Text>
      </View>

      {/* Start / Complete Trip Button */}
      {tripStatus !== TRIP_STATUS.COMPLETED && tripStatus !== TRIP_STATUS.CANCELED && (
        <TouchableOpacity
          className={`py-3 px-4 rounded-lg items-center ${
            tripStatus === TRIP_STATUS.ONGOING ? "bg-yellow-500" : "bg-secondary-500"
          }`}
          onPress={() => handleUpdate(tripId || null)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              {tripStatus === TRIP_STATUS.SCHEDULED
                ? "Start Trip"
                : tripStatus === TRIP_STATUS.ONGOING
                ? "Complete Trip"
                : ""}
            </Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className="mt-3 py-3 px-4 rounded-lg items-center bg-gray-200"
        onPress={() => handleLocationShare(tripId)}
      >
        <Text className="text-gray-800 font-semibold text-lg">Share Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DriverScheduleCard;
