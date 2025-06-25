import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import { stopBroadcasting } from "@/store/features/broadcast/broadcastSlice";
import { BroadcastBusLocationInBackground } from "@/backgroundTasks/broadcastBusLocation";
import * as Location from "expo-location";
import { Alert, Linking } from "react-native";

export function useBusLocationBroadcast() {
  const dispatch = useAppDispatch();
  const { isBroadcasting, activeTrip } = useAppSelector((state) => state.broadcast);

  useEffect(() => {
    const startBackground = async () => {
      if (isBroadcasting && activeTrip) {
        await BroadcastBusLocationInBackground.start({
          tripId: activeTrip.tripId,
        });
      }
    };

    startBackground();

    return () => {
      stopAllTracking();
    };
  }, [isBroadcasting, activeTrip?.tripId]);

  const stopAllTracking = async () => {
    await BroadcastBusLocationInBackground.stop();
  };

  const stopBusLocationBroadcasting = async () => {
    await stopAllTracking();
    dispatch(stopBroadcasting());
  };

  return {
    stopBusLocationBroadcasting,
    isBackgroundActive: BroadcastBusLocationInBackground.isRunning(),
  };
}

// import { useEffect, useRef, useState } from "react";
// import * as Location from "expo-location";
// import { AppState, AppStateStatus } from "react-native";
// import socket from "@/config/socketIoConfig";
// import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
// import { stopBroadcasting } from "@/store/features/broadcast/broadcastSlice";
// import type { ILocationData } from "./useLocation";
// import { SOCKET_EVENTS } from "@/constants";

// const LOCATION_TASK_NAME = "background-location-task";

// export function useBusLocationBroadcast() {
//   const dispatch = useAppDispatch();
//   const appState = useRef(AppState.currentState);
//   const watcher = useRef<Location.LocationSubscription | null>(null);
//   const [location, setLocation] = useState<ILocationData | null>(null);

//   const { isBroadcasting, activeTrip } = useAppSelector((state) => state.broadcast);
//   const route = useAppSelector((state) => state.auth.route);

//   // --- Foreground Location Tracking ---
//   const startForegroundBroadcast = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.warn("Foreground location permission denied");
//         return;
//       }

//       watcher.current = await Location.watchPositionAsync(
//         {
//           accuracy: Location.Accuracy.BestForNavigation,
//           timeInterval: 5000, // 5 seconds
//           distanceInterval: 10, // 10 meters
//         },
//         (loc) => {
//           const formatted: ILocationData = {
//             latitude: loc.coords.latitude,
//             longitude: loc.coords.longitude,
//             speed: loc.coords.speed,
//             heading: loc.coords.heading,
//             timestamp: loc.timestamp,
//           };
//           setLocation(formatted);
//         }
//       );
//     } catch (error) {
//       console.error("Foreground tracking error:", error);
//     }
//   };

//   const stopForegroundBroadcast = () => {
//     if (watcher.current) {
//       watcher.current.remove();
//       watcher.current = null;
//     }
//   };

//   // --- Background Location Tracking ---
//   const startBackgroundBroadcast = async () => {
//     try {
//       const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
//       if (bgStatus !== "granted") {
//         console.warn("Background location permission denied");
//         return;
//       }

//       const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
//       if (!hasStarted) {
//         await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//           accuracy: Location.Accuracy.Balanced,
//           timeInterval: 5000, // 10 seconds in background
//           distanceInterval: 10, // 20 meters in background
//           showsBackgroundLocationIndicator: true,
//           pausesUpdatesAutomatically: false,
//           deferredUpdatesInterval: 0,
//           foregroundService: {
//             notificationTitle: "Live Location Broadcast",
//             notificationBody: "Your location is being shared",
//             notificationColor: "#ff6347",
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Background tracking error:", error);
//     }
//   };

//   const stopBackgroundBroadcast = async () => {
//     try {
//       const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
//       if (hasStarted) {
//         await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
//       }
//     } catch (error) {
//       console.error("Error stopping background tracking:", error);
//     }
//   };

//   // --- Handle Location Broadcast ---
//   useEffect(() => {
//     if (isBroadcasting && location && activeTrip && route) {
//       socket.emit(SOCKET_EVENTS.BROADCAST_BUS_LOCATION, {
//         tripId: activeTrip.tripId,
//         ...location,
//       });
//       console.log("📡 [Foreground] Broadcasted location:", { ...location, tripId: activeTrip.tripId });
//     }
//   }, [location, isBroadcasting, activeTrip, route]);

//   // --- Handle App State Changes ---
//   useEffect(() => {
//     const handleAppStateChange = async (nextAppState: AppStateStatus) => {
//       if (!isBroadcasting) return;

//       // Coming to foreground
//       if (appState.current.match(/inactive|background/) && nextAppState === "active") {
//         await stopBackgroundBroadcast();
//         await startForegroundBroadcast();
//       }
//       // Going to background
//       else if (nextAppState.match(/inactive|background/)) {
//         stopForegroundBroadcast();
//         await startBackgroundBroadcast();
//       }

//       appState.current = nextAppState;
//     };

//     const sub = AppState.addEventListener("change", handleAppStateChange);

//     // Initial setup
//     if (isBroadcasting) {
//       if (appState.current === "active") {
//         startForegroundBroadcast();
//       } else {
//         startBackgroundBroadcast();
//       }
//     }

//     return () => {
//       sub.remove();
//       stopForegroundBroadcast();
//       stopBackgroundBroadcast();
//     };
//   }, [isBroadcasting]);

//   const stopBusLocationBroadcasting = () => {
//     stopForegroundBroadcast();
//     stopBackgroundBroadcast();
//     if (route) {
//       dispatch(stopBroadcasting());
//       console.log(`🛑 Stopped broadcasting for route ${route._id}`);
//     }
//   };

//   return {
//     stopBusLocationBroadcasting,
//     location,
//   };
// }
