import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logoutSuccess } from '../features/auth/authSlice';
import { API_BASE_URL } from '../../utils/backendUrl';
import { refreshAuthSession } from '../../utils/authRefresh';
import { advanceAuthSessionVersion, getAuthSessionVersion } from '../../utils/authSession';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
});

const isAuthEndpoint = (args) => {
  const url = typeof args === 'string' ? args : args?.url || '';
  return ['/auth/login', '/auth/register', '/auth/refresh']
    .some((path) => url.includes(path));
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const authSessionVersion = getAuthSessionVersion();
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !isAuthEndpoint(args)) {
    try {
      await refreshAuthSession();
      result = await rawBaseQuery(args, api, extraOptions);
    } catch {
      if (
        getAuthSessionVersion() === authSessionVersion &&
        api.getState()?.auth?.user
      ) {
        api.dispatch(logoutSuccess());
        advanceAuthSessionVersion();
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
