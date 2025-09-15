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

  const {
    data: scheduleResult,
    isLoading: isScheduleLoading,
    refetch,
    error,
  } = useGetScheduleByDriverQuery({
    driverId: user?._id,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  // Filter schedules based on selected day
  useEffect(() => {
    if (scheduleResult && scheduleResult.length > 0) {
      const filtered = scheduleResult.filter((schedule) => {
        // Check if the schedule has a day property
        if (schedule.day) {
          if (selectedDay === "friday") {
            return schedule.day.toLowerCase() === "friday";
          } else {
            // For weekdays, show all days except Friday
            return schedule.day.toLowerCase() !== "friday";
          }
        }

        // If no day property exists, use the scheduleId.day as fallback
        if (schedule.scheduleId && schedule.scheduleId.day) {
          if (selectedDay === "friday") {
            return schedule.scheduleId.day.toLowerCase() === "friday";
          } else {
            return schedule.scheduleId.day.toLowerCase() !== "friday";
          }
        }

        // If no day information is available, show all schedules for weekdays
        return selectedDay === "weekdays";
      });

      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules([]);
    }
  }, [scheduleResult, selectedDay]);

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

  return (
    <View className="flex-1 bg-gray-100">
      <Navbar />
      <ScrollView
        className="flex-1"
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

        <View className="mt-6 p-4">
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

          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((assignment) => (
              <DriverScheduleCard key={assignment._id || assignment.tripId} data={assignment} refetchSchedule={refetch} />
            ))
          ) : (
            <View className="flex-col items-center justify-center my-6 py-6 px-4 bg-muted-100 rounded-xl border border-muted-200">
              <MaterialCommunityIcons name="bus-clock" size={50} color={colors.tertiary[400]} />
              <Text className="text-black font-semibold text-base mt-3">No Schedule Found</Text>
              <Text className="text-muted-500 text-center mt-1">No trips available for {selectedDay}.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DriverSchedule;
