import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

const useLocation = (isDriver = true) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let locationSubscription;

    const startLocationTracking = async () => {
      try {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        // console.log("Foreground permission status:", foregroundStatus);

        if (foregroundStatus !== "granted") {
          setErrorMsg("Location permission denied");
          return;
        }

        let options = {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,
          distanceInterval: 1,
        };

        // if (isDriver) {
        //   const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        //   // console.log("Background permission status:", backgroundStatus);

        //   if (backgroundStatus !== "granted") {
        //     Alert.alert(
        //       "Background Location Required",
        //       "To track shuttles when the app is closed, please enable background location in settings",
        //       [{ text: "OK", onPress: () => Location.openSettings() }]
        //     );
        //     // Still proceed with foreground-only tracking
        //   } else {
        //     options.showsBackgroundLocationIndicator = true;
        //     options.foregroundService = {
        //       notificationTitle: "Campus Shuttle Tracking",
        //       notificationBody: "Sharing live location with campus community",
        //     };
        //   }
        // }

        locationSubscription = await Location.watchPositionAsync(options, (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            speed: newLocation.coords.speed,
            heading: newLocation.coords.heading,
            timestamp: newLocation.timestamp,
          });
        });
      } catch (error) {
        setErrorMsg(error.message);
      }
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, [isDriver]);

  return { location, errorMsg };
};

export default useLocation;
