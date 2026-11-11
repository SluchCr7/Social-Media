import axios from 'axios';
import { API_BASE_URL } from './backendUrl';
import { refreshAuthSession } from './authRefresh';
import { getAuthSessionVersion } from './authSession';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isAuthEndpoint = (url = '') =>
  ['/auth/login', '/auth/register', '/auth/refresh'].some((path) => url.includes(path));

api.interceptors.request.use((config) => {
  config.authSessionVersion = getAuthSessionVersion();
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        await refreshAuthSession();
        return api(originalRequest);
      } catch (refreshErr) {
        if (
          typeof window !== 'undefined' &&
          originalRequest.authSessionVersion === getAuthSessionVersion()
        ) {
          window.dispatchEvent(
            new CustomEvent('auth:session-expired', {
              detail: { authSessionVersion: originalRequest.authSessionVersion },
            })
          );
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
