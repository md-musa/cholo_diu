import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert } from "react-native";
import { useAppSelector } from "@/store/storeConfig";
import { useGetScheduleByRouteQuery, useGetScheduleByDriverQuery } from "@/store/features/schedule/scheduleApi";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import LoadingScreen from "@/components/UI/LoadingScreen";
import { colors } from "@/config/colors";
import Navbar from "@/components/Navbar";
import DriverScheduleCard from "@/components/driver/DriverScheduleCard";

const DriverSchedule = () => {
  const { user, route } = useAppSelector((state) => state.auth);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase() === "friday" ? "friday" : "weekdays"
  );
  console.log(user);
  const {
    data: scheduleResult,
    isLoading: isScheduleLoading,
    refetch,
    error,
  } = useGetScheduleByDriverQuery({
    driverId: user?._id,
  });
  console.log("Schedule Result:", JSON.stringify(scheduleResult, null, 2));
  console.log("Schedule Error:", error);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  if (isScheduleLoading) return <LoadingScreen />;

  const getTimeLeft = (tripTime) => {
    try {
      const now = new Date();
      const [hours, minutes] = tripTime.split(":").map(Number); // assuming "HH:mm" format
      const tripDate = new Date();
      tripDate.setHours(hours, minutes, 0, 0);

      const diffMs = tripDate - now;
      if (diffMs <= 0) return "Starting soon";

      const diffMin = Math.floor(diffMs / 60000);
      const hrs = Math.floor(diffMin / 60);
      const mins = diffMin % 60;

      if (hrs > 0) return `${hrs}h ${mins}m left`;
      return `${mins}m left`;
    } catch {
      return "";
    }
  };

  const handleStartTrip = (trip) => {
    Alert.alert("Trip Started", `Bus: ${trip.busName}\nTime: ${trip.time}`);
    // TODO: emit socket event or API call to backend
  };

  return (
    <>
      <Navbar />
      <ScrollView
        className="flex-1 bg-muted-50 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Schedule Type (Weekdays / Friday) */}
        <View className="flex-row justify-center mt-4">
          {["weekdays", "friday"].map((day) => (
            <TouchableOpacity
              key={day}
              className={`mx-2 px-6 py-2 rounded-full border ${
                selectedDay === day ? "bg-secondary-500 border-secondary-600" : "bg-white border-muted-400"
              }`}
              onPress={() => setSelectedDay(day)}
            >
              <Text className={`capitalize font-semibold ${selectedDay === day ? "text-white" : "text-black"}`}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-6 bg-white rounded-xl shadow-md p-4">
          <View className="flex-row items-center mb-3">
            <Feather name="calendar" size={20} color={colors.secondary[600]} style={{ marginRight: 8 }} />
            <Text className="text-lg font-bold text-black">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>

          {scheduleResult?.length > 0 ? (
            scheduleResult.map((assignment) => <DriverScheduleCard data={assignment} />)
          ) : (
            <View className="flex-col items-center justify-center my-6 py-6 px-4 bg-muted-100 rounded-xl border border-muted-200">
              <MaterialCommunityIcons name="bus-clock" size={50} color={colors.tertiary[400]} />
              <Text className="text-black font-semibold text-base mt-3">No Schedule Found</Text>
              <Text className="text-muted-500 text-center mt-1">No trips available for today.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default DriverSchedule;
