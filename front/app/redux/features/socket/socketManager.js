import { io } from 'socket.io-client';
import { BACKEND_URL } from '../../../utils/backendUrl';
import { refreshAuthSession } from '../../../utils/authRefresh';

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

  socketInstance.on('connect_error', (error) => {
    const authErrors = [
      'Authentication required',
      'Invalid or expired authentication',
      'Authentication session revoked',
      'Authentication failed',
      'Account access denied',
    ];
    if (!authErrors.includes(error?.message)) return;

    const currentSocket = socketInstance;
    refreshAuthSession()
      .then(() => {
        if (socketInstance === currentSocket && !currentSocket.connected) {
          currentSocket.connect();
        }
      })
      .catch((refreshError) => {
        const status = refreshError.response?.status;
        if (
          socketInstance === currentSocket &&
          typeof window !== 'undefined' &&
          (status === 401 || status === 403)
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
