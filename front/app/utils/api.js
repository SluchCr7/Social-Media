import axios from 'axios';
import { API_BASE_URL } from './backendUrl';
import { isTerminalAuthFailure, refreshAuthSession } from './authRefresh';
import { store } from '../redux/store';

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
    if (config._authSessionVersion === undefined) {
      config._authSessionVersion = store.getState().auth?.sessionVersion || 0;
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
    const isSameSession = () =>
      (store.getState().auth?.sessionVersion || 0) ===
      originalRequest?._authSessionVersion;

    if (!originalRequest || isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isSameSession()) return Promise.reject(error);
      originalRequest._retry = true;

      try {
        await refreshAuthSession();
        if (!isSameSession()) return Promise.reject(error);
        return api(originalRequest);
      } catch (refreshErr) {
        if (
          isSameSession() &&
          typeof window !== 'undefined' &&
          isTerminalAuthFailure(refreshErr)
        ) {
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }
        return Promise.reject(refreshErr);
      }
    }

    if (
      error.response?.status === 401 &&
      originalRequest._retry &&
      isSameSession() &&
      typeof window !== 'undefined'
    ) {
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
    }

    return Promise.reject(error);
  }
);

export default api;
