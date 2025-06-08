import { mirpur1Route, uttaraRoute } from "./waylines";
import { uttaraWaypoint } from "./waypoints";

export const ROUTES = {
  R2: {
    wayline: uttaraRoute,
    waypoints: uttaraWaypoint,
  },
  R12: {
    wayline: mirpur1Route,
    waypoints: [],
  },
};

type RouteKey = keyof typeof ROUTES;

export const getWayline = (routeNo: RouteKey) => {
  return ROUTES[routeNo]?.wayline ?? null;
};

export const getWaypoints = (routeNo: RouteKey) => {
  return ROUTES[routeNo]?.waypoints ?? null;
};

export const getCurrentRouteCenterCords = (routeNo: RouteKey) => {
  // return 66% index of coordinates
  const wayline = getWayline(routeNo);
  let coordinates: number[][] = [];

  if (wayline) {
    coordinates = wayline.features[0].geometry.coordinates;
  }

  const index = Math.floor(coordinates.length / 2);
  return coordinates[index];
};
