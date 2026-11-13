import { io } from 'socket.io-client';
import { BACKEND_URL } from '../../../utils/backendUrl';
import { isTerminalAuthFailure, refreshAuthSession } from '../../../utils/authRefresh';

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
  const socket = io(url, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  socketInstance = socket;
  socket.userId = userId;

  socket.on('connect', () => {
    console.log('🟢 Redux Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Redux Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    if (socketInstance !== socket) return;
    const authErrors = [
      'Authentication required',
      'Invalid or expired authentication',
      'Authentication session revoked',
      'Authentication failed',
      'Account access denied',
    ];
    if (!authErrors.includes(error?.message)) return;

    refreshAuthSession()
      .then(() => {
        if (socketInstance === socket && !socket.connected) {
          socket.connect();
        }
      })
      .catch((refreshError) => {
        if (
          socketInstance === socket &&
          typeof window !== 'undefined' &&
          isTerminalAuthFailure(refreshError)
        ) {
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }
      });
  });

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
