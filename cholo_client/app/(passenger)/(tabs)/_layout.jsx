import { Tabs } from 'expo-router';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/config/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary[500], // Active icon/text color
        tabBarInactiveTintColor: colors.muted[500], // Inactive icon/text color
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Tab bar background
          borderTopWidth: 0,

          paddingBottom: 4 + insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedules"
        options={{
          title: 'Schedules',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="schedule" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="broadcast"
        options={{
          title: 'Share Location',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="bus-marker" size={21} color={color} />,
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Feather name="settings" size={21} color={color} />,
        }}
      />
    </Tabs>
  );
}
