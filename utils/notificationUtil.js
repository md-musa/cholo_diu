// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import { Platform } from "react-native";

// export const getPushToken = async () => {
//   if (!Device.isDevice) {
//     console.warn("Must use physical device for Push Notifications");
//     return null;
//   }

//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== "granted") {
//     alert("Failed to get push token for push notifications!");
//     return null;
//   }

//   const tokenData = await Notifications.getExpoPushTokenAsync();
//   return tokenData.data;
// };
