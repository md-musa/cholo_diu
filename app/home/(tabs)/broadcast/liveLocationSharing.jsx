import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useLocation from "@/hook/useLocation";
import { useAuth } from "@/contexts/AuthContext";
import { useBroadcast } from "@/contexts/BroadcastContext";
import socket from "@/config/socketIoConfig";
import * as MapLibreGL from "@maplibre/maplibre-react-native";
import { selectRoutePolyline } from "@/utils/mappingHelper";
import busMarker from "@/assets/images/navigatorArrow.png";
import UniIcon from "@/assets/images/uni-2.png";
import pinIcon from "@/assets/images/red-pin-marker.png";
import StatusOverlayComponent from "@/components/UI/StatusOverlayComponent";
import { useFocusEffect, useRouter } from "expo-router";
import { useBusLocation } from "@/contexts/BusLocationContext";
import Loading from "@/components/UI/Loading";

function cpfl(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function LiveLocationSharing() {
  const router = useRouter();
  const { location } = useLocation(true);
  const { routeData } = useAuth();
  const { broadcastData } = useBroadcast();
  const { currentlyConnectedUserCount, activeBuses } = useBusLocation();
  const [isSharing, setIsSharing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [zoom, setZoom] = useState(16);
  const cameraRef = useRef(null);

  // Check if data is loaded
  useEffect(() => {
    if (routeData && location && broadcastData) {
      setIsLoading(false); // Data is ready
    }
  }, [routeData, location, broadcastData]);

  console.log("👤", JSON.stringify(broadcastData, null, 2));
  console.log("📍", location);

  // Join the room when userData is available
  useEffect(() => {
    if (routeData?._id) {
      const roomId = routeData._id;
      socket.emit("join-room", roomId);
      console.log(`Joined room: ${roomId}`);

      return () => {
        socket.emit("leave-room", roomId); // Leave the room
        console.log(`Left room: ${roomId}`);
      };
    }
  }, [routeData?._id]);

  // Broadcast location updates whenever location changes
  useEffect(() => {
    if (isSharing && location && routeData?._id && broadcastData) {
      socket.emit("broadcast-bus-location", {
        tripId: broadcastData.tripId,
        ...location,
      });

      console.log("📡 Broadcasted location data:", {
        ...location,
        tripId: broadcastData.tripId,
      });
    }
  }, [location, isSharing, routeData?._id, broadcastData]);

  // Handle stopping location sharing
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
          text: "Leave",
          onPress: () => {
            if (routeData?._id) {
              socket.emit("stop-broadcast", routeData._id);
              setIsSharing(false);
              router.back();
            }
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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Stop Sharing Live Location?",
          "Campus community members will no longer see this bus's live position",
          [
            { text: "Stay", style: "cancel" },
            { text: "Leave", onPress: () => router.back() },
          ]
        );
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [router])
  );

  // Show loading state if data is not ready
  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" hidden={true} />

      <MapLibreGL.MapView
        attributionEnabled={true}
        style={styles.map}
        onRegionDidChange={(event) => setZoom(event.properties.zoom)}
      >
        {/*------ Recentering map -------- */}
        <MapLibreGL.Camera
          ref={cameraRef}
          zoomLevel={zoom}
          centerCoordinate={[location.longitude, location.latitude]}
        />

        {/* --------- Load tile --------- */}
        <MapLibreGL.RasterSource
          id="osm"
          tileUrlTemplates={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]}
          tileSize={256}
        >
          <MapLibreGL.RasterLayer id="osmLayer" sourceID="osm" />
        </MapLibreGL.RasterSource>

        {/* ----- Route highlighter ------ */}
        <MapLibreGL.ShapeSource id="routeSource" shape={selectRoutePolyline(routeData?.endLocation || "")}>
          <MapLibreGL.LineLayer
            id="routeLayer"
            style={{ lineColor: "#2e2e2e", lineWidth: 2, lineCap: "round", lineJoin: "round" }}
          />
        </MapLibreGL.ShapeSource>

        {/* ---- Image Load ------ */}
        <MapLibreGL.Images images={{ marker: busMarker, UniIcon: UniIcon, pinIcon: pinIcon }} />

        {/* --------- Show Bus Location ----------*/}
        {location && (
          <MapLibreGL.ShapeSource
            id="userLocation-1"
            shape={{
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [location.longitude, location.latitude],
                  },
                  properties: {
                    icon: "marker",
                    title: `${cpfl(broadcastData.bus.name)}\n${cpfl(broadcastData.busType)} bus\n${(
                      location.speed * 3.6
                    ).toFixed(2)} km/h`,
                    heading: location.heading,
                  },
                },
              ],
            }}
          >
            <MapLibreGL.CircleLayer id="userShadow3" style={styles.busShadow1} />
            <MapLibreGL.CircleLayer id="userShadow2" style={styles.busShadow2} />
            <MapLibreGL.Animated.SymbolLayer id="busMarkerLayer" style={styles.busMarker} />
          </MapLibreGL.ShapeSource>
        )}

        {/* ------ University and Trasnport Location Symbol */}
        {/* <MapLibreGL.MarkerView coordinate={[90.320463, 23.87739 + 0.002]}>
          <MapLibreGL.Callout>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutDescription} className="capitalize">
                DIU Campus
              </Text>
            </View>
          </MapLibreGL.Callout>
        </MapLibreGL.MarkerView> */}
        <MapLibreGL.ShapeSource
          id="userLocation-2"
          shape={{
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [90.320463, 23.87739],
                },
                properties: {
                  icon: "UniIcon", // matches the key in MapLibreGL.Images
                  title: "DIU Campus",
                },
              },
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [90.322004, 23.876107],
                },
                properties: {
                  icon: "pinIcon", // matches the key in MapLibreGL.Images
                  title: "DIU Transport",
                },
              },
            ],
          }}
        >
          <MapLibreGL.SymbolLayer
            id="customMarkerLayer"
            style={{
              iconImage: ["get", "icon"],
              iconSize: 0.06,
              iconAllowOverlap: true,
              textField: ["get", "title"], // shows "DIU"
              textSize: 15,
              textOffset: [0, -2.5], // adjust label position below the icon
              textAnchor: "top",
              textAllowOverlap: false,
              textColor: "#000", // label text color
            }}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>

      <StatusOverlayComponent currentlyConnectedUserCount={currentlyConnectedUserCount} activeBuses={activeBuses} />

      <TouchableOpacity
        className="absolute bottom-60 right-5 bg-white border border-gray-300 rounded-full shadow flex-row p-3 items-center justify-center"
        onPress={centerToUserLocation}
      >
        <Ionicons name="locate" size={28} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        className="absolute top-10 left-5 bg-white border border-gray-300 rounded-full shadow flex-row p-2 items-center justify-center"
        onPress={handleStopSharing}
      >
        <Ionicons name="arrow-back" size={25} color="black" />
      </TouchableOpacity>

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
              Sharing <Text className="font-bold capitalize">{broadcastData.bus.name}</Text>'s location for the{" "}
              <Text className="font-bold">{routeData?.endLocation}</Text> route
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

export default LiveLocationSharing;
