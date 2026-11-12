const AUTH_USER_KEY = 'auth_user';
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const isBrowser = typeof window !== 'undefined';

export const getStoredUser = () => {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Failed to parse stored auth user:', err);
    return null;
  }
};

export const setStoredUser = (user) => {
  if (!isBrowser) return;
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } catch (err) {
    console.warn('Failed to store auth user:', err);
  }
};

export const getStoredAccessToken = () => {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
  } catch {
    return null;
  }
};

export const setStoredAccessToken = (token) => {
  if (!isBrowser) return;
  try {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch (err) {
    console.warn('Failed to store access token:', err);
  }
};

export const getStoredRefreshToken = () => {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || null;
  } catch {
    return null;
  }
};

export const setStoredRefreshToken = (token) => {
  if (!isBrowser) return;
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch (err) {
    console.warn('Failed to store refresh token:', err);
  }
};

export const saveAuthSession = ({ user, accessToken, refreshToken }) => {
  if (accessToken) setStoredAccessToken(accessToken);
  if (refreshToken) setStoredRefreshToken(refreshToken);
  if (user) {
    const userToStore = {
      ...user,
      token: accessToken || user.token || getStoredAccessToken(),
      accessToken: accessToken || user.accessToken || getStoredAccessToken(),
    };
    setStoredUser(userToStore);
    return userToStore;
  }
  return null;
};

export const clearStoredAuth = () => {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to clear stored auth:', err);
  }
};
