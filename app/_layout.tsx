import { Stack } from 'expo-router';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Alert, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '@/store/storeConfig';
import BroadcastManager from '@/components/UI/BroadcastManager';
import BusLocationManager from '@/components/UI/BusLocationManager';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { useEffect, useState } from 'react';
import { loadConfig } from '@/utils/config';
import { checkAppStatus } from '@/utils/appGuard';
import { setupApiBaseUrl } from '@/config/axiosInstance';
import { setupSocketUrl } from '@/config/socketIoConfig';
import Constants from 'expo-constants';
import LoadingScreen from '@/components/UI/LoadingScreen';

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const DEV_SERVER_URL = Constants.expoConfig?.extra?.DEV_SERVER_URL;
        // console.log('Current NODE_ENV:', process.env.NODE_ENV);

        if (process.env.NODE_ENV === 'production') {
          const config = await loadConfig();
          // console.log('Loaded config:', config);
          if (!config) {
            Alert.alert('Configuration Error', 'Failed to load app configuration.');
            return;
          }

          const status = checkAppStatus(config);
          if (status === 'BLOCKED') {
            Alert.alert('App Blocked', 'This version of the app is no longer supported.');
            return;
          }

          setupApiBaseUrl(config.api_url);
          setupSocketUrl(config.api_url);
        } else if (process.env.NODE_ENV === 'development') {
          setupApiBaseUrl(DEV_SERVER_URL);
          setupSocketUrl(DEV_SERVER_URL);
        }
      } catch (err) {
        console.log('Initialization error:', err);
      } finally {
        setAppReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!appReady) return <LoadingScreen />;

  return (
    <Provider store={store}>
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 bg-white">
          {appReady && <BroadcastManager />}

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'white' },
            }}
          />
          <Toasts />

          {appReady && <BusLocationManager />}
        </View>
      </GestureHandlerRootView>
    </Provider>
  );
}
