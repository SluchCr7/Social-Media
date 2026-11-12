import axios from 'axios';
import { API_BASE_URL } from './backendUrl';
import { refreshAuthSession } from './authRefresh';
import { getStoredAccessToken, clearStoredAuth } from './authStorage';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isAuthEndpoint = (url = '') =>
  ['/auth/login', '/auth/register', '/auth/refresh'].some((path) => url.includes(path));

api.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (config.headers?.delete) {
        config.headers.delete('Content-Type');
      } else {
        delete config.headers['Content-Type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await refreshAuthSession();
        const newToken =
          refreshResponse?.data?.accessToken ||
          refreshResponse?.data?.token ||
          getStoredAccessToken();

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshErr) {
        clearStoredAuth();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
