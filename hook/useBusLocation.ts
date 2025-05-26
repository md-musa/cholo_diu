// src/hooks/useBusLocationSocket.ts
import { useEffect } from "react";
import socket from "@/config/socketIoConfig";
import { SOCKET_EVENTS } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/store/storeConfig";
import { clearBuses, removeInactiveBuses, updateBusLocation } from "@/store/features/busLocation/busLocationSlice";

export const useBusLocation = () => {
  const dispatch = useAppDispatch();
  const { route } = useAppSelector((state) => state.auth);
  const { activeBuses, currentlyConnectedUserCount } = useAppSelector((state) => state.busLocation);

  // Remove inactive buses every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(removeInactiveBuses());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(clearBuses());

    const handleUpdate = (data: any) => {
      dispatch(updateBusLocation(data));
    };

    socket.on(SOCKET_EVENTS.BUS_LOCATION_UPDATE, handleUpdate);

    if (route) {
      socket.emit(SOCKET_EVENTS.JOIN_ROUTE, route._id);
    }

    return () => {
      socket.off(SOCKET_EVENTS.BUS_LOCATION_UPDATE, handleUpdate);
      if (route) {
        socket.emit(SOCKET_EVENTS.LEAVE_ROUTE_ROOM, route._id);
      }
    };
  }, [route]);

  return {
    activeBuses,
    currentlyConnectedUserCount,
    clearBuses: () => dispatch(clearBuses()),
  };
};
