import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logoutSuccess } from '../features/auth/authSlice';
import { API_BASE_URL } from '../../utils/backendUrl';
import { isTerminalAuthFailure, refreshAuthSession } from '../../utils/authRefresh';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
});

const isAuthEndpoint = (args) => {
  const url = typeof args === 'string' ? args : args?.url || '';
  const path = url.split('?')[0].replace(/^\/api(?=\/|$)/, '');
  return ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'].includes(path);
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const sessionVersion = api.getState().auth?.sessionVersion || 0;
  const isSameSession = () =>
    (api.getState().auth?.sessionVersion || 0) === sessionVersion;
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !isAuthEndpoint(args) && isSameSession()) {
    try {
      await refreshAuthSession();
      if (!isSameSession()) return result;
      result = await rawBaseQuery(args, api, extraOptions);
      if (result.error?.status === 401 && isSameSession()) {
        api.dispatch(logoutSuccess());
        api.dispatch(baseApi.util.resetApiState());
      }
    } catch (refreshError) {
      const status = refreshError.response?.status;
      if (isTerminalAuthFailure(refreshError) && isSameSession()) {
        api.dispatch(logoutSuccess());
        api.dispatch(baseApi.util.resetApiState());
      } else {
        result = {
          error: {
            status: status || 'FETCH_ERROR',
            data: refreshError.response?.data || { message: refreshError.message },
          },
        };
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  keepUnusedDataFor: 300,
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
