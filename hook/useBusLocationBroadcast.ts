import { useEffect } from "react";
import socket from "@/config/socketIoConfig";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import useLocation from "./useLocation";
import { stopBroadcasting } from "@/store/features/broadcast/broadcastSlice";

export function useBusLocationBroadcast() {
  const dispatch = useAppDispatch();
  const { location } = useLocation(true);
  const route = useAppSelector((state) => state.auth.route);
  const { activeTrip, isBroadcasting } = useAppSelector((state) => state.broadcast);

  // Join room and handle reconnect
  useEffect(() => {
    if (!route) return;

    const joinRoom = () => {
      socket.emit("join-room", route._id);
      console.log(`✅ Joined room: ${route._id}`);
    };

    joinRoom();
    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
      socket.emit("leave-room", route._id);
      console.log(`🚪 Left room: ${route._id}`);
    };
  }, [route]);

  // Broadcast every time location updates (every 5s)
  useEffect(() => {
    if (isBroadcasting && location && route && activeTrip) {
      socket.emit("broadcast-bus-location", {
        tripId: activeTrip.tripId,
        ...location,
      });

      console.log("📡 Broadcasted location data:", { ...location, tripId: activeTrip.tripId });
    }
  }, [isBroadcasting, location, route, activeTrip]);

  const stopBusLocationBroadcasting = () => {
    if (route) {
      socket.emit("stop-broadcast", route._id);
      dispatch(stopBroadcasting());
      console.log(`🛑 Stopped broadcasting for route ${route._id}`);
    }
  };

  return {
    stopBusLocationBroadcasting,
  };
}
