import React, { useEffect } from "react";
import { View } from "react-native";
import useLocation from "@/hook/useLocation";
import RouteSelector from "@/components/RouteSelector";
import MapSection from "@/components/MapSection";
import Navbar from "@/components/Navbar";
import { useBusLocation } from "@/contexts/BusLocationContext";
import { useAppSelector } from "@/store/storeConfig";

export default function Index() {
  const { user, route } = useAppSelector((state) => state.auth);
  const { location } = useLocation();
  const { activeBuses, currentlyConnectedUserCount, joinRoute } = useBusLocation();

  useEffect(() => {
    if (route) {
      joinRoute(route._id);
    }
  }, [route]);

  console.log("👤 UserData", JSON.stringify(user, null, 2));
  console.log("👤 route", JSON.stringify(route, null, 2));
  // return <Loading />;

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
