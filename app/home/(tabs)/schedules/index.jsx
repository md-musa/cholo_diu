import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/config/axiosInstance";
import { processSchedules } from "@/utils/scheduleHelper";
import ScheduleCard from "@/components/ScheduleCard";
import { Feather } from "@expo/vector-icons";
import Navbar from "@/components/Navbar";
import { Picker } from "@react-native-picker/picker";
import RouteService from "@/services/routeService";
import ScheduleService from "@/services/scheduleService";

const BusSchedule = () => {
  const { userData, updateRoute, routeData } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState(userData?.role == "student" ? "Student" : "Employee");
  const [schedules, setSchedules] = useState(null);
  const [selectedType, setSelectedType] = useState("Regular");
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase() === "friday" ? "Friday" : "Weekdays"
  );

  const scheduleTypes = ["Regular", "Mid-Term", "Final", "Ramadan"];
  const scheduleDays = ["Weekdays", "Friday"];

  const [currentRoute, setCurrentRoute] = useState(routeData);
  const [availRoutes, setAvailRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await RouteService.getRoutes();
        setAvailRoutes(res.data);
      } catch (err) {
        // console.error("shce[home] API Error:", err.message);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      const { data } = await ScheduleService.getScheduleByRoute(routeData._id, selectedDay);
      setSchedules(data);
    };

    fetchSchedules();
  }, [routeData, selectedDay]);

  let toCampusStudent, fromCampusStudent, toCampusEmployee, fromCampusEmployee;
  if (schedules) {
    toCampusStudent = processSchedules(schedules?.to_campus.student);
    fromCampusStudent = processSchedules(schedules?.from_campus.student);
    toCampusEmployee = processSchedules(schedules?.to_campus.employee);
    fromCampusEmployee = processSchedules(schedules?.from_campus.employee);
  }

  const handleRouteChange = (selectedRouteId) => {
    const selectedRouteData = availRoutes.find((r) => r._id === selectedRouteId);
    setCurrentRoute(selectedRouteData);
    updateRoute(selectedRouteData);
  };

  return (
    <ScrollView className="flex-1 bg-white px-4">
      {/* <Navbar /> */}
      {/* View Stoppage Button */}
      <View className="">
        <View className="mt-4 my-2">
          {/* ---- Schedule Type ----- */}
          <View className="flex-row flex-wrap mb-3">
            {scheduleTypes.map((type) => (
              <TouchableOpacity
                key={type}
                className={`mx-1 px-4 py-1 border rounded-full ${
                  selectedType === type ? "bg-indigo-500" : "bg-gray-100"
                } border-gray-300`}
                disabled={true} // Disabled as requested
              >
                <Text className={`capitalize ${selectedType === type ? "text-white" : "text-gray-500"}`}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ---- Schedule days ----- */}
          <View className="flex-row flex-wrap">
            {scheduleDays.map((day) => (
              <TouchableOpacity
                key={day}
                className={`mx-1 px-4 py-1 border rounded-full ${
                  selectedDay === day ? "bg-indigo-500" : "bg-white"
                } border-gray-300`}
                onPress={() => setSelectedDay(day)}
              >
                <Text className={`capitalize ${selectedDay === day ? "text-white" : "text-black"}`}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View className="bg-tertiary-900 rounded-3xl my-4 p-1">
        {/*----- Date & Route Selector --------- */}
        <View className="mt-4 flex-row justify-between items-center px-4">
          <Text className="flex-[0.6] text-lg font-semibold text-white">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </Text>

          <View className="flex-[0.4] rounded-lg overflow-hidden">
            <Picker
              selectedValue={routeData._id}
              onValueChange={handleRouteChange}
              style={{
                flex: 1,
                backgroundColor: "white",
                fontSize: 14,
                color: "black",
              }}
              dropdownIconColor="black"
              mode="dropdown"
            >
              <Picker.Item
                label="Select a route"
                value=""
                style={{
                  fontSize: 14,
                }}
              />
              {availRoutes?.map((route) => (
                <Picker.Item
                  key={route?._id}
                  label={`${route.endLocation}`}
                  value={route._id}
                  style={{
                    fontSize: 14,
                  }}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View className="bg-white p-4 my-4 rounded-xl">
          {/* ------Student, Employee, All Filter------- */}
          <View className="flex-row justify-around rounded-md">
            {/* Student Button */}
            <TouchableOpacity
              className={`px-6 py-2 rounded-lg border w-[45%] mx-2
                        ${
                          selectedFilter === "Student" ? "bg-indigo-500 border-indigo-600" : "bg-white border-gray-300"
                        }`}
              onPress={() => setSelectedFilter("Student")}
            >
              <Text
                className={`text-center font-semibold 
                          ${selectedFilter === "Student" ? "text-white" : "text-gray-700"}`}
              >
                Student
              </Text>
            </TouchableOpacity>

            {/* Employee Button */}
            <TouchableOpacity
              className={`px-6 py-2 rounded-lg border w-[45%] mx-2
                        ${
                          selectedFilter === "Employee" ? "bg-indigo-500 border-indigo-600" : "bg-white border-gray-300"
                        }`}
              onPress={() => setSelectedFilter("Employee")}
            >
              <Text
                className={`text-center font-semibold 
                          ${selectedFilter === "Employee" ? "text-white" : "text-gray-700"}`}
              >
                Employee
              </Text>
            </TouchableOpacity>
          </View>

          {/* -----Bus Schedule--------- */}
          {schedules ? (
            <View className="mt-4">
              {selectedFilter == "Student" ? (
                <>
                  <View className="">
                    <View className="flex-row items-center justify-center bg-white px-4 py-1 rounded-2xl my-2  border-gray-300">
                      <Text className="text-gray-600 font-semibold text-md">{routeData?.endLocation}</Text>
                      <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                      <Text className="text-gray-600 font-semibold text-md">{routeData?.startLocation}</Text>
                    </View>

                    {toCampusStudent?.length > 0 &&
                      toCampusStudent?.map((schedule) => <ScheduleCard key={schedule._id} schedule={schedule} />)}
                    {toCampusStudent?.length == 0 && (
                      <Text className="text-gray-600 bg-white shadow-sm font-semibold text-sm text-center my-3 border py-3 rounded-lg border-gray-300">
                        No schedule found
                      </Text>
                    )}
                  </View>
                  <View className="">
                    <View className="flex-row items-center justify-center bg-white px-4 py-1 rounded-2xl my-2 mt-5  border-gray-300">
                      <Text className="text-gray-600 font-semibold text-md">{routeData?.startLocation}</Text>
                      <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                      <Text className="text-gray-600 font-semibold text-md">{routeData?.endLocation}</Text>
                    </View>

                    {fromCampusStudent?.length > 0 &&
                      fromCampusStudent?.map((schedule) => <ScheduleCard key={schedule._id} schedule={schedule} />)}
                    {fromCampusStudent?.length == 0 && (
                      <Text className="text-gray-600 bg-white shadow-sm font-semibold text-sm text-center my-3 border py-3 rounded-lg border-gray-300">
                        No schedule found
                      </Text>
                    )}
                  </View>
                </>
              ) : (
                <>
                  <View className="">
                    <View className="flex-row items-center justify-center bg-white px-4 py-1 rounded-2xl my-2  border-gray-300">
                      <Text className="text-gray-600 font-semibold text-md">{routeData?.endLocation}</Text>
                      <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                      <Text className="text-gray-600 font-semibold text-md">{routeData?.startLocation}</Text>
                    </View>

                    {toCampusEmployee?.length > 0 &&
                      toCampusEmployee?.map((schedule) => <ScheduleCard key={schedule._id} schedule={schedule} />)}
                    {toCampusEmployee?.length == 0 && (
                      <Text className="text-gray-600 bg-white shadow-sm font-semibold text-sm text-center my-3 border py-3 rounded-lg border-gray-300">
                        No schedule found
                      </Text>
                    )}
                  </View>
                  <View className="">
                    <View className="flex-row items-center justify-center bg-white px-4 py-1 rounded-2xl my-2 mt-5  border-gray-300">
                      <Text className="text-gray-600 font-semibold text-md">{routeData?.startLocation}</Text>
                      <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                      <Text className="text-gray-600 font-semibold text-md">{routeData?.endLocation}</Text>
                    </View>

                    {fromCampusEmployee?.length > 0 &&
                      fromCampusEmployee?.map((schedule) => <ScheduleCard key={schedule._id} schedule={schedule} />)}
                    {fromCampusEmployee?.length == 0 && (
                      <Text className="text-gray-600 bg-white shadow-sm font-semibold text-sm text-center my-3 border py-3 rounded-lg border-gray-300">
                        No schedule found
                      </Text>
                    )}
                  </View>
                </>
              )}
            </View>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
          )}
        </View>
      </View>
    </ScrollView>
  );
};
export default BusSchedule;
