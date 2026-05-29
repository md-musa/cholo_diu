export function generateMarkers(activeBuses) {
  return Object.entries(activeBuses).map(([busName, data]) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      },
      properties: {
        icon: "marker",
        title: `${cpfl(data.busName)}\n${data.direction}`,
        direction: data.direction,
        heading: data.heading,
        speed: data.speed,
      },
    };
  });

  function cpfl(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
