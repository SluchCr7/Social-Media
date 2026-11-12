import axios from 'axios';
import { API_BASE_URL } from './backendUrl';
import {
  getStoredRefreshToken,
  saveAuthSession,
  getStoredUser,
} from './authStorage';

let refreshPromise = null;

export const refreshAuthSession = () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const storedRefreshToken = getStoredRefreshToken();

      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        storedRefreshToken ? { refreshToken: storedRefreshToken } : {},
        { withCredentials: true }
      );

      const data = response.data || {};
      const newAccessToken = data.accessToken || data.token;
      const newRefreshToken = data.refreshToken;
      const currentUser = getStoredUser();
      const updatedUser = data.user || currentUser;

      saveAuthSession({
        user: updatedUser,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      return response;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
