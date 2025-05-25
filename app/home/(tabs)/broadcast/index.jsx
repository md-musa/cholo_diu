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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Loading from "@/components/UI/Loading";
import { useGetBusesQuery } from "@/store/features/bus/busApi";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import { useCreateTripMutation } from "@/store/features/trip/tripApi";
import { TripUtil } from "@/utils/tripUtil";
import { startBroadcasting } from "@/store/features/broadcast/broadcastSlice";

const Index = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, route } = useAppSelector((state) => state.auth);
  const [createTrip] = useCreateTripMutation();

  const [busType, setBusType] = useState("");
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [note, setNote] = useState("");

  const { data: buses, isLoading: isBusesLoading } = useGetBusesQuery();
  if (isBusesLoading) return <Loading />;

  const filteredBuses = TripUtil.searchBus(buses, searchQuery);
  const isValid = selectedBus && busType;

  const handleStartSharing = async () => {
    if (!isValid) {
      Alert.alert("Incomplete Information", "Please select a bus and bus type.");
      return;
    }

    Alert.alert("Confirm Sharing", `Start sharing location of ${selectedBus.name}`, [
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

            console.log("Broadcast data set:", {
              bus: selectedBus,
              busType,
              tripId: data._id,
              note,
            });

            router.push("/home/(tabs)/broadcast/liveLocationSharing");
          } catch (error) {
            console.error("[broadcast] Error creating trip:\n", JSON.stringify(error.response.data.message, null, 2));
            Alert.alert("Error", "Failed to start sharing. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="p-3">
        {/* Header */}
        <View className="mb-3 items-center">
          <Text className="text-xl font-semibold text-gray-900 mb-1">Share Live Bus Location</Text>{" "}
          <Text className="text-sm text-gray-600 text-center">
            Share live bus location to help campus community track shuttles in real-time
          </Text>{" "}
        </View>

        {/* Bus Search */}
        <View className="bg-white rounded-lg p-4 mb-2 shadow-md border border-gray-200">
          <Text className="text-base font-semibold text-gray-900 mb-3">Search bus by name</Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg border border-gray-300 px-3 mb-3">
            <Ionicons name="search" size={20} color="#828282" className="mr-2" />
            <TextInput
              className="flex-1 h-10 text-gray-900"
              placeholder="Search buses..."
              placeholderTextColor="#828282"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Bus List */}
          {isBusesLoading ? (
            <Loading />
          ) : (
            <ScrollView className="max-h-72" nestedScrollEnabled>
              {filteredBuses.length > 0 ? (
                filteredBuses.map((bus) => {
                  const isSelected = selectedBus?._id === bus._id;
                  return (
                    <TouchableOpacity
                      key={bus._id}
                      className={`py-2 px-2 mt-1 border-b border-gray-300 ${
                        isSelected ? "bg-primary-100 border border-primary-600 rounded-md" : ""
                      }`}
                      onPress={() => setSelectedBus(bus)}
                    >
                      <View className="flex-row items-center mb-1">
                        <Ionicons name="bus" size={20} color={isSelected ? "#00C89BE6" : "#111827"} />
                        <Text className="flex-1 text-base text-gray-900 ml-3 capitalize">{bus.name}</Text>

                        {isSelected && <Ionicons name="checkmark-circle" size={20} color="#00C89BE6" />}
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text className="text-center p-4 text-gray-600">No buses found</Text>
              )}
            </ScrollView>
          )}
        </View>

        {/* Bus Type Select */}
        <View className="bg-white rounded-lg p-4 mb-2 shadow-md border border-gray-200">
          <Text className="text-base font-semibold text-gray-900 mb-3">Bus Type</Text>
          <View className="flex-row justify-between">
            {["student", "employee"].map((type) => (
              <TouchableOpacity
                key={type}
                className={`flex-1 p-3 mx-1 rounded-lg items-center border border-gray-200 ${
                  busType === type ? "bg-primary-100 border-primary-700 border" : "bg-gray-100"
                }`}
                onPress={() => setBusType(type)}
              >
                <Text className={`text-md font-medium ${busType === type ? "#00C89BE6" : "text-gray-900"}`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Note */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md border border-gray-200">
          <Text className="text-base font-semibold text-gray-900 mb-3">Additional Note (Optional)</Text>
          <TextInput
            className="min-h-14 border border-gray-300 rounded-lg p-3 text-gray-900"
            placeholder="Any special instructions?"
            placeholderTextColor="#828282"
            multiline
            numberOfLines={2}
            value={note}
            onChangeText={setNote}
          />
        </View>
      </ScrollView>

      {/* Start Button Fixed at Bottom */}
      <View className="absolute bottom-8 left-5 right-5">
        <TouchableOpacity
          className={`flex-row rounded-lg p-3 items-center justify-center ${
            isValid ? "bg-tertiary-900" : "bg-gray-500"
          }`}
          onPress={handleStartSharing}
          disabled={!isValid}
        >
          <Ionicons name="location" size={18} color="white" />
          <Text className="text-white mx-2 text-lg font-bold">Start Sharing</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Index;
