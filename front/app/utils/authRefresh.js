import axios from 'axios';
import { API_BASE_URL } from './backendUrl';

let refreshPromise;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const postRefresh = () =>
  axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });

export const refreshAuthSession = () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      for (let attempt = 0; ; attempt += 1) {
        try {
          return await postRefresh();
        } catch (error) {
          const isRotationInProgress =
            error.response?.status === 409 &&
            error.response?.data?.code === 'REFRESH_ROTATION_IN_PROGRESS';

          if (!isRotationInProgress || attempt >= 4) {
            throw error;
          }

          await wait(200 * (attempt + 1));
        }
      }
    })().finally(() => {
      refreshPromise = undefined;
    });
  }

  return refreshPromise;
};
