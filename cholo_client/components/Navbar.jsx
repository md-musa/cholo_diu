import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';

const Navbar = () => {
  const router = useRouter();

  return (
    <View className="flex-row justify-between items-center bg-white w-full  p-2 px-4 mb-2">
      {/* Logo on the left */}
      <View className="flex-row">
        {/* <Image source={busImage} className="rounded-full" resizeMode="contain" style={{ width: 35, height: 35 }} /> */}
        <Text className="text-black text-2xl font-semibold">
          Cholo <Text className="text-black text-[11px] font-normal">beta </Text>
        </Text>
      </View>

      {/* Settings icon on the right */}
      <TouchableOpacity onPress={() => router.push('/(passenger)/(tabs)/setting')} className="p-1">
        <Ionicons name="menu" size={27} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
