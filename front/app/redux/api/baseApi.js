import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logoutSuccess } from '../features/auth/authSlice';
import { API_BASE_URL } from '../../utils/backendUrl';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const token = state?.auth?.user?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Mutex promise to serialize token refresh across concurrent 401 responses
let refreshPromise = null;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const isRefreshEndpoint =
    typeof args === 'string'
      ? args.includes('/auth/refresh')
      : args?.url?.includes('/auth/refresh');

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && !isRefreshEndpoint) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshResult = await rawBaseQuery(
            { url: '/auth/refresh', method: 'POST' },
            api,
            extraOptions
          );
          return refreshResult;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    const refreshResult = await refreshPromise;

    if (refreshResult && !refreshResult.error) {
      // Token refresh succeeded: cookies updated, retry original request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Token refresh failed: user session is invalid
      api.dispatch(logoutSuccess());
      if (typeof window !== 'undefined') {
        const publicPaths = ['/Pages/Login', '/Pages/Register', '/Pages/ForgotPassword'];
        const isPublic = publicPaths.some((p) => window.location.pathname.includes(p));
        if (!isPublic) {
          window.location.href = '/Pages/Login';
        }
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
