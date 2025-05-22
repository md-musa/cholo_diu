import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, Text, StatusBar, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import useLocation from "@/hook/useLocation";
import MapComponent from "@/components/MapComponent";
import StatusOverlayComponent from "@/components/UI/StatusOverlayComponent";
import BottomSheetComponent from "@/components/UI/BottomSheetComponent";
import socket from "@/config/socket";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useBusLocation } from "@/contexts/BusLocationContext";

const WatchBusLocation = () => {
  const router = useRouter();
  const bottomSheetRef = useRef(null);
  const { userData, routeData } = useAuth();
  const { location } = useLocation();
  const [zoom, setZoom] = useState(12);

  const cameraRef = useRef(null);
  const mapRef = useRef(null);
  const [currentCenter, setCurrentCenter] = useState([90.320463, 23.87739]);

  const { activeBuses, currentlyConnectedUserCount, joinRoute } = useBusLocation();

  const centerToUserLocation = () => {
    cameraRef.current?.setCamera({
      centerCoordinate: [location.longitude, location.latitude],
      zoomLevel: 14,
    });
    setZoom(14);
    setCurrentCenter([location.longitude, location.latitude]);
  };

  const highlightBus = (cord) => {
    cameraRef.current?.setCamera({
      centerCoordinate: [...cord],
      zoomLevel: 15,
    });
    setZoom(15);
    setCurrentCenter([...cord]);
  };

  // Handle map region changes
  const handleRegionDidChange = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      const center = await mapRef.current.getCenter();
      const currentZoom = await mapRef.current.getZoom();
      // // console.log("Center:", center);
      // // console.log("Zoom:", currentZoom);

      setCurrentCenter(center);
      setZoom(currentZoom);
    } catch (error) {
      console.warn("Map region change error:", error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
      <View className="relative flex-1">
        <MapComponent
          location={location}
          zoom={zoom}
          userData={userData}
          routeData={routeData}
          activeBuses={activeBuses}
          setZoom={setZoom}
          cameraRef={cameraRef}
          mapRef={mapRef}
          currentCenter={currentCenter}
          setCurrentCenter={setCurrentCenter}
          handleRegionDidChange={handleRegionDidChange}
        />
        <StatusOverlayComponent currentlyConnectedUserCount={currentlyConnectedUserCount} activeBuses={activeBuses} />

        <TouchableOpacity
          className="absolute bottom-80 right-5 bg-white border border-gray-300 rounded-full shadow flex-row p-3 items-center justify-center"
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
        highlightBus={highlightBus}
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
