// components/BroadcastManager.tsx
import { useBusLocationBroadcast } from "@/hook/useBusLocationBroadcast";
import { useAppSelector } from "@/store/storeConfig";
import { usePathname, useRouter } from "expo-router";
import { Image } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";
import broadcastGifImage from "@/assets/images/broadcast.gif";

export default function BroadcastManager() {
  useBusLocationBroadcast();
  const router = useRouter();
  const pathname = usePathname();
  const { isBroadcasting, activeTrip } = useAppSelector((state) => state.broadcast);
  const excludedPaths = ["/broadcast", , "/watchBusLocation"];

  const shouldShowBroadcastManager = excludedPaths.includes(pathname);
  if (!isBroadcasting || shouldShowBroadcastManager) return null;

  return (
    <TouchableOpacity onPress={() => router.push("/broadcast")} className="z-50">
      <View className="flex-row items-center justify-center p-1 bg-red-700">
        <Image
          source={broadcastGifImage}
          style={{ width: 22, height: 22 }}
          resizeMode="contain"
          className="rounded-2xl"
        />

        <Text className="text-white text-sm mx-2">
          You're sharing location of <Text className="capitalize">{activeTrip?.bus.name}</Text>
        </Text>

        <Text className="border border-muted-200 bg-red-600/70 text-sm text-white px-3 rounded-lg">Stop</Text>
      </View>
    </TouchableOpacity>
  );
}
