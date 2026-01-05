import { LRUCache } from "lru-cache";
import { SOCKET_EVENTS } from "../../enums";
import { io } from "../../server";
import {  UserTripModel } from "../modules/trip/trip.model";
import { updateTripSpeedAverage, getRoomUserCount, nowIso } from "./util";
import { emitRouteLocationUpdate, getRecentlyUpdatedTrips } from "./tripUtil";
import { BusModel } from "../modules/bus/bus.model";

const tripCache = new LRUCache<string, any>({
  max: 100,
});

const activeTripsCache = new LRUCache<string, any>({
  max: 100,
});

export interface IncomingLocationPayload {
  broadcaster: "user" | "driver";
  tripId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number; // in m/s
}

export interface OutgoingLocationPayload {
  tripId?: string;
  busName?: string;
  routeId: string;
  direction?: string;
  userType?: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  avgSpeed: number;
  currUserCnt: number;
  hostName?: string;
  timestamp: string;
}

/**
 * Handle location updates sent by passengers or other non-driver users.
 * Loads the user trip from cache/DB and broadcasts to the route room.
 */
export async function handleUserLocationBroadcast(socket: any, data: IncomingLocationPayload) {
  const { tripId, latitude, longitude, heading, speed } = data;

  try {
    let trip = tripCache.get(tripId);

    if (!trip) {
      const newTrip = await UserTripModel.findById(tripId).populate("hostId", "name").lean();
      const bus = await BusModel.findOne({ name: newTrip?.busName }).lean();

      console.log(bus);

      trip = { ...newTrip, busType: bus?.busType };

      if (!trip) {
        console.warn("❌ UserTrip not found for id:", tripId);
        return;
      }
      tripCache.set(tripId, trip);
    }

    const { routeId, busName, direction, busType, hostId } = trip;

    const avgSpeed = updateTripSpeedAverage(tripId, speed) ?? 0;
    const currUserCnt = getRoomUserCount(io, routeId.toString());
    const timestamp = nowIso();

    socket.data.tripId = tripId;

    const outgoing: OutgoingLocationPayload = {
      tripId,
      busName,
      routeId: routeId.toString(),
      direction,
      userType: busType,
      latitude,
      longitude,
      heading,
      speed,
      avgSpeed,
      currUserCnt,
      hostName: hostId?.name,
      timestamp,
    };

    activeTripsCache.set(tripId, outgoing);

    emitRouteLocationUpdate(socket, routeId.toString(), outgoing);
  } catch (err) {
    console.error("❌ Error in handleUserLocationBroadcast:", err);
  }
}

/**
 * Handle location updates sent by drivers. Trip document includes assignment and bus details.
 */
// export async function handleDriverLocationBroadcast(socket: any, data: IncomingLocationPayload) {
//   console.log("📍 Driver location update received:", data);
//   const { tripId, latitude, longitude, heading, speed } = data;

//   try {
//     let trip = tripCache.get(tripId);

//     if (!trip) {
//       trip = await TripModel.findById(tripId)
//         .populate({
//           path: "assignmentId",
//           populate: [
//             { path: "busId", model: "Bus", select: "name" },
//             { path: "scheduleId", model: "Schedule", select: "time direction userType routeId" },
//           ],
//         })
//         .lean();

//       if (!trip) {
//         console.warn("❌ Trip not found for id:", tripId);
//         return;
//       }

//       tripCache.set(tripId, trip);
//       console.log("✅ Cached Trip:", tripId);
//     }

//     const busName: string | undefined = trip.assignmentId?.busId?.name;
//     const routeId: string = trip.assignmentId?.scheduleId?.routeId?.toString();
//     const direction = trip.assignmentId?.scheduleId?.direction;
//     const userType = trip.assignmentId?.scheduleId?.userType;

//     const avgSpeed = updateTripSpeedAverage(tripId, speed) ?? 0;
//     const currUserCnt = getRoomUserCount(io, routeId);
//     const timestamp = nowIso();

//     const outgoing: OutgoingLocationPayload = {
//       busName,
//       routeId,
//       direction,
//       userType,
//       latitude,
//       longitude,
//       heading,
//       speed,
//       avgSpeed,
//       currUserCnt,
//       timestamp,
//     };

//     emitRouteLocationUpdate(socket, routeId, outgoing);
//   } catch (err) {
//     console.error("❌ Error in handleDriverLocationBroadcast:", err);
//   }
// }

/**
 * Public entry point for broadcasting location updates. Decides which handler to call
 * based on broadcaster type.
 */
export async function handleLocationBroadcast(socket: any, data: IncomingLocationPayload) {
  if (data.broadcaster === "user") {
    return handleUserLocationBroadcast(socket, data);
  }

  // return handleDriverLocationBroadcast(socket, data);
}

export async function handleRouteJoin(socket: any, routeId: string) {
  socket.join(routeId);
  const currUserCnt = getRoomUserCount(io, routeId);

  const activeTripsFromCache = getRecentlyUpdatedTrips(activeTripsCache, routeId);
  //console.log("🟢 Active trips from cache:", activeTripsFromCache);
  socket.emit(SOCKET_EVENTS.BUS_LOCATION_UPDATE, activeTripsFromCache);

  //console.log(`➕ Client ${socket.id} joined route ${routeId}; cnt: ${currUserCnt}`);
}

export async function stopBroadcasting(socket: any) {
  try {
    const tripId = socket.data.tripId;
    const tripData = tripCache.get(tripId);

    if (!tripData) return;

    const routeId = tripData.routeId.toString();
    const busName = tripData.busName;

    console.log(routeId, busName);

    activeTripsCache.delete(tripId);

    console.log(`🔴`, busName);
    io.to(routeId).emit(SOCKET_EVENTS.BUS_OFFLINE, {
      busName,
      routeId,
      timestamp: nowIso(),
    });
    console.log("Emitted bus offline for", busName);
  } catch (error) {
    console.error("❌ Error in stopBroadcasting:", error);
  }
}

