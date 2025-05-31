import React, { useState } from "react";
import { View, Text, Image, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import busImage from "@/assets/images/icon.png";
import { findOngoingOrNextSchedule } from "@/utils/scheduleHelper";
import { Link } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import { updateRoute } from "@/store/features/auth/authSlice";
import { useGetRoutesQuery } from "@/store/features/route/routeApi";
import { useGetScheduleByRouteQuery } from "@/store/features/schedule/scheduleApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ASYNC_STORAGE_KEYS } from "@/constants";

const RouteSelector = () => {
  const dispatch = useAppDispatch();
  const { route } = useAppSelector((state) => state.auth);
  const { isBroadcasting } = useAppSelector((state) => state.broadcast);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase() === "friday" ? "Friday" : "Weekdays"
  );

  const { data: routes } = useGetRoutesQuery();
  const { data: schedules } = useGetScheduleByRouteQuery({ routeId: route._id, day: selectedDay });

  const handleRouteChange = async (selectedRouteId) => {
    const selectedRouteData = routes.find((r) => r._id === selectedRouteId);
    dispatch(updateRoute(selectedRouteData));
    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.CURRENT_ROUTE, JSON.stringify(selectedRouteData));
  };

  let toCampusStudent, fromCampusStudent, toCampusEmployee, fromCampusEmployee;
  if (schedules) {
    toCampusStudent = findOngoingOrNextSchedule(schedules.to_campus.student);
    fromCampusStudent = findOngoingOrNextSchedule(schedules.from_campus.student);
    toCampusEmployee = findOngoingOrNextSchedule(schedules.to_campus.employee);
    fromCampusEmployee = findOngoingOrNextSchedule(schedules.from_campus.employee);
  }

  return (
    <View className="bg-primary-1000 p-4 rounded-xl">
      <View className="flex flex-row items-center bg-white border border-gray-300 rounded-xl px-3">
        <Image source={busImage} className="rounded-md" resizeMode="contain" style={{ width: 30, height: 30 }} />
        <Picker
          selectedValue={route._id}
          onValueChange={handleRouteChange}
          enabled={!isBroadcasting}
          value
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
          {routes?.map((route) => (
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
          <Text className="text-white text-md flex-1">{`To ${route?.startLocation}`}</Text>
          <Text className="text-white text-lg flex-1 text-center">
            {toCampusStudent ? `${toCampusStudent.formattedTime}` : "No schedule"}
          </Text>
          <Text className="text-white text-lg flex-1 text-right">
            {toCampusEmployee ? `${toCampusEmployee.formattedTime}` : "No schedule"}
          </Text>
        </View>

        <View className="flex-row border-y border-white/50 py-2">
          <Text className="text-white text-md flex-1">{`From ${route?.startLocation}`}</Text>
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
