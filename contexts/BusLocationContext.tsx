import socket from "@/config/socket";
import { SOCKET_EVENTS } from "@/constants";
import { showToast } from "@/utils/toastUtil";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// --- Types ---
interface TripData {
  _id: string;
  routeId: string;
  hostId: string;
  busName: string;
  departureTime?: string;
  direction?: "to_campus" | "from_campus";
  busType: string;
  note?: string;
}

export interface BusLocationData {
  trip: TripData;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  currUserCnt: number;
  timestamp: string;
}

interface BusLocationContextType {
  activeBuses: Record<string, BusLocationData>;
  currentlyConnectedUserCount: number;
  joinRoute: (routeId: string) => void;
  clearBuses: () => void;
}

const BusLocationContext = createContext<BusLocationContextType | undefined>(undefined);

export const BusLocationProvider = ({ children }: { children: ReactNode }) => {
  const [activeBuses, setActiveBuses] = useState<Record<string, BusLocationData>>({});
  const [currentlyConnectedUserCount, setCurrentlyConnectedUserCount] = useState(0);
  const [routeId, setRouteId] = useState<string | null>(null);

  //--------- 🔁 Remove buses inactive for more than 2 mins --------
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      setActiveBuses((prev) => {
        const filtered: Record<string, BusLocationData> = {};
        Object.entries(prev).forEach(([busName, data]) => {
          const busTimestamp = new Date(data.timestamp).getTime();
          const diff = now - busTimestamp;

          // Keep buses updated within 2 minutes (120,000ms)
          if (diff < 120000) {
            filtered[busName] = data;
          }
        });
        return filtered;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  //----- 🔌 Socket listener ---------
  useEffect(() => {
    const handleBusLocationUpdate = (data: BusLocationData) => {
      if (!data?.trip?.busName) {
        console.warn("Invalid data received:", data);
        return;
      }
      console.log("🚌🚌🚌🚌🚌🚌🚌🚌\n", JSON.stringify(data));

      setActiveBuses((prev) => ({
        ...prev,
        [data.trip.busName]: data,
      }));

      setCurrentlyConnectedUserCount(data.currUserCnt || 0);
    };

    socket.on(SOCKET_EVENTS.BUS_LOCATION_UPDATE, handleBusLocationUpdate);

    if (routeId) {
      socket.emit(SOCKET_EVENTS.JOIN_ROUTE, routeId);
    }

    return () => {
      // socket.off(SOCKET_EVENTS.BUS_LOCATION_UPDATE, handleBusLocationUpdate);
      if (routeId) {
        // socket.emit(SOCKET_EVENTS.LEAVE_ROUTE_ROOM, routeId);
      }
    };
  }, [routeId]);

  const joinRoute = (id: string) => {
    console.log("➕JoinRoute()");
    if (routeId) {
      socket.emit(SOCKET_EVENTS.LEAVE_ROUTE_ROOM, routeId);
      // socket.off(SOCKET_EVENTS.BUS_LOCATION_UPDATE);
    }
    setRouteId(id);
    setActiveBuses({});
  };

  const clearBuses = () => {
    setActiveBuses({});
  };

  return (
    <BusLocationContext.Provider
      value={{
        activeBuses,
        currentlyConnectedUserCount,
        joinRoute,
        clearBuses,
      }}
    >
      {children}
    </BusLocationContext.Provider>
  );
};

export const useBusLocation = (): BusLocationContextType => {
  const context = useContext(BusLocationContext);
  if (!context) {
    showToast({
      type: "error",
      text1: "Context Error",
      text2: "useBusLocation must be used within a BusLocationProvider",
    });
    throw new Error("useBusLocation must be used within a BusLocationProvider");
  }
  return context;
};
