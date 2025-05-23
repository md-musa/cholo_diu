import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import useLocation from "@/hook/useLocation";
import RouteSelector from "@/components/RouteSelector";
import MapSection from "@/components/MapSection";
import Navbar from "@/components/Navbar";
import { useBusLocation } from "@/contexts/BusLocationContext";
import { useRoute } from "@react-navigation/native";

export default function Index() {
  const { userData, routeData } = useAuth();
  const { location } = useLocation();
  const { activeBuses, currentlyConnectedUserCount, joinRoute } = useBusLocation();

  useEffect(() => {
    if (routeData) {
      joinRoute(routeData._id);
    }
  }, [routeData]);

  // console.log("👤 UserData", JSON.stringify(userData, null, 2));

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 mx-4">
        <Navbar />
        {/* --- Select route and show Next bus schedule */}
        <RouteSelector />

        {/* --- Show live locations buses-- */}
        <MapSection
          location={location}
          userData={userData}
          routeData={routeData}
          activeBuses={activeBuses}
          currentlyConnectedUserCount={currentlyConnectedUserCount}
        />
      </View>
    </View>
  );
}
