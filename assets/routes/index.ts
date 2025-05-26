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
  return ROUTES[routeNo].wayline;
};

export const getWaypoints = (routeNo: RouteKey) => {
  return ROUTES[routeNo].waypoints;
};
