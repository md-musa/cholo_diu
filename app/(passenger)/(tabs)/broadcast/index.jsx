import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LoadingScreen from "@/components/UI/LoadingScreen";
import { useGetBusesQuery } from "@/store/features/bus/busApi";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import { useCreateTripByUserMutation } from "@/store/features/trip/tripApi";
import { TripUtil } from "@/utils/tripUtil";
import {
  startBackgroundService,
  startBroadcasting,
  startForegroundService,
} from "@/store/features/broadcast/broadcastSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_ROLES } from "@/constants";
import { colors } from "@/config/colors";
import LoadingIndicator from "@/components/UI/LoadingIndicator";
import { askForLocationPermission } from "@/utils/askForLocationPermission";
import { ToastUtil } from "@/utils/toastUtil";
import LiveMapLocation from "@/components/broadcast/LiveMapLocation";

// Reusable Selectable Button
const SelectableButton = ({ label, icon, selected, onPress }) => (
  <TouchableOpacity
    className={`flex-1 mx-1 p-2 rounded-xl items-center border ${
      selected ? "bg-secondary-50 border-secondary-500" : "bg-muted-50 border-muted-300"
    }`}
    onPress={onPress}
  >
    <View className="flex-row items-center justify-center">
      {icon}
      <Text className={`mx-1 text-sm font-medium capitalize ${selected ? "text-secondary-700" : "text-muted-700"}`}>
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

// Bus Search Component
const BusSearch = ({ buses, selectedBus, setSelectedBus, searchQuery, setSearchQuery }) => {
  const filteredBuses = useMemo(() => TripUtil.searchBus(buses || [], searchQuery), [buses, searchQuery]);

  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-muted-300">
      <Text className="text-lg font-semibold text-muted-900 mb-3">Select Bus</Text>
      <View className="flex-row items-center bg-muted-50 rounded-lg border border-muted-300 px-3 mb-4">
        <Ionicons name="search" size={18} color={colors.muted[500]} className="mr-2" />
        <TextInput
          className="flex-1 h-12 text-muted-900"
          placeholder="Search buses..."
          placeholderTextColor={colors.muted[400]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView className="max-h-64" nestedScrollEnabled>
        {filteredBuses.length ? (
          filteredBuses.map((bus) => (
            <TouchableOpacity
              key={bus._id}
              className={`border-b border-muted-300 py-2 px-3 my-1 rounded-lg ${
                selectedBus?._id === bus._id ? "bg-secondary-50 border-secondary-500" : "bg-white"
              }`}
              onPress={() => setSelectedBus(bus)}
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="bus"
                  size={18}
                  color={selectedBus?._id === bus._id ? colors.secondary[500] : colors.muted[500]}
                />

                <Text className="flex-1 text-md text-muted-900 ml-3 capitalize">{bus.name}</Text>
                {selectedBus?._id === bus._id && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.secondary[500]} />
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="py-4 items-center">
            <MaterialIcons name="search-off" size={32} color={colors.muted[500]} />
            <Text className="text-muted-500 mt-2">No buses found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const Index = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, route } = useAppSelector((state) => state.auth);
  const { isBroadcasting, isForegroundServiceRunning, isBackgroundServiceRunning } = useAppSelector(
    (state) => state.broadcast
  );

  console.log({isForegroundServiceRunning, isBackgroundServiceRunning});

  const { data: buses, isLoading: isBusesLoading, error: busesError } = useGetBusesQuery();
  const [createTripByUser, { isLoading: isCreatingTrip }] = useCreateTripByUserMutation();

  const [tripData, setTripData] = useState({
    busType: "",
    direction: "",
    selectedBus: null,
    note: "",
  });

  useEffect(() => {
    if (busesError) ToastUtil.error("Failed to load buses. Please try again later.");
  }, [busesError]);

  const isValid = tripData.selectedBus && tripData.busType && tripData.direction;

  const handleStartSharing = async () => {
    if (!isValid) return ToastUtil.error("Please select a bus, bus type, and direction.");

    const permissionType = await askForLocationPermission();
    console.log("Location permission granted:", permissionType);

    if (permissionType === "foreground") dispatch(startForegroundService());
    else if (permissionType === "background") dispatch(startBackgroundService());
    else return ToastUtil.error("Location permission is required to start sharing.");

    console.log("Creating trip with data:", {
      routeId: route._id,
      hostId: user._id,
      busName: tripData.selectedBus.name,
      busType: tripData.busType,
      direction: tripData.direction,
      note: tripData.note,
    });

    try {
      const { data } = await createTripByUser({
        routeId: route._id,
        hostId: user._id,
        busName: tripData.selectedBus.name,
        busType: tripData.busType,
        direction: tripData.direction,
        note: tripData.note,
      });
      console.log("Trip created:", data);

      dispatch(
        startBroadcasting({
          bus: tripData.selectedBus,
          tripId: data._id,
          busType: tripData.busType,
          note: tripData.note,
        })
      );

      await AsyncStorage.setItem("tripId", data._id);
    } catch (error) {
      ToastUtil.error("Failed to start sharing. Please try again.");
    }
  };

  console.log("Broadcasting status:", isBroadcasting, isForegroundServiceRunning, isBackgroundServiceRunning);
  if (isBusesLoading) return <LoadingScreen />;
  if (isBroadcasting) return <LiveMapLocation />;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-muted-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="p-4" keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="mb-3 items-center">
          <Text className="text-md text-muted-800 text-center mt-2">
            Help the campus community track bus in real-time
          </Text>
          <Text className="text-sm text-center mt-2 bg-secondary-200 text-black rounded-md px-2">
            Current Route: <Text className="text-muted-700">{route.routeName}</Text>
          </Text>
        </View>

        <BusSearch
          buses={buses}
          selectedBus={tripData.selectedBus}
          setSelectedBus={(bus) => setTripData((prev) => ({ ...prev, selectedBus: bus }))}
          searchQuery={tripData.note}
          setSearchQuery={(text) => setTripData((prev) => ({ ...prev, note: text }))}
        />

        {/* Bus Type */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-muted-300">
          <Text className="text-lg font-semibold text-muted-900 mb-3">Bus Type</Text>
          <View className="flex-row justify-between space-x-3">
            <SelectableButton
              label={USER_ROLES.STUDENT}
              icon={
                <FontAwesome5
                  name="user-graduate"
                  size={15}
                  color={tripData.busType === USER_ROLES.STUDENT ? colors.secondary[500] : colors.muted[500]}
                />
              }
              selected={tripData.busType === USER_ROLES.STUDENT}
              onPress={() => setTripData((prev) => ({ ...prev, busType: USER_ROLES.STUDENT }))}
            />
            <SelectableButton
              label={USER_ROLES.EMPLOYEE}
              icon={
                <MaterialCommunityIcons
                  name="account-tie"
                  size={20}
                  color={tripData.busType === USER_ROLES.EMPLOYEE ? colors.secondary[500] : colors.muted[500]}
                />
              }
              selected={tripData.busType === USER_ROLES.EMPLOYEE}
              onPress={() => setTripData((prev) => ({ ...prev, busType: USER_ROLES.EMPLOYEE }))}
            />
          </View>
        </View>

        {/* Direction */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-muted-300">
          <Text className="text-lg font-semibold text-muted-900 mb-3">Bus Direction</Text>
          <View className="flex-row justify-between space-x-3">
            {[
              { dir: "to_campus", icon: "arrow-up", label: "To Campus" },
              { dir: "from_campus", icon: "arrow-down", label: "From Campus" },
            ].map(({ dir, icon, label }) => (
              <SelectableButton
                key={dir}
                label={label}
                icon={
                  <Ionicons
                    name={icon}
                    size={20}
                    color={tripData.direction === dir ? colors.secondary[500] : colors.muted[500]}
                  />
                }
                selected={tripData.direction === dir}
                onPress={() => setTripData((prev) => ({ ...prev, direction: dir }))}
              />
            ))}
          </View>
        </View>

        {/* Start Sharing */}
        <TouchableOpacity
          className={`flex-row rounded-xl mt-4 p-2 items-center justify-center shadow-sm ${
            isValid ? "bg-secondary-600" : "bg-muted-400"
          }`}
          onPress={handleStartSharing}
          disabled={!isValid || isCreatingTrip}
        >
          {isCreatingTrip ? (
            <LoadingIndicator color="white" />
          ) : (
            <>
              <Ionicons name="location" size={22} color="white" />
              <Text className="text-white mx-2 text-lg font-bold">Start Sharing</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Index;
