import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";

/**
 * Checks for and requests foreground and background location permissions.
 * If permission is not granted, prompts the user with an alert and then opens the app settings.
 * @returns Promise<boolean> - true if permission is granted, false otherwise.
 */
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
        "Background Location Permission Required",
        "To broadcast your bus location in the background, background location access is needed. Please enable it when prompted.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "OK",
            onPress: async () => {
              try {
                // 4. Now request background permission
                const { status: newBgStatus } = await Location.requestBackgroundPermissionsAsync();
                if (newBgStatus === "granted") {
                  return resolve(true);
                } else {
                  // 5. Optional: open settings if permission denied again
                  Alert.alert("Permission Not Granted", "You can enable background location manually from settings.", [
                    {
                      text: "Open Settings",
                      onPress: () => {
                        Linking.openSettings();
                        resolve(false);
                      },
                    },
                    { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
                  ]);
                }
              } catch (error) {
                console.error("Error requesting permissions:", error);
                resolve(false);
              }
            },
          },
        ]
      );
    });
  } catch (error) {
    console.error("Error checking background location permission:", error);
    return false;
  }
};
