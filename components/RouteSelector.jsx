import React, { useState, useEffect } from "react";
import { View, Text, Image, Alert, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import busImage from "@/assets/images/icon.png";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/config/axiosConfig";
import { findOngoingOrNextSchedule } from "@/utils/scheduleHelper";
import { Link } from "expo-router";

const RouteSelector = () => {
  const { userData, updateRoute } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(userData?.route);
  const [availRoutes, setAvailRoutes] = useState([]);
  const [schedules, setSchedules] = useState(null);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase() === "friday" ? "Friday" : "Weekdays"
  );

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await apiClient.get("/routes");
        setAvailRoutes(res.data.data);
      } catch (err) {
        console.error("API Error:", err.message);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const { data } = await apiClient.get(`/schedules/get-single-route-schedule`, {
          params: { routeId: userData?.route?._id, day: selectedDay.toLocaleLowerCase() },
        });

        setSchedules(data.data);
      } catch (err) {
        console.log("Error fetching schedules:", err);
      }
    };

    fetchSchedules();
  }, [currentRoute, userData, selectedDay]);

  const handleRouteChange = (selectedRouteId) => {
    const selectedRouteData = availRoutes.find((r) => r._id === selectedRouteId);
    setCurrentRoute(selectedRouteData);
    updateRoute(selectedRouteData);
    // onRouteChange(selectedRouteData);
  };

  // if (!schedules) return <ActivityIndicator size="large" color="#0000ff" />;

  let toCampusStudent, fromCampusStudent, toCampusEmployee, fromCampusEmployee;
  if (schedules) {
    // console.log("schedules", schedules);
    toCampusStudent = findOngoingOrNextSchedule(schedules.to_campus.student);
    fromCampusStudent = findOngoingOrNextSchedule(schedules.from_campus.student);
    toCampusEmployee = findOngoingOrNextSchedule(schedules.to_campus.employee);
    fromCampusEmployee = findOngoingOrNextSchedule(schedules.from_campus.employee);
    //   console.log("toCampusEmployee", toCampusEmployee);
    //   console.log("fromCampusEmployee", fromCampusEmployee);
    //   console.log("toCampusStudent", toCampusStudent);
    //   console.log("fromCampusStudent", fromCampusStudent);
  }

  return (
    <View className="bg-primary-1000 p-4 rounded-xl">
      <View className="flex flex-row items-center bg-white border border-gray-300 rounded-xl px-3">
        <Image source={busImage} className="rounded-md" resizeMode="contain" style={{ width: 30, height: 30 }} />
        <Picker
          selectedValue={currentRoute?._id}
          onValueChange={handleRouteChange}
          style={{
            flex: 1,
            backgroundColor: "white",
            fontSize: 16,
            fontWeight: "bold",
            color: "black",
          }}
          dropdownIconColor="black"
          mode="dropdown"
        >
          <Picker.Item
            label="Select a route"
            value=""
            style={{
              fontWeight: "bold",
              fontSize: 16,
            }}
          />
          {availRoutes?.map((route) => (
            <Picker.Item
              key={route?._id}
              label={`${route.endLocation} Route`}
              value={route._id}
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "black",
              }}
            />
          ))}
        </Picker>
      </View>

      <View className="mt-2">
        <Text className="py-1 my-2 px-2 w-44 rounded-md text-white font-semibold bg-gray-50/20 text-md">
          Next Bus Schedule
        </Text>

        <View className="flex-row border-b border-white/70 pb-2">
          <Text className="text-white text-md font-semibold flex-1">Route</Text>
          <Text className="text-white text-md font-semibold flex-1 text-center">Student </Text>
          <Text className="text-white text-md font-semibold flex-1 text-right">Employee </Text>
        </View>

        <View className="flex-row py-2">
          <Text className="text-white text-md flex-1">{`To ${currentRoute?.startLocation}`}</Text>
          <Text className="text-white text-lg flex-1 text-center">
            {toCampusStudent ? `${toCampusStudent.formattedTime}` : "No schedule"}
          </Text>
          <Text className="text-white text-lg flex-1 text-right">
            {toCampusEmployee ? `${toCampusEmployee.formattedTime}` : "No schedule"}
          </Text>
        </View>

        <View className="flex-row border-y border-white/50 py-2">
          <Text className="text-white text-md flex-1">{`From ${currentRoute?.startLocation}`}</Text>
          <Text className="text-white text-lg flex-1 text-center">
            {fromCampusStudent ? `${fromCampusStudent.formattedTime}` : "No schedule"}
          </Text>
          <Text className="text-white text-lg flex-1 text-right">
            {fromCampusEmployee ? `${fromCampusEmployee.formattedTime}` : "No schedule"}
          </Text>
        </View>
      </View>

      <Link className="text-right text-white mt-4 text-md font-semibold" href="/home/schedules">
        <Text>View all {">"} </Text>
      </Link>
    </View>
  );
};

export default RouteSelector;
