import { LRUCache } from "lru-cache";
import { Server } from "socket.io";

export interface TripSpeedData {
  avgSpeed: number;
  samples: number;
}

export const tripSpeedCache = new LRUCache<string, TripSpeedData>({ max: 100 });

// Add a new speed sample and return the updated rolling average.
export function updateTripSpeedAverage(tripId: string, speed?: number): number | undefined {
  if (speed === undefined || Number.isNaN(speed) || speed < 0) return undefined;

  let entry = tripSpeedCache.get(tripId);
  if (!entry) {
    entry = { avgSpeed: speed, samples: 1 };
  } else {
    entry.samples++;
    entry.avgSpeed = (entry.avgSpeed * (entry.samples - 1) + speed) / entry.samples;
  }

  tripSpeedCache.set(tripId, entry);
  return entry.avgSpeed;
}

// Get the number of sockets currently in a room.
export function getRoomUserCount(io: Server, roomId: string): number {
  try {
    return io.sockets.adapter.rooms.get(roomId)?.size || 0;
  } catch {
    return 0;
  }
}

// ISO timestamp for broadcast events.
export function nowIso(): string {
  return new Date().toISOString();
}
