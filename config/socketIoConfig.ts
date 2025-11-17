import Constants from "expo-constants";
import { io } from "socket.io-client";

const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? Constants.expoConfig?.extra?.DVELOPMENT_SERVER_URL
    : Constants.expoConfig?.extra?.PRODUCTION_SERVER_URL;

const socket = io(SERVER_URL, {
  autoConnect: false, // Automatically connect when the socket is created
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Number of reconnection attempts
  reconnectionDelay: 2000, // Delay between reconnection attempts in milliseconds
  // transports: ["websocket"], // Use WebSocket transport only
});

export default socket;
