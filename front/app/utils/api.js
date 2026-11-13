import axios from 'axios';
import { API_BASE_URL } from './backendUrl';
import { refreshAuthSession } from './authRefresh';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isAuthEndpoint = (url = '') => {
  const path = url.split('?')[0].replace(/^\/api(?=\/|$)/, '');
  return ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'].includes(path);
};

api.interceptors.request.use(
  (config) => {
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
        await refreshAuthSession();
        return api(originalRequest);
      } catch (refreshErr) {
        const status = refreshErr.response?.status;
        if (typeof window !== 'undefined' && (status === 401 || status === 403)) {
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }
        return Promise.reject(refreshErr);
      }
    }

    if (error.response?.status === 401 && originalRequest._retry && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
    }

    return Promise.reject(error);
  }
);

export default api;
