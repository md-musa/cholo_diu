import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "@/components/UI/Loading";
import { useGetBusesQuery } from "@/store/features/bus/busApi";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import { useCreateTripMutation } from "@/store/features/trip/tripApi";
import { TripUtil } from "@/utils/tripUtil";
import { startBroadcasting } from "@/store/features/broadcast/broadcastSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_ROLES } from "@/constants";

const Index = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, route } = useAppSelector((state) => state.auth);
  const { isBroadcasting } = useAppSelector((state) => state.broadcast);
  const [createTrip, { isLoading: isCreatingTrip }] = useCreateTripMutation();
  const { data: buses, isLoading: isBusesLoading, error: busesError } = useGetBusesQuery();

  const [busType, setBusType] = useState("");
  const [direction, setDirection] = useState("");
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (busesError) {
      Alert.alert("Error", "Failed to load buses. Please try again later.");
    }
  }, [busesError]);

  const filteredBuses = TripUtil.searchBus(buses || [], searchQuery);
  const isValid = selectedBus && busType && direction;

  const handleStartSharing = async () => {
    if (!isValid) {
      Alert.alert("Incomplete Information", "Please select a bus, bus type, and direction.");
      return;
    }

    Alert.alert("Confirm Sharing", `Start sharing location of ${selectedBus.name} (${busType}, ${direction})?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            const { data } = await createTrip({
              routeId: route._id,
              hostId: user._id,
              busName: selectedBus.name,
              busType: busType,
              note: note,
            });

            console.log("🌊 Trip created:", data);

            dispatch(
              startBroadcasting({
                bus: selectedBus,
                tripId: data._id,
                busType,
                note,
              })
            );
            await AsyncStorage.setItem("tripId", data._id);

            console.log("Broadcast data set:", {
              bus: selectedBus,
              busType,
              tripId: data._id,
              note,
            });

            router.push("/home/broadcast/liveLocationSharing");
          } catch (error) {
            console.error("[broadcast] Error creating trip:\n", JSON.stringify(error.response.data.message, null, 2));
            Alert.alert("Error", "Failed to start sharing. Please try again.");
          }
        },
      },
    ]);
  };

  if (isBusesLoading) return <Loading />;

  if (isBroadcasting) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 px-6">
        <Ionicons name="alert-circle" size={48} color="#00C89BE6" />
        <Text className="mt-4 text-lg font-semibold text-gray-900">Already Broadcasting</Text>
        <Text className="mt-2 text-gray-700 text-center">
          You are already sharing a bus location. Tap below to go to the live sharing screen.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-primary-700 px-6 py-3 rounded-lg flex-row items-center"
          onPress={() => router.push("/home/broadcast/liveLocationSharing")}
        >
          <Ionicons name="location" size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold text-lg">Go to Live Sharing</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="p-4" keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="mb-3 items-center">
          {/* <View className="flex-row items-center">
            <Ionicons name="location" size={24} color="#00C89BE6" className="mr-2" />
            <Text className="text-xl font-bold text-gray-900">Share Live Location</Text>
          </View> */}
          <Text className="text-md text-gray-800 text-center mt-2">
            Help the campus community track bus in real-time
          </Text>
          <Text className="text-sm text-center mt-2 bg-primary-200 text-black rounded-md px-2">
            Current Route: <Text className="text-gray-700">{route.endLocation}</Text>
          </Text>
        </View>

        {/* Bus Search */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-300">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900">Select Bus</Text>
            {/* <MaterialIcons name="directions-bus" size={20} color="#4B5563" /> */}
          </View>

          <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-200 px-3 mb-4">
            <Ionicons name="search" size={18} color="#6B7280" className="mr-2" />
            <TextInput
              className="flex-1 h-12 text-gray-900"
              placeholder="Search buses..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Bus List */}
          <ScrollView className="max-h-64" nestedScrollEnabled>
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => {
                const isSelected = selectedBus?._id === bus._id;
                return (
                  <TouchableOpacity
                    key={bus._id}
                    className={`border-b border-gray-300 py-2 px-3 my-1 rounded-lg ${
                      isSelected ? "bg-primary-50 border border-primary-500" : "bg-white"
                    }`}
                    onPress={() => setSelectedBus(bus)}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="bus" size={18} color={isSelected ? "#00C89BE6" : "#4B5563"} />
                      <Text className="flex-1 text-md text-gray-900 ml-3 capitalize">{bus.name}</Text>
                      {isSelected && <Ionicons name="checkmark-circle" size={20} color="#00C89BE6" />}
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View className="py-4 items-center">
                <MaterialIcons name="search-off" size={32} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">No buses found</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Bus Type Select */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-300">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900">Bus Type</Text>
            {/* <FontAwesome name="users" size={18} color="#4B5563" /> */}
          </View>
          <View className="flex-row justify-between space-x-3">
            <TouchableOpacity
              key={USER_ROLES.STUDENT}
              className={`flex-1 mx-1 p-2 rounded-xl items-center border ${
                busType === USER_ROLES.STUDENT ? "bg-primary-50 border-primary-500" : "bg-gray-50 border-gray-200"
              }`}
              onPress={() => setBusType(USER_ROLES.STUDENT)}
            >
              <View className="flex-row items-center justify-center">
                <FontAwesome5
                  name="user-graduate"
                  size={15}
                  color={busType === USER_ROLES.STUDENT ? "#00C89BE6" : "#4B5563"}
                />
                <Text
                  className={`mx-1 capitalize text-sm font-medium ${
                    busType === USER_ROLES.STUDENT ? "text-primary-700" : "text-gray-700"
                  }`}
                >
                  {USER_ROLES.STUDENT}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              key={USER_ROLES.EMPLOYEE}
              className={`flex-1 mx-1 p-2 rounded-xl items-center border ${
                busType === USER_ROLES.EMPLOYEE ? "bg-primary-50 border-primary-500" : "bg-gray-50 border-gray-200"
              }`}
              onPress={() => setBusType(USER_ROLES.EMPLOYEE)}
            >
              <View className="flex-row items-center justify-start">
                <MaterialCommunityIcons
                  name="account-tie"
                  size={20}
                  color={busType === USER_ROLES.EMPLOYEE ? "#00C89BE6" : "#4B5563"}
                />
                <Text
                  className={`mx-1 capitalize text-sm font-medium ${
                    busType === USER_ROLES.EMPLOYEE ? "text-primary-700" : "text-gray-700"
                  }`}
                >
                  {USER_ROLES.EMPLOYEE}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Direction Select */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-300">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900">Bus Direction</Text>
          </View>
          <View className="flex-row justify-between space-x-3">
            {[
              { direction: "To Campus", icon: "arrow-up" },
              { direction: "From Campus", icon: "arrow-down" },
            ].map(({ direction: dir, icon }) => (
              <TouchableOpacity
                key={dir}
                className={`flex-1 p-2 mx-1 rounded-xl items-center border ${
                  direction === dir ? "bg-primary-50 border-primary-500" : "bg-gray-50 border-gray-200"
                }`}
                onPress={() => setDirection(dir)}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name={icon} size={20} color={direction === dir ? "#00C89BE6" : "#4B5563"} />
                  <Text
                    className={`mx-1 text-sm font-medium ${direction === dir ? "text-primary-700" : "text-gray-700"}`}
                  >
                    {dir}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900">Additional Notes</Text>
            <Ionicons name="document-text" size={18} color="#4B5563" />
          </View>
          <TextInput
            className="h-20 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900"
            placeholder="Any special instructions or notes..."
            placeholderTextColor="#9CA3AF"
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View> */}
        {/* Start Button Fixed at Bottom */}
        <TouchableOpacity
          className={`flex-row rounded-xl p-2 items-center justify-center shadow-sm ${
            isValid ? "bg-primary-700" : "bg-gray-400"
          }`}
          onPress={handleStartSharing}
          disabled={!isValid || isCreatingTrip}
        >
          {isCreatingTrip ? (
            <Loading size="small" color="white" />
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
