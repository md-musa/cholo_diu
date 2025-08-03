import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { calculateDistanceAndTime } from "@/utils/distanceUtil";
import { getWaylineCoords } from "@/assets/routes";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/store/storeConfig";

function formatBangladeshTime(timestamp) {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp);
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const bdTime = new Date(utc + 6 * 60 * 60000);
  return bdTime.toLocaleTimeString("en-BD", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function AvailableBusListCard({ item, highlightBus }) {
  const [distanceData, setDistanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { routeNo } = useAppSelector((state) => state.auth.route);

  useEffect(() => {
    let isMounted = true;

    const fetchDistance = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Location Permission", "Permission to access location was denied.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          maximumAge: 1000,
          timeout: 10000,
        });

        const routeWaylineCoords = getWaylineCoords(routeNo);
        const userCoords = [location.coords.longitude, location.coords.latitude];
        const busCoords = [item.longitude, item.latitude];
        const speedInKmh = item.speed * 3.6;

        const result = calculateDistanceAndTime(userCoords, busCoords, routeWaylineCoords, speedInKmh);
        if (isMounted) setDistanceData(result);
      } catch (error) {
        console.error("Location error:", error);
        Alert.alert("Location Error", "Failed to get location.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (item) fetchDistance();

    return () => {
      isMounted = false;
    };
  }, [item]);

  if (!item) return <Text className="text-center text-gray-500">Not available</Text>;

  const { trip, latitude, longitude, speed, heading, timestamp } = item;

  return (
    <View className="flex-row justify-between items-center px-4 py-2 rounded-2xl mb-4 border border-gray-200 bg-white shadow-md">
      {/* Bus Icon */}
      <View className="bg-secondary-100 p-2 rounded-full mr-3">
        <MaterialCommunityIcons name="bus" size={28} color="#4f46e5" />
      </View>

      {/* Bus Info */}
      <View className="flex-1">
        {/* Bus Name */}
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-gray-800 capitalize">{trip.busName}</Text>
          <View className="bg-secondary-100 border border-secondary-200 rounded-full px-3 py-0.5">
            <Text className="text-xs text-black text-center capitalize">{trip.busType} Bus</Text>
          </View>
        </View>

        {/* Distance & ETA */}
        <View className="flex-row flex-wrap mt-1 items-center">
          {loading ? (
            <ActivityIndicator size="small" color="#6b7280" />
          ) : (
            <>
              <View className="flex-row items-center mt-1">
                {/* <MaterialIcons name="schedule" size={20} color="#6b7280" /> */}
                <Text className="ml-1 text-md">
                  {distanceData?.distanceKm} Km ({distanceData?.estimatedTimeMin} min)
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Track Button */}
      <TouchableOpacity
        onPress={() => highlightBus([longitude, latitude])}
        className="bg-secondary-600 px-6 py-2 rounded-full flex-row items-center ml-3"
      >
        <MaterialIcons name="location-on" size={18} color="white" />
        {/* <Text className="text-white text-sm font-semibold ml-1">Track</Text> */}
      </TouchableOpacity>
    </View>
  );
}
