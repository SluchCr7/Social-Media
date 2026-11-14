import { API_BASE_URL } from './backendUrl';

let refreshPromise = null;
let authTransitionPromise = null;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const MAX_ROTATION_RETRIES = 5;

export const runAuthTransition = async (operation) => {
  if (authTransitionPromise) {
    await authTransitionPromise;
    return runAuthTransition(operation);
  }

  let releaseTransition;
  const transition = new Promise((resolve) => {
    releaseTransition = resolve;
  });
  authTransitionPromise = transition;

  try {
    if (refreshPromise) {
      await refreshPromise.catch(() => undefined);
    }
    return await operation();
  } finally {
    authTransitionPromise = null;
    releaseTransition();
  }
};

export const isTerminalAuthFailure = (failure) => {
  const status = failure?.response?.status ?? failure?.status;
  const data = failure?.response?.data ?? failure?.data;
  const terminalCodes = [
    'TOKEN_REUSE_DETECTED',
    'ACCOUNT_ACCESS_DENIED',
    'ACCOUNT_BANNED',
    'ACCOUNT_SUSPENDED',
  ];

  return status === 401 || (status === 403 && terminalCodes.includes(data?.code));
};

const requestRefresh = async () => {
  for (let attempt = 0; attempt < MAX_ROTATION_RETRIES; attempt += 1) {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json().catch(() => ({}));

    if (
      response.status === 409 &&
      data.code === 'TOKEN_ROTATED' &&
      attempt < MAX_ROTATION_RETRIES - 1
    ) {
      await wait(Math.min(100 * (2 ** attempt), 800));
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
    if (authTransitionPromise) {
      const error = new Error('Authentication is changing; skip this stale refresh request.');
      error.code = 'AUTH_TRANSITION_IN_PROGRESS';
      return Promise.reject(error);
    }

    refreshPromise = requestRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};
