import React, { useEffect } from "react";
import { View } from "react-native";
import useLocation from "@/hook/useLocation";
import RouteSelector from "@/components/RouteSelector";
import MapSection from "@/components/MapSection";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/store/storeConfig";
import { useBusLocation } from "@/hook/useBusLocation";

export default function Index() {
  const { user, route } = useAppSelector((state) => state.auth);
  const { location } = useLocation();
  const { activeBuses, currentlyConnectedUserCount } = useBusLocation();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 mx-4">
        <Navbar />
        {/* --- Select route and show Next bus schedule */}
        <RouteSelector />

        {/* --- Show live locations buses-- */}
        <MapSection
          location={location}
          userData={user}
          routeData={route}
          activeBuses={activeBuses}
          currentlyConnectedUserCount={currentlyConnectedUserCount}
        />
      </View>
    </View>
  );
}
