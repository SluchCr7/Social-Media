import { io } from 'socket.io-client';
import { BACKEND_URL } from '../../../utils/backendUrl';

let socketInstance = null;

export const getSocket = () => socketInstance;

export const connectSocket = (userId) => {
  if (typeof window === 'undefined') return null;

  if (socketInstance) {
    if (socketInstance.userId === userId && socketInstance.connected) {
      return socketInstance;
    }
    socketInstance.disconnect();
    socketInstance = null;
  }

  if (!userId) return null;

  const url = BACKEND_URL;
  socketInstance = io(url, {
    query: { userId },
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  socketInstance.userId = userId;

  socketInstance.on('connect', () => {
    console.log('🟢 Redux Socket connected:', socketInstance.id);
  });

  socketInstance.on('disconnect', () => {
    console.log('🔴 Redux Socket disconnected');
  });

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
