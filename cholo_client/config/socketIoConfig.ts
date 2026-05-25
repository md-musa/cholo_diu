import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let currentUrl = '';

export function setupSocketUrl(newUrl: string) {
  // If URL is unchanged → do nothing
  if (currentUrl === newUrl && socket) return;

  currentUrl = newUrl;

  // If socket exists → disconnect before updating
  if (socket) {
    socket.disconnect();
  }

  // Create a fresh new socket with the new URL
  socket = io(newUrl, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });
}

export function getSocket(): Socket {
  if (!socket) throw new Error('Socket URL is not initialized. Call setSocketUrl() first.');
  return socket;
}
