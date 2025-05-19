import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import useLocation from "@/hook/useLocation";
import RouteSelector from "@/components/RouteSelector";
import MapSection from "@/components/MapSection";
import Navbar from "@/components/Navbar";
import { useBusLocation } from "@/contexts/BusLocationContext";

export default function Index() {
  const { userData } = useAuth();
  const { location } = useLocation();
  const { activeBuses, currentlyConnectedUserCount, joinRoute } = useBusLocation();

  useEffect(() => {
    if (userData?.route?._id) {
      joinRoute(userData.route._id);
    }
  }, [userData]);

  // // console.log("👤 UserData", userData.route._id);

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
          activeBuses={activeBuses}
          currentlyConnectedUserCount={currentlyConnectedUserCount}
        />
      </View>
    </View>
  );
}
