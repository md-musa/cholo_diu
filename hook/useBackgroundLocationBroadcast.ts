import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import { stopBroadcasting } from "@/store/features/broadcast/broadcastSlice";
import * as Location from "expo-location";
import BackgroundService from "react-native-background-actions";
import socket from "@/config/socketIoConfig";
import { SOCKET_EVENTS } from "@/constants";
import { LOCATION_CONSTANTS } from "@/constants/location";

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export function useBackgroundLocationBroadcast() {
  const dispatch = useAppDispatch();
  const { isBroadcasting, isBackgroundServiceRunning, isForegroundServiceRunning, activeTrip } = useAppSelector(
    (state) => state.broadcast
  );

  useEffect(() => {
    if (isBroadcasting && isBackgroundServiceRunning && !isForegroundServiceRunning && activeTrip) {
      startBackgroundBroadcast(activeTrip.tripId);
    }

    return () => {
      stopAllTracking();
    };
  }, [isBroadcasting, activeTrip, isBackgroundServiceRunning, isForegroundServiceRunning]);

  // ✅ Start background location broadcast
  const startBackgroundBroadcast = async (tripId: string) => {
    try {
      const options = {
        taskName: "location_sharing",
        taskTitle: "Sharing Bus Location",
        taskDesc: "Sharing live location with students and employees",
        taskIcon: {
          name: "ic_launcher",
          type: "mipmap",
        },
        color: "#0066cc",
        linkingURI: "cholo://(passenger)/broadcast",
        parameters: { tripId },
      };

      await BackgroundService.start(async (taskData?: { tripId: string }) => {
        if (!taskData) throw new Error("No trip data provided");
        const { tripId } = taskData;

        // Start watching the position
        const watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: LOCATION_CONSTANTS.UPDATE_TIME_INTERVAL,
            distanceInterval: LOCATION_CONSTANTS.UPDATE_DISTANCE_INTERVAL,
          },
          async (location) => {
            if (!socket.connected) socket.connect();

            socket.emit(SOCKET_EVENTS.BROADCAST_BUS_LOCATION, {
              tripId,
              broadcaster: "user",
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              speed: location.coords.speed,
              heading: location.coords.heading,
              timestamp: location.timestamp,
            });

            await updateBackgroundNotification(location);
          }
        );

        // Keep the background task alive
        while (BackgroundService.isRunning()) {
          await sleep(5000);
        }

        watcher.remove();
      }, options);
    } catch (error) {
      console.error("[Background Broadcast Error]:", error);
    }
  };

  // ✅ Stop all background tracking
  const stopAllTracking = async () => {
    if (await BackgroundService.isRunning()) {
      await BackgroundService.stop();
    }
  };

  // ✅ Stop broadcasting & update Redux
  const stopBusLocationBroadcasting = async () => {
    await stopAllTracking();
    dispatch(stopBroadcasting());
  };

  // ✅ Update background notification dynamically
  const updateBackgroundNotification = async (location: Location.LocationObject) => {
    if (!location.coords.speed) return;
    try {
      await BackgroundService.updateNotification({
        taskDesc: `Speed: ${(location.coords.speed * 3.6).toFixed(2)} km/h\n Click to stop.`,
      });
    } catch (err) {
      console.log("Background Notification Error:", err);
    }
  };

  return {
    stopBusLocationBroadcasting,
    isBackgroundActive: BackgroundService.isRunning(),
  };
}
