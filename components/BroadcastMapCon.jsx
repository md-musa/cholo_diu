import React, { useCallback, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as MapLibreGL from "@maplibre/maplibre-react-native";
import busMarker from "@/assets/images/navigatorArrow.png";
import UniIcon from "@/assets/images/uni-2.png";
import pinIcon from "@/assets/images/red-pin-marker.png";
import StatusOverlayComponent from "@/components/UI/StatusOverlayComponent";
import { useRouter } from "expo-router";
import Loading from "@/components/UI/Loading";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import { stopBroadcasting } from "@/store/features/broadcast/broadcastSlice";
import { useBusLocation } from "@/hook/useBusLocation";
import useLocation from "@/hook/useLocation";
import MapComponent from "./MapComponent";

function BroadcastMapCon() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { location } = useLocation();
  const { activeTrip } = useAppSelector((state) => state.broadcast);
  const { currentlyConnectedUserCount, activeBuses } = useBusLocation();
  const { user, route } = useAppSelector((state) => state.auth);
  const [zoom, setZoom] = useState(16);
  const cameraRef = useRef(null);
  const mapRef = useRef(null);
  const [currentCenter, setCurrentCenter] = useState([90.320463, 23.87739]);


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

  const handleStopSharing = () => {
    Alert.alert(
      "Stop Sharing Live Location?",
      "Campus community members will no longer see this bus's live position",
      [
        {
          text: "Stay",
          style: "cancel",
        },
        {
          text: "Stop",
          onPress: () => {
            dispatch(stopBroadcasting());
            // router.back();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const centerToUserLocation = () => {
    setZoom(16);
    cameraRef.current?.setCamera({
      center: [location.longitude, location.latitude],
      zoom: 16,
    });
  };

  if (!location || !route || !activeTrip) return <Loading />;

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" hidden={true} />
      <View className="flex-1">
        <MapComponent
          location={location}
          zoom={zoom}
          userData={user}
          routeData={route}
          activeBuses={activeBuses}
          setZoom={setZoom}
          cameraRef={cameraRef}
          mapRef={mapRef}
          currentCenter={currentCenter}
          setCurrentCenter={setCurrentCenter}
          handleRegionDidChange={handleRegionDidChange}
        />

        <StatusOverlayComponent />

        <TouchableOpacity
          className="absolute bottom-60 right-5 bg-white border border-gray-300 rounded-full shadow flex-row p-3 items-center justify-center"
          onPress={centerToUserLocation}
        >
          <Ionicons name="locate" size={28} color="black" />
        </TouchableOpacity>

        {/* <TouchableOpacity
          className="absolute top-10 left-5 bg-white border border-gray-300 rounded-full shadow flex-row p-2 items-center justify-center"
          onPress={handleStopSharing}
        >
          <Ionicons name="arrow-back" size={25} color="black" />
        </TouchableOpacity> */}
      </View>

      {/*-------Route Details---------*/}
      <View className="px-4 mb-4">
        {/* Info Card */}
        <View className="bg-white p-4 mt-4 rounded-2xl shadow-md flex-row items-center space-x-3">
          {/* Alert Icon */}
          <View className="flex-[0.15] items-center mr-2">
            <Image
              source={{ uri: "https://media.lordicon.com/icons/wired/outline/1657-alert.gif" }}
              style={{ width: 44, height: 44 }}
              resizeMode="contain"
            />
          </View>

          {/* Info Text */}
          <View className="flex-[0.65]">
            <Text className="text-sm text-gray-700">
              Sharing <Text className="font-bold capitalize">{activeTrip.bus.name}</Text>'s location for the
              <Text className="font-bold">{route?.endLocation}</Text> route
            </Text>
          </View>

          {/* Speed */}
          <View className="flex-[0.2] items-end">
            <View className="bg-gray-100 px-2 py-1 rounded-lg">
              <Text className="text-sm font-medium text-gray-800">{Math.ceil(location.speed * 3.6)} km/h</Text>
            </View>
          </View>
        </View>

        {/* Stop Sharing Button */}
        <TouchableOpacity
          className="bg-red-700 py-2 rounded-xl shadow-md mt-6 mb-5 active:opacity-80"
          onPress={handleStopSharing}
        >
          <Text className="text-white text-center font-semibold text-lg">Stop Sharing Bus Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  busShadow1: {
    circleRadius: 17,
    circleColor: "rgba(16, 187, 103, 0.4)",
    circleBlur: 0,
  },
  busShadow2: {
    circleRadius: 10,
    circleColor: "black",
    circleBlur: 0,
  },

  userShadow: {
    circleRadius: 20,
    circleColor: "rgba(0, 50, 255, 0.3)",
    circleBlur: 0,
  },
  userDot: {
    circleRadius: 5,
    circleColor: "blue",
    circleStrokeColor: "white",
    circleStrokeWidth: 2,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  calloutDescription: {
    fontSize: 12,
  },
  marker: {
    width: 40, // Ensure the marker has a valid size
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: {
    fontSize: 20,
  },

  busMarker: {
    iconImage: "marker",
    iconSize: 0.025,
    iconAnchor: "center",
    iconRotate: ["get", "heading"],
    textField: ["get", "title"],
    textSize: 11,
    textColor: "black",
    textAnchor: "bottom",
    textOffset: [0, 6],
    textHaloColor: "black",
    textHaloWidth: 0.1,
  },

  calloutContainer: {
    backgroundColor: "white",
    padding: 3,
    borderRadius: 6,
    borderColor: "gray",
    borderWidth: 1,
  },
  pointMarker: {
    iconImage: "customMarker",
    iconSize: 0.5,
    iconAllowOverlap: true,
  },
});

export default BroadcastMapCon;
