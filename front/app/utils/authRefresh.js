import { API_BASE_URL } from './backendUrl';

let refreshPromise = null;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const requestRefresh = async () => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json().catch(() => ({}));

    if (response.status === 409 && data.code === 'TOKEN_ROTATED' && attempt < 2) {
      await wait(150 * (attempt + 1));
      continue;
    }

    if (!response.ok) {
      const error = new Error(data.message || 'Unable to refresh the session');
      error.response = { status: response.status, data };
      throw error;
    }

    return { data, status: response.status };
  }

  throw new Error('Unable to refresh the session after a concurrent rotation');
};

export const refreshAuthSession = () => {
  if (!refreshPromise) {
    refreshPromise = requestRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};
