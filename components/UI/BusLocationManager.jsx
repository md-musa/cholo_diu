import { useBusLocation } from "@/hook/useBusLocationTracking";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";

function BusLocationManager() {
  const { isUserDisConnected, internetStatus } = useBusLocation();
  const [showConnectedMsg, setShowConnectedMsg] = useState(false);

  useEffect(() => {
    if (!isUserDisConnected) {
      setShowConnectedMsg(true);
      const timer = setTimeout(() => setShowConnectedMsg(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isUserDisConnected]);

  if (isUserDisConnected)
    return (
      <Text className="z-100 text-center w-full text-sm font-semibold bg-muted-600 text-white">{internetStatus}</Text>
    );
  else return <></>;
}

export default React.memo(BusLocationManager);
