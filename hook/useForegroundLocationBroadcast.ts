import * as KeepAwake from "expo-keep-awake";
import { ToastUtil } from "./../utils/toastUtil";
import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import socket from "@/config/socketIoConfig";
import { SOCKET_EVENTS } from "@/constants";
import { useAppSelector } from "@/store/storeConfig";
import { LOCATION_CONSTANTS } from "@/constants/location";

export function useForegroundLocationBroadcast() {
  const { isBroadcasting, isForegroundServiceRunning, isBackgroundServiceRunning, activeTrip } = useAppSelector(
    (state) => state.broadcast
  );

  const watcherRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    if (isBroadcasting && isForegroundServiceRunning && activeTrip && !isBackgroundServiceRunning) {
      startForegroundBroadcasting();
    }
    return () => {
      stopForegroundBroadcasting();
    };
  }, [isBroadcasting, isForegroundServiceRunning, isBackgroundServiceRunning, activeTrip]);

  const startForegroundBroadcasting = async () => {
    try {
      await KeepAwake.activateKeepAwakeAsync("foreground");
      if (!socket.connected) {
        socket.connect();
      }

      // Start watching location
      watcherRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: LOCATION_CONSTANTS.UPDATE_TIME_INTERVAL,
          distanceInterval: LOCATION_CONSTANTS.UPDATE_DISTANCE_INTERVAL,
        },
        (location) => {
          socket.emit(SOCKET_EVENTS.BROADCAST_BUS_LOCATION, {
            tripId: activeTrip?.tripId,
            broadcaster: "user",
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            speed: location.coords.speed,
            heading: location.coords.heading,
            timestamp: location.timestamp,
          });
        }
      );
    } catch (error) {
      console.log(error);
      ToastUtil.error("Failed to start foreground location broadcasting.");
    }
  };

  const stopForegroundBroadcasting = async () => {
    KeepAwake.deactivateKeepAwake("foreground");
    if (watcherRef.current) {
      watcherRef.current.remove();
      watcherRef.current = null;
    }
  };

  return {
    startForegroundBroadcasting,
    stopForegroundBroadcasting,
  };
}
