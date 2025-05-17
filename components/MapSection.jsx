import React, { useCallback, useRef, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MapComponent from "@/components/MapComponent";
import StatusOverlayComponent from "@/components/UI/StatusOverlayComponent";

const MapSection = ({ location, userData, activeBuses, currentlyConnectedUserCount }) => {
  const router = useRouter();
  const cameraRef = useRef(null);
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(14);
  const [currentCenter, setCurrentCenter] = useState([90.320463, 23.87739]);

  const centerToUserLocation = () => {
    cameraRef.current?.setCamera({
      centerCoordinate: [location.longitude, location.latitude],
      zoomLevel: 14,
    });
    setZoom(14);
    setCurrentCenter([location.longitude, location.latitude]);
  };

  // Handle map region changes
  const handleRegionDidChange = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      const center = await mapRef.current.getCenter();
      const currentZoom = await mapRef.current.getZoom();
      // console.log("Center:", center);
      // console.log("Zoom:", currentZoom);

      setCurrentCenter(center);
      setZoom(currentZoom);
    } catch (error) {
      console.warn("Map region change error:", error);
    }
  }, []);
  // console.log("Zoom-> ", zoom);
  // console.log("Current Center-> ", currentCenter);

  // console.log("-->", cameraRef);
  // console.log(mapRef);

  return (
    <View className="flex-1 relative mt-4 rounded-xl overflow-hidden border border-gray-300">
      <MapComponent
        location={location}
        zoom={zoom}
        userData={userData}
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
        className="absolute bottom-20 right-3 bg-white  border border-gray-300 rounded-full shadow flex-row p-3 items-center justify-center"
        onPress={centerToUserLocation}
      >
        {/* <Text className="text-black text-base mx-2"></Text> */}
        <Ionicons name="locate" size={25} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        className="absolute bottom-6 right-3 bg-white border border-gray-300 rounded-full shadow-lg flex-row p-2 items-center justify-center"
        onPress={() => router.push("/home/watchBusLocation")}
      >
        <Text className="text-black text-base mx-2">Full Screen</Text>
        <Ionicons name="expand" size={22} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default MapSection;
