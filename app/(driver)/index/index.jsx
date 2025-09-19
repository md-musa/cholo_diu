import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { useAppSelector } from "@/store/storeConfig";
import { useGetScheduleByDriverQuery } from "@/store/features/schedule/scheduleApi";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import LoadingScreen from "@/components/UI/LoadingScreen";
import { colors } from "@/config/colors";
import Navbar from "@/components/Navbar";
import DriverScheduleCard from "@/components/driver/DriverScheduleCard";
import moment from "moment";

const dayLabels: Record<string, string> = {
  weekdays: "সপ্তাহের দিন",
  friday: "শুক্রবার",
};

const DriverSchedule = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase() === "friday" ? "friday" : "weekdays"
  );

  const { data: scheduleResult, isLoading: isScheduleLoading, refetch } = useGetScheduleByDriverQuery({
    driverId: user?._id,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  // Filter schedules based on selected day
  useEffect(() => {
    if (scheduleResult && scheduleResult.length > 0) {
      const filtered = scheduleResult.filter((schedule) => {
        const day = schedule.day || schedule.scheduleId?.day;
        if (!day) return selectedDay === "weekdays";
        if (selectedDay === "friday") return day.toLowerCase() === "friday";
        return day.toLowerCase() !== "friday";
      });

      // Sort schedules by time
      filtered.sort((a, b) => {
        const timeA = a.scheduleId?.time || "00:00";
        const timeB = b.scheduleId?.time || "00:00";
        return moment(timeA, "HH:mm").diff(moment(timeB, "HH:mm"));
      });

      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules([]);
    }
  }, [scheduleResult, selectedDay]);

  // Identify next upcoming trip
  const nextTripId = useMemo(() => {
    const now = moment();
    for (let schedule of filteredSchedules) {
      const time = schedule.scheduleId?.time || "00:00";
      const scheduleTime = moment(time, "HH:mm");
      if (scheduleTime.isAfter(now)) return schedule._id || schedule.tripId;
    }
    return null;
  }, [filteredSchedules]);

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

      <View className="flex-row justify-center mt-4">
        {["weekdays", "friday"].map((day) => (
          <TouchableOpacity
            key={day}
            className={`mx-2 px-6 py-2 rounded-full border ${
              selectedDay === day ? "bg-secondary-500 border-secondary-600" : "bg-white border-gray-300"
            } shadow-sm`}
            onPress={() => setSelectedDay(day)}
          >
            <Text className={`capitalize font-semibold ${selectedDay === day ? "text-white" : "text-gray-800"}`}>
              {dayLabels[day]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header with current date */}
        <View className="mt-6 px-4 mb-4">
          <View className="flex-row items-center">
            <Feather name="calendar" size={20} color={colors.secondary[600]} style={{ marginRight: 8 }} />
            <Text className="text-lg font-bold text-black">
              {new Date().toLocaleDateString("bn-BD", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>
        </View>

        {/* Schedule Cards */}
        <View className="px-4 space-y-4">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((assignment) => (
              <DriverScheduleCard
                key={assignment._id || assignment.tripId}
                data={assignment}
                refetchSchedule={refetch}
                isNextTrip={assignment._id === nextTripId} // Highlight next trip
              />
            ))
          ) : (
            <View className="flex-col items-center justify-center my-6 py-6 px-4 bg-white rounded-xl border border-gray-300 shadow">
              <MaterialCommunityIcons name="bus-clock" size={50} color={colors.tertiary[400]} />
              <Text className="text-black font-semibold text-base mt-3">কোনো ট্রিপ পাওয়া যায়নি</Text>
              <Text className="text-gray-500 text-center mt-1">
                {dayLabels[selectedDay]} জন্য কোনো ট্রিপ নেই
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DriverSchedule;
