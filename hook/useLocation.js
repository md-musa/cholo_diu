// import { useState, useEffect } from "react";
// import * as Location from "expo-location";

// const useLocation = () => {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     let locationSubscription;

//     const startLocationTracking = async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       // const { status } = await Location.requestBackgroundPermissionsAsync();

//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied");
//         return;
//       }

//       // Start watching location updates
//       locationSubscription = await Location.watchPositionAsync(
//         { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 10000, distanceInterval: 10 },
//         (newLocation) => {
//           setLocation({
//             latitude: newLocation.coords.latitude,
//             longitude: newLocation.coords.longitude,
//             speed: newLocation.coords.speed, // Speed in meters/second
//             //altitude: newLocation.coords.altitude, // Altitude in meters
//             heading: newLocation.coords.heading, // Direction in degrees
//           });
//         }
//       );
//     };

//     startLocationTracking();

//     return () => {
//       if (locationSubscription) locationSubscription.remove(); // Stop tracking when component unmounts
//     };
//   }, []);

//   return { location, errorMsg };
// };

// export default useLocation;

// import { useState, useEffect } from "react";
// import * as Location from "expo-location";
// import { Alert } from "react-native";

// const useLocation = (isDriver = false) => {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);
//   const [backgroundPermission, setBackgroundPermission] = useState(false);

//   useEffect(() => {
//     let locationSubscription;

//     const startLocationTracking = async () => {
//       try {
//         // 1. Request foreground permissions first
//         const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

//         if (foregroundStatus !== "granted") {
//           setErrorMsg("Location permission denied");
//           return;
//         }

//         // 2. For drivers, request background permissions
//         if (isDriver) {
//           const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
//           console.log("Background permission status:", backgroundStatus);
//           if (backgroundStatus !== "granted") {
//             Alert.alert(
//               "Background Location Required",
//               "To track shuttles when the app is closed, please enable background location in settings",
//               [{ text: "OK", onPress: () => Location.openSettings() }]
//             );
//             return;
//           }
//           setBackgroundPermission(true);
//         }

//         // 3. Start location tracking
//         const options = {
//           accuracy: Location.Accuracy.BestForNavigation,
//           timeInterval: 10000,
//           distanceInterval: 10,
//           ...(isDriver &&
//             backgroundPermission && {
//               showsBackgroundLocationIndicator: true,
//               foregroundService: {
//                 notificationTitle: "Campus Shuttle Tracking",
//                 notificationBody: "Sharing live location with campus community",
//               },
//             }),
//         };

//         locationSubscription = await Location.watchPositionAsync(options, (newLocation) => {
//           setLocation({
//             latitude: newLocation.coords.latitude,
//             longitude: newLocation.coords.longitude,
//             speed: newLocation.coords.speed,
//             heading: newLocation.coords.heading,
//             timestamp: newLocation.timestamp,
//           });
//           // Send to your backend here
//         });
//       } catch (error) {
//         setErrorMsg(error.message);
//       }
//     };

//     startLocationTracking();

//     return () => {
//       if (locationSubscription) locationSubscription.remove();
//     };
//   }, [isDriver]);

//   return { location, errorMsg, backgroundPermission };
// };

// export default useLocation;

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
        console.log("Foreground permission status:", foregroundStatus);

        if (foregroundStatus !== "granted") {
          setErrorMsg("Location permission denied");
          return;
        }

        let options = {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
          distanceInterval: 5,
        };

        // if (isDriver) {
        //   const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        //   console.log("Background permission status:", backgroundStatus);

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
