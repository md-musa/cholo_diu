import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

export const askForLocationPermission = async (): Promise<'background' | 'foreground' | 'none'> => {
  try {
    // 1. Check current background permission
    const { status: bgStatus } = await Location.getBackgroundPermissionsAsync();
    if (bgStatus === 'granted') return 'background';

    // 2. Not granted: show alert to user
    return new Promise<'background' | 'foreground' | 'none'>(resolve => {
      Alert.alert(
        'Choose Location Sharing Mode',
        'Choose one:\n\n' +
          '⚫ In App: Shares location only while the app is open.\n\n' +
          '⚫ In Background: Shares location even if the app is minimized. Make sure permission is set to “Allow all the time“',
        [
          {
            text: 'Share in Background',
            onPress: async () => {
              try {
                const { status: newBgStatus } = await Location.requestBackgroundPermissionsAsync();
                if (newBgStatus === 'granted') {
                  return resolve('background');
                } else {
                  Alert.alert(
                    'Permission Not Granted',
                    'Please enable ‘Always allow’ in settings to share your bus location even when the app isn’t open.',
                    [
                      {
                        text: 'Open Settings',
                        onPress: () => {
                          Linking.openSettings();
                          resolve('none');
                        },
                      },
                      { text: 'Cancel', style: 'cancel', onPress: () => resolve('none') },
                    ]
                  );
                }
              } catch (error) {
                resolve('none');
              }
            },
          },
          {
            text: 'Share in App',
            onPress: async () => {
              const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
              if (fgStatus === 'granted') {
                resolve('foreground');
              } else {
                Alert.alert(
                  'Permission Needed',
                  'Please enable location access in your device settings to use this feature.',
                  [
                    {
                      text: 'Open Settings',
                      onPress: () => {
                        Linking.openSettings();
                        resolve('none');
                      },
                    },
                    { text: 'Cancel', style: 'cancel', onPress: () => resolve('none') },
                  ]
                );
              }
            },
          },
        ]
      );
    });
  } catch (error) {
    return 'none';
  }
};
