import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import useLocation from "@/hook/useLocation";
import RouteSelector from "@/components/RouteSelector";
import MapSection from "@/components/MapSection";
import socket from "@/config/socket";
import Navbar from "@/components/Navbar";

export default function Index() {
  const { userData } = useAuth();
  const { location } = useLocation();

  const [activeBuses, setActiveBuses] = useState({});
  const [currentlyConnectedUserCount, setCurrentlyConnectedUserCount] = useState(0);

  useEffect(() => {
    socket.on("bus-location-update", (data) => {
      console.log("🚌", JSON.stringify(data, null, 2));

      if (!data) return console.log("⚠ error", data);
      setActiveBuses((prevBuses) => ({ ...prevBuses, [data.trip.busName]: data }));
      setCurrentlyConnectedUserCount(data.currUserCnt || 0);
    });

    if (userData?.route?._id) {
      socket.emit("join-route", userData.route._id);
    }

    return () => {
      socket.off("bus-location-update");
    };
  }, [userData]);
  console.log("🚍", location);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 mx-4">
        <Navbar />
        {/* --- Select route and show Next bus schedule */}
        <RouteSelector onRouteChange={(route) => setActiveBuses({})} />

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
