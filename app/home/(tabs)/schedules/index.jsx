import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { processSchedules } from "@/utils/scheduleHelper";
import ScheduleCard from "@/components/ScheduleCard";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Loading from "@/components/UI/Loading";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import { useGetRoutesQuery } from "@/store/features/route/routeApi";
import { useGetScheduleByRouteQuery } from "@/store/features/schedule/scheduleApi";
import { updateRoute } from "@/store/features/auth/authSlice";

const BusSchedule = () => {
  const scheduleTypes = ["Regular", "Mid-Term", "Final", "Ramadan"];
  const scheduleDays = ["Weekdays", "Friday"];

  const dispatch = useAppDispatch();
  const { user, route } = useAppSelector((state) => state.auth);
  const [selectedType, setSelectedType] = useState("Regular");
  const [selectedFilter, setSelectedFilter] = useState(user?.role == "student" ? "Student" : "Employee");
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase() === "friday" ? "Friday" : "Weekdays"
  );

  const { data: routes } = useGetRoutesQuery();
  const { data: schedules, isLoading } = useGetScheduleByRouteQuery({ routeId: route._id, day: selectedDay });

  const handleRouteChange = (selectedRouteId) => {
    const selectedRouteData = routes.find((r) => r._id === selectedRouteId);
    dispatch(updateRoute(selectedRouteData));
  };
  if (isLoading) return <Loading />;

  let toCampusStudent, fromCampusStudent, toCampusEmployee, fromCampusEmployee;
  if (schedules) {
    toCampusStudent = processSchedules(schedules?.to_campus.student);
    fromCampusStudent = processSchedules(schedules?.from_campus.student);
    toCampusEmployee = processSchedules(schedules?.to_campus.employee);
    fromCampusEmployee = processSchedules(schedules?.from_campus.employee);
  }

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
              selectedValue={route._id}
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
              {routes?.map((route) => (
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

          <View className="mt-4">
            {selectedFilter == "Student" ? (
              <>
                <View className="">
                  <View className="flex-row items-center justify-center bg-white px-4 py-1 rounded-2xl my-2  border-gray-300">
                    <Text className="text-gray-600 font-semibold text-md">{route?.endLocation}</Text>
                    <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                    <Text className="text-gray-600 font-semibold text-md">{route?.startLocation}</Text>
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
                    <Text className="text-gray-600 font-semibold text-md">{route?.startLocation}</Text>
                    <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                    <Text className="text-gray-600 font-semibold text-md">{route?.endLocation}</Text>
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
                    <Text className="text-gray-600 font-semibold text-md">{route?.endLocation}</Text>
                    <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                    <Text className="text-gray-600 font-semibold text-md">{route?.startLocation}</Text>
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
                    <Text className="text-gray-600 font-semibold text-md">{route?.startLocation}</Text>
                    <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                    <Text className="text-gray-600 font-semibold text-md">{route?.endLocation}</Text>
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
        </View>
      </View>
    </ScrollView>
  );
};
export default BusSchedule;
