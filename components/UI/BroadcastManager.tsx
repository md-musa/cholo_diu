// components/BroadcastManager.tsx
import { useBusLocation } from "@/hook/useBusLocation";
import { useBusLocationBroadcast } from "@/hook/useBusLocationBroadcast";
import { useAppSelector } from "@/store/storeConfig";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function BroadcastManager() {
  useBusLocationBroadcast();
  const router = useRouter();
  const { isBroadcasting, activeTrip } = useAppSelector((state) => state.broadcast);

  if (!isBroadcasting) return null;

  return (
    <TouchableOpacity onPress={() => router.push("/home/(tabs)/broadcast/liveLocationSharing")} className="z-50">
      <Text className="text-center w-full text-md font-bold p-1 bg-red-600 text-white">
        You are sharing live location for <Text className="capitalize">{activeTrip?.bus.name}</Text>
      </Text>
    </TouchableOpacity>
  );
}
