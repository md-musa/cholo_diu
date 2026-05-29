import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import moment from "moment";
import { colors } from "@/config/colors";
import { useCreateTripMutation, useUpdateTripMutation } from "@/store/features/trip/tripApi";
import { TRIP_STATUS } from "@/constants";
import { useRouter } from "expo-router";
import { startBroadcasting } from "@/store/features/broadcast/broadcastSlice";
import { useAppDispatch } from "@/store/storeConfig";

// ---------- Subcomponents ---------- //
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
    [TRIP_STATUS.SCHEDULED]: { bg: "bg-blue-100", text: "text-blue-700", label: "তালিকাভুক্ত" },
    [TRIP_STATUS.ONGOING]: { bg: "bg-yellow-100", text: "text-yellow-800", label: "চলমান" },
    [TRIP_STATUS.COMPLETED]: { bg: "bg-green-200", text: "text-green-700", label: "সম্পন্ন" },
    [TRIP_STATUS.CANCELED]: { bg: "bg-red-100", text: "text-red-700", label: "বাতিল" },
  };
  const style = statusStyles[status] || { bg: "bg-gray-100", text: "text-gray-600", label: status };
  if (status === TRIP_STATUS.SCHEDULED) return null; // Don't show canceled status
  return (
    <Text className={`px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>{style.label}</Text>
  );
};

const ActionButton = ({
  label,
  icon,
  bgColor,
  textColor = "text-white",
  loading,
  onPress,
}: {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  bgColor: string;
  textColor?: string;
  loading?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    className={`flex-row justify-center items-center py-3 px-5 rounded-xl shadow-md ${bgColor}`}
  >
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <>
        <MaterialCommunityIcons name={icon} size={20} color="white" style={{ marginRight: 6 }} />
        <Text className={`font-semibold text-lg ${textColor}`}>{label}</Text>
      </>
    )}
  </TouchableOpacity>
);

// ---------- Main Component ---------- //
const DriverScheduleCard = ({ data, refetchSchedule, isNextTrip = false }: any) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { scheduleId, busId, tripStatus: rawTripStatus, tripId } = data || {};
  const tripStatus = rawTripStatus || TRIP_STATUS.SCHEDULED;

  const [createTrip, { isLoading: isCreating }] = useCreateTripMutation();
  const [updateTrip, { isLoading: isUpdating }] = useUpdateTripMutation();
  const isLoading = isCreating || isUpdating;

  // Time formatting
  const today = moment().format("YYYY-MM-DD");
  const scheduleTime = scheduleId?.time || "00:00";
  const dateTime = moment(`${today} ${scheduleTime}`, "YYYY-MM-DD HH:mm");
  const formattedTime = dateTime.isValid() ? dateTime.format("hh:mm A") : "--:--";

  // Highlight upcoming trip with time left
  const timeLeft = useMemo(() => {
    if (!dateTime.isValid() || tripStatus !== TRIP_STATUS.SCHEDULED) return null;
    const diff = dateTime.diff(moment(), "minutes");
    if (diff <= 0) return null; // already started
    if (diff < 60) return `${diff} মিনিট বাকি`;
    return `${Math.floor(diff / 60)} ঘণ্টা ${diff % 60} মিনিট বাকি`;
  }, [dateTime, tripStatus]);

  // Bus name
  const busName =
    typeof busId?.name === "string" && busId.name.length > 0
      ? busId.name.charAt(0).toUpperCase() + busId.name.slice(1)
      : "অজানা বাস";

  const handleUpdate = async (assignmentId: string, id: string | null) => {
    try {
      if (!id) {
        await createTrip({
          payload: { assignmentId, status: TRIP_STATUS.ONGOING },
        }).unwrap();
      } else {
        await updateTrip({
          id,
          payload: { status: TRIP_STATUS.COMPLETED },
        }).unwrap();
      }
      refetchSchedule();
    } catch (err) {
      //console.error("Failed to update/create trip:", err);
    }
  };

  const handleLocationShare = (tripId: string) => {
    dispatch(
      startBroadcasting({
        busName: busId?.name || "Unknown Bus",
        busType: scheduleId?.userType || "Unknown",
        tripId,
        note: "",
      })
    );
    router.push("/liveLocationSharing");
  };

  if (tripStatus === TRIP_STATUS.COMPLETED) return null; // Don't render canceled trips
  return (
    <View
      className={`rounded-2xl shadow-md p-5 mb-4 border relative ${
        tripStatus === TRIP_STATUS.COMPLETED ? "bg-gray-100 border-gray-300 opacity-70" : "bg-white border-gray-400"
      } ${isNextTrip ? "border-2 border-green-600 shadow-lg shadow-green-200" : ""}`}
    >
      {/* Next Trip Badge */}
      {isNextTrip && (
        <View className="absolute top-2 right-2 bg-green-200  px-2 py-1 rounded-md shadow">
          <Text className="text-green-600 text-xs font-semibold">পরবর্তী ট্রিপ</Text>
        </View>
      )}

      {/* Top row */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="clock-outline" size={24} color="#374151" />
          <View className="ml-3">
            <Text className="text-lg font-bold text-gray-800">{formattedTime}</Text>
            {timeLeft && tripStatus === TRIP_STATUS.SCHEDULED && (
              <Text className="text-sm text-green-600 font-medium">{timeLeft}</Text>
            )}
          </View>
        </View>
        <StatusBadge status={tripStatus} />
      </View>

      {/* Bus info */}
      <View className="flex-row items-center mb-3">
        <MaterialCommunityIcons name="bus" size={24} color="#374151" />
        <Text className="ml-3 text-lg font-semibold text-gray-800">{busName}</Text>
      </View>

      {/* Route */}
      <View className="flex-row items-center mb-4">
        <Feather name="repeat" size={20} color="#374151" />
        <Text className="ml-3 text-lg text-gray-700 capitalize">
          {scheduleId?.direction === "to_campus"
            ? `${scheduleId?.routeId?.routeName || "রুট"} থেকে ইউনিভার্সিটি`
            : `ইউনিভার্সিটি থেকে ${scheduleId?.routeId?.routeName || "রুট"}`}
        </Text>
      </View>

      {/* Actions */}
      {tripStatus !== TRIP_STATUS.COMPLETED && tripStatus !== TRIP_STATUS.CANCELED && (
        <ActionButton
          label={tripStatus === TRIP_STATUS.SCHEDULED ? "ট্রিপ শুরু করুন" : "ট্রিপ শেষ করুন"}
          icon={tripStatus === TRIP_STATUS.SCHEDULED ? "play-circle-outline" : "check-circle-outline"}
          bgColor={tripStatus === TRIP_STATUS.ONGOING ? "bg-yellow-500" : "bg-green-600"}
          loading={isLoading}
          onPress={() => handleUpdate(data._id, tripId || null)}
        />
      )}

      {tripStatus === TRIP_STATUS.ONGOING && tripId && (
        <View className="mt-3">
          <ActionButton
            label="লাইভ লোকেশন শেয়ার করুন"
            icon="map-marker-radius-outline"
            bgColor="bg-blue-500"
            onPress={() => handleLocationShare(tripId)}
          />
        </View>
      )}
    </View>
  );
};

export default DriverScheduleCard;
