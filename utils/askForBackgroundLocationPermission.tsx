import * as Location from "expo-location";
import { Alert, Linking } from "react-native";

export const ensureBackgroundLocationPermission = async (): Promise<boolean> => {
  try {
    // 1. Check current background permission
    const { status: bgStatus } = await Location.getBackgroundPermissionsAsync();
    if (bgStatus === "granted") {
      return true;
    }

    // 2. Not granted: show alert to user
    return new Promise<boolean>((resolve) => {
      Alert.alert(
        "Background Location Needed",
        "To share your bus location in real time, please select 'Allow all the time' for location access. If you skip this, your location will only be shared while you're using the app.",
        [
          {
            text: "Cancel",
            onPress: async () => {
              const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
              if (fgStatus === "granted") {
                resolve(true);
              } else {
                Alert.alert(
                  "Permission Needed",
                  "Please enable location access in your device settings to use this feature.",
                  [
                    {
                      text: "Open Settings",
                      onPress: () => {
                        Linking.openSettings();
                        resolve(false);
                      },
                    },
                    { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
                  ]
                );
              }
            },
          },
          {
            text: "OK",
            onPress: async () => {
              try {
                const { status: newBgStatus } = await Location.requestBackgroundPermissionsAsync();
                if (newBgStatus === "granted") {
                  return resolve(true);
                } else {
                  Alert.alert(
                    "Permission Not Granted",
                    "Please enable ‘Always allow’ in settings to share your bus location even when the app isn’t open.",
                    [
                      {
                        text: "Open Settings",
                        onPress: () => {
                          Linking.openSettings();
                          resolve(false);
                        },
                      },
                      { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
                    ]
                  );
                }
              } catch (error) {
                resolve(false);
              }
            },
          },
        ]
      );
    });
  } catch (error) {
    return false;
  }
};
