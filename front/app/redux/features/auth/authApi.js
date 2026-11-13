import { baseApi } from '../../api/baseApi';
import {
  isTerminalAuthFailure,
  refreshAuthSession,
  runAuthTransition,
} from '../../../utils/authRefresh';
import { setAuthSession, logoutSuccess, setIsAuthChecked } from './authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const sessionVersion = getState().auth?.sessionVersion || 0;
        try {
          const { data } = await queryFulfilled;
          if ((getState().auth?.sessionVersion || 0) === sessionVersion) {
            dispatch(setAuthSession(data.user));
          }
        } catch (rejection) {
          if ((getState().auth?.sessionVersion || 0) === sessionVersion) {
            if (isTerminalAuthFailure(rejection?.error) || rejection?.error?.status === 404) {
              dispatch(logoutSuccess());
            } else {
              dispatch(setIsAuthChecked(true));
            }
          }
        }
      },
    }),
    login: builder.mutation({
      queryFn: (credentials, api, extraOptions, baseQuery) =>
        runAuthTransition(async () => {
          const result = await baseQuery({
            url: '/auth/login',
            method: 'POST',
            body: credentials,
          }, api, extraOptions);
          if (result.data?.user) api.dispatch(setAuthSession(result.data.user));
          return result;
        }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation({
      queryFn: (userData, api, extraOptions, baseQuery) =>
        runAuthTransition(async () => {
          const result = await baseQuery({
            url: '/auth/register',
            method: 'POST',
            body: userData,
          }, api, extraOptions);
          if (result.data?.user) api.dispatch(setAuthSession(result.data.user));
          return result;
        }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation({
      queryFn: (arg, api, extraOptions, baseQuery) =>
        runAuthTransition(async () => {
          const result = await baseQuery({
            url: '/auth/logout',
            method: 'POST',
          }, api, extraOptions);
          if (!result.error) api.dispatch(logoutSuccess());
          return result;
        }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch {
          return;
        }
      },
    }),
    refreshSession: builder.mutation({
      queryFn: async () => {
        try {
          const { data } = await refreshAuthSession();
          return { data };
        } catch (error) {
          return {
            error: {
              status: error.response?.status || 'FETCH_ERROR',
              data: error.response?.data || { message: error.message },
            },
          };
        }
      },
      invalidatesTags: ['Auth'],
    }),
    resetPassword: builder.mutation({
      query: ({ id, token, password }) => ({
        url: `/password/reset-password/${id}/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),
    requestPasswordReset: builder.mutation({
      query: (email) => ({
        url: '/password/reset',
        method: 'POST',
        body: { email },
      }),
    }),
    verifyAccount: builder.query({
      query: ({ id, token }) => `/auth/${id}/verify/${token}`,
    }),
    makeAccountPremiumVerify: builder.mutation({
      query: () => ({
        url: '/auth/verify',
        method: 'PUT',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshSessionMutation,
  useResetPasswordMutation,
  useRequestPasswordResetMutation,
  useLazyVerifyAccountQuery,
  useMakeAccountPremiumVerifyMutation,
} = authApi;
