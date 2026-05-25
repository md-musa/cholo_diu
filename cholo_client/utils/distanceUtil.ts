import * as turf from "@turf/turf";

export function calculateDistanceAndTime(
  userCoords: number[],
  busCoords: number[],
  routeLine: number[][],
  busSpeedKmph: number // <-- average speed in km/h
): { distanceKm: number; estimatedTimeMin: number } {
  const checkinPoint = turf.point(userCoords);
  const checkoutPoint = turf.point(busCoords);
  const route = turf.lineString(routeLine);

  // Snap points to the route
  const snappedCheckin = turf.nearestPointOnLine(route, checkinPoint);
  const snappedCheckout = turf.nearestPointOnLine(route, checkoutPoint);

  // Calculate distance along the route in kilometers
  const sliced = turf.lineSlice(snappedCheckout, snappedCheckin, route);
  const distanceKm = turf.length(sliced, { units: "kilometers" });

  // Estimate time (in minutes): time = distance / speed
  const estimatedTimeMin = busSpeedKmph > 0 ? (distanceKm / busSpeedKmph) * 60 : Infinity;

  return {
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    estimatedTimeMin: parseFloat(estimatedTimeMin.toFixed(2))
  };
}
