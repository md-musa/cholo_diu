import moment from "moment";
import type { OutgoingLocationPayload } from "./socket.types";
import { LRUCache } from "lru-cache";
import { SOCKET_EVENTS } from "../../enums";
import { io } from "../../server";

// Return trips for the route updated in the last 90 seconds.
export function getRecentlyUpdatedTrips(cache: LRUCache<string, any>, routeId: string): OutgoingLocationPayload[] {
  const cutoff = moment().subtract(90, "seconds");
  const recentTrips: OutgoingLocationPayload[] = [];

  for (const trip of cache.values()) {
    if (trip.routeId === routeId && moment(trip.timestamp).isAfter(cutoff)) {
      recentTrips.push(trip);
    }
  }

  return recentTrips;
}

// Broadcast location updates to the route room.
export function emitRouteLocationUpdate(routeId: string, payload: OutgoingLocationPayload) {
  io.to(routeId).emit(SOCKET_EVENTS.BUS_LOCATION_UPDATE, payload);
}
