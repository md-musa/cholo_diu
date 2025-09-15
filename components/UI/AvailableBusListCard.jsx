import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { calculateDistanceAndTime } from "@/utils/distanceUtil";
import { getWaylineCoords } from "@/assets/routes";
import { useAppSelector } from "@/store/storeConfig";

export default function AvailableBusListCard({ item, highlightBus }) {
  const [distanceData, setDistanceData] = useState(null);
  const prevDistanceData = useRef(null); // cache previous distance
  const { routeNo } = useAppSelector((state) => state.auth.route);

  useEffect(() => {
    let isActive = true;

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

        const speedInKmh = item.avgSpeed ? item.avgSpeed * 3.6 : 20;

        const result = calculateDistanceAndTime(userCoords, busCoords, routeWaylineCoords, speedInKmh);

        if (isActive && result) {
          prevDistanceData.current = distanceData || result; // store old value
          setDistanceData(result);
        }
      } catch (error) {
        console.error("Location error:", error);
        Alert.alert("Location Error", "Failed to get location.");
      }
    };

    if (item) fetchDistance();

    return () => {
      isActive = false;
    };
  }, [item, routeNo]);

  if (!item) return <Text className="text-center text-gray-500">Not available</Text>;

  const { busName, userType, longitude, latitude } = item;

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
          <Text className="text-lg font-bold text-gray-800 capitalize">{busName}</Text>
          <View className="bg-secondary-100 border border-secondary-200 rounded-full px-3 py-0.5">
            <Text className="text-xs text-black text-center capitalize">{userType} Bus</Text>
          </View>
        </View>

        {/* Distance & ETA */}
        <View className="flex-row items-center justify-between mt-1">
          <Text className="ml-1 text-lg">
            {distanceData || prevDistanceData.current
              ? formatDistanceAndTime(
                  (distanceData || prevDistanceData.current).distanceKm,
                  (distanceData || prevDistanceData.current).estimatedTimeMin
                )
              : "Calculating..."}
          </Text>

          <TouchableOpacity
            onPress={() => highlightBus([longitude, latitude])}
            className="bg-secondary-600 px-6 py-2 rounded-full self-end"
          >
            <MaterialIcons name="location-on" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function formatDistanceAndTime(distanceKm, estimatedTimeMin) {
  const distance = distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} Km`;

  let time;
  if (estimatedTimeMin < 1) {
    time = `${Math.round(estimatedTimeMin * 60)} sec`;
  } else if (estimatedTimeMin >= 60) {
    const hours = Math.floor(estimatedTimeMin / 60);
    const minutes = Math.round(estimatedTimeMin % 60);
    time = minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`;
  } else {
    time = `${Math.round(estimatedTimeMin)} min`;
  }

  return `${distance} (${time})`;
}
