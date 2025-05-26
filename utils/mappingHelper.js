export function generateMarkers(activeBuses) {
  return Object.entries(activeBuses).map(([busName, data]) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [data.longitude, data.latitude],
    },
    properties: {
      icon: "marker",
      title: `${cpfl(data.trip.busName)}\n${cpfl(data.trip.busType) + " bus"}\n${(data.speed * 3.6).toFixed(2)} km/h`,
      direction: data.trip.direction,
      heading: data.heading,
      speed: data.speed,
    },
  }));

  function cpfl(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
