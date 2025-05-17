import { showToast } from "@/utils/toastUtil";
import { io } from "socket.io-client";

const SERVER_URL = "http://192.168.1.10:4000";
// const SERVER_URL = `https://tms-dcro.onrender.com`;

const socket = io(SERVER_URL, {
  autoConnect: true, // Automatically connect when the socket is created
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts in milliseconds
  // transports: ["websocket"], // Use WebSocket transport only
});

// Listen for successful connection
socket.on("connect", () => {
  console.log("✅ Connected to socket server");
});

// Handle disconnection
socket.on("disconnect", () => {
  console.warn("⚠️ Disconnected from socket server");

  showToast({
    type: "error",
    text1: "Disconnected from Server",
    text2: "You have been disconnected. Please try logging in again.",
  });
});

// Handle connection error
socket.on("connect_error", (error: any) => {
  console.error("❌ Socket connection error:", error);

  showToast({
    type: "error",
    text1: "Connection Error",
    text2: "Unable to connect to the server. Please check your internet connection.",
  });
});

export default socket;
