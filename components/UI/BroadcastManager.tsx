// components/BroadcastManager.tsx
import { useBusLocationBroadcast } from "@/hook/useBusLocationBroadcast";
import { useAppSelector } from "@/store/storeConfig";
import { usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function BroadcastManager() {
  useBusLocationBroadcast();
  const router = useRouter();
  const pathname = usePathname();

  const { isBroadcasting, activeTrip } = useAppSelector((state) => state.broadcast);

  const excludedPaths = ["/home/broadcast/liveLocationSharing", "/home/broadcast", "/home/watchBusLocation"];

  // if (isBroadcasting && pathname === "/home/broadcast") {
  //   router.push("/home/broadcast/liveLocationSharing");
  // }

  const shouldShowBroadcastManager = excludedPaths.includes(pathname);
  if (!isBroadcasting || shouldShowBroadcastManager) return null;

  return (
    <TouchableOpacity onPress={() => router.push("/home/(tabs)/broadcast/liveLocationSharing")} className="z-50">
      <Text className="text-center w-full text-md font-bold p-1 bg-red-600 text-white">
        You are sharing live location for <Text className="capitalize">{activeTrip?.bus.name}</Text>
      </Text>
    </TouchableOpacity>
  );
}
