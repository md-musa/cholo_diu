import React, { useRef, useState, useEffect } from "react";
import { View, Text, StatusBar, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import useLocation from "@/hook/useLocation";
import MapComponent from "@/components/MapComponent";
import StatusOverlayComponent from "@/components/UI/StatusOverlayComponent";
import BottomSheetComponent from "@/components/UI/BottomSheetComponent";
import socket from "@/config/socket";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const WatchBusLocation = () => {
  const router = useRouter();
  const bottomSheetRef = useRef(null);
  const { userData } = useAuth();
  const { location } = useLocation();

  const [activeBuses, setActiveBuses] = useState({});
  const [currentlyConnectedUserCount, setCurrentlyConnectedUserCount] = useState(0);
  const [recenterMap, setRecenterMap] = useState(true);
  const [zoom, setZoom] = useState(12);

  const mapRef = useRef(null);

  const centerToUserLocation = () => {
    setRecenterMap(true);
    setZoom(13);
    setTimeout(() => {
      setRecenterMap(false);
    }, 1000);
  };

  useEffect(() => {
    socket.on("bus-location-update", (data) => {
      console.log("🚌", JSON.stringify(data, null, 2));
      if (!data) return console.log("⚠ error", data);

      setRecenterMap(false);
      setActiveBuses((prevBuses) => ({ ...prevBuses, [data.trip.busName]: data }));
      setCurrentlyConnectedUserCount(data.currUserCnt || 0);
    });

    if (userData) {
      const routeId = userData?.route?._id;
      if (routeId) {
        socket.emit("join-route", routeId);
        console.log(`Joined route: ${routeId}`);
      } else {
        Alert.alert("Route ID is null");
      }
    }

    return () => {
      socket.off("bus-location-update");
    };
  }, [userData]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
      <View className="relative flex-1">
        <MapComponent
          location={location}
          zoom={zoom}
          recenterMap={recenterMap}
          userData={userData}
          activeBuses={activeBuses}
          setZoom={setZoom}
        />
        <StatusOverlayComponent currentlyConnectedUserCount={currentlyConnectedUserCount} activeBuses={activeBuses} />

        <TouchableOpacity
          className="absolute bottom-60 right-5 bg-white border border-gray-300 rounded-full shadow flex-row p-3 items-center justify-center"
          onPress={centerToUserLocation}
        >
          <Ionicons name="locate" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          className="absolute top-10 left-5 bg-white border border-gray-300 rounded-full shadow flex-row p-2 items-center justify-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={25} color="black" />
        </TouchableOpacity>
      </View>

      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        activeBuses={activeBuses}
        closeBottomSheet={() => bottomSheetRef.current?.close()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
});

export default WatchBusLocation;
