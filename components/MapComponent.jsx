import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as MapLibreGL from "@maplibre/maplibre-react-native";
import { generateMarkers } from "@/utils/mappingHelper";
import busMarker from "@/assets/images/navigatorArrow3.png";
import UniIcon from "@/assets/images/uni-2.png";
import pinIcon from "@/assets/images/red-pin-marker.png";
import { useAppSelector } from "@/store/storeConfig";
import { getWayline } from "@/assets/routes";

const MapComponent = ({
  location,
  mapRef,
  zoom,
  userData,
  routeData,
  activeBuses,
  cameraRef,
  currentCenter,
  handleRegionDidChange,
}) => {
  const { route } = useAppSelector((state) => state.auth);
  console.log("Route Data:", route.name);


  return (
    <MapLibreGL.MapView
      attributionEnabled={true}
      style={styles.map}
      ref={mapRef}
      onRegionDidChange={handleRegionDidChange}
    >
      {/*------ Recentering map -------- */}
      <MapLibreGL.Camera ref={cameraRef} zoomLevel={zoom} centerCoordinate={currentCenter} />

      {/* --------- Load tile --------- */}
      <MapLibreGL.RasterSource
        id="osm"
        tileUrlTemplates={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]}
        tileSize={256}
      >
        <MapLibreGL.RasterLayer id="osmLayer" sourceID="osm" />
      </MapLibreGL.RasterSource>

      {/* ----- Route highlighter ------ */}
      <MapLibreGL.ShapeSource id="routeSource" shape={getWayline(route.name)}>
        <MapLibreGL.LineLayer
          id="routeLayer"
          style={{ lineColor: "#2e2e2e", lineWidth: 2, lineCap: "round", lineJoin: "round" }}
        />
      </MapLibreGL.ShapeSource>

      {/* ---- Image Load ------ */}
      <MapLibreGL.Images images={{ marker: busMarker, UniIcon: UniIcon, pinIcon: pinIcon }} />

      {/* -----Show buses location-------*/}
      <MapLibreGL.Animated.ShapeSource
        id="busMarkers"
        shape={{ type: "FeatureCollection", features: generateMarkers(activeBuses) }}
      >
        <MapLibreGL.CircleLayer id="userShadow3" style={styles.busShadow1} />
        <MapLibreGL.CircleLayer id="userShadow2" style={styles.busShadow2} />
        <MapLibreGL.Animated.SymbolLayer id="busMarkerLayer" style={styles.busMarker} />
      </MapLibreGL.Animated.ShapeSource>

      {/* --------- Show user location ----------*/}
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
              },
            ],
          }}
        >
          <MapLibreGL.CircleLayer id="userShadow-1" style={styles.userShadow} />
          <MapLibreGL.CircleLayer id="userDot-1" style={styles.userDot} />
        </MapLibreGL.ShapeSource>
      )}

      {/* ------ University and Trasnport Location Symbol */}
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
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  busShadow1: {
    circleRadius: 17,
    circleColor: "rgba(229, 129, 52, 0.4)",
    circleBlur: 0,
  },
  busShadow2: {
    circleRadius: 10,
    circleColor: "black",
    circleBlur: 0,
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
  calloutContainer: {
    backgroundColor: "red",
    padding: 6,
    borderRadius: 6,
    borderColor: "#333",
    borderWidth: 1,
    zIndex: 999, // Add this
  },
  pointMarker: {
    iconImage: "customMarker",
    iconSize: 0.5,
    iconAllowOverlap: true,
  },
});

export default MapComponent;
