import { useState, useEffect } from "react";
import * as Location from "expo-location";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let locationSubscription;

    const startLocationTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Start watching location updates
      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 10000, distanceInterval: 10 },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            speed: newLocation.coords.speed, // Speed in meters/second
            //altitude: newLocation.coords.altitude, // Altitude in meters
            heading: newLocation.coords.heading, // Direction in degrees
          });
        }
      );
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) locationSubscription.remove(); // Stop tracking when component unmounts
    };
  }, []);

  return { location, errorMsg };
};

export default useLocation;
