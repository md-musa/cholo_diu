import { useBusLocation } from "@/hook/useBusLocation";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function BusLocationManager() {
  const { isUserDisConnected } = useBusLocation();
  const [showConnected, setShowConnected] = useState(false);

  useEffect(() => {
    if (!isUserDisConnected) {
      setShowConnected(true);
      const timer = setTimeout(() => setShowConnected(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isUserDisConnected]);

  if (showConnected) {
    return (
      <Text className="z-100 text-center w-full text-sm font-semibold bg-green-600 text-white">
        Connected to server
      </Text>
    );
  } else if (isUserDisConnected) {
    return (
      <Text className="z-100 text-center w-full text-sm font-semibold bg-gray-600 text-white">
        Disconnected from server
      </Text>
    );
  } else return null;
}

export default BusLocationManager;
