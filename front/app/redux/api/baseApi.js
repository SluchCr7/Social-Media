import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logoutSuccess } from '../features/auth/authSlice';
import { API_BASE_URL } from '../../utils/backendUrl';
import { refreshAuthSession } from '../../utils/authRefresh';
import { getStoredAccessToken, clearStoredAuth } from '../../utils/authStorage';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = getStoredAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const isAuthEndpoint = (args) => {
  const url = typeof args === 'string' ? args : args?.url || '';
  return ['/auth/login', '/auth/register', '/auth/refresh']
    .some((path) => url.includes(path));
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !isAuthEndpoint(args)) {
    try {
      await refreshAuthSession();
      result = await rawBaseQuery(args, api, extraOptions);
    } catch {
      clearStoredAuth();
      if (api.getState()?.auth?.user) {
        api.dispatch(logoutSuccess());
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'User',
    'Post',
    'Comment',
    'Community',
    'Message',
    'Notification',
    'Story',
    'Highlight',
    'Reel',
    'Music',
    'Event',
    'News',
    'Report',
    'Search',
    'Explore',
    'Admin',
  ],
  endpoints: () => ({}),
});
