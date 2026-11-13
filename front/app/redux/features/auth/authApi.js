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
          if (result.data) api.dispatch(logoutSuccess());
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
    getAllUsers: builder.query({
      query: () => '/auth',
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [...result.map(({ _id }) => ({ type: 'Auth', id: _id })), { type: 'Auth', id: 'LIST' }]
          : [{ type: 'Auth', id: 'LIST' }],
    }),
    makeUserAdmin: builder.mutation({
      query: (userId) => ({
        url: `/auth/admin/${userId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'Auth', id: userId }, { type: 'Auth', id: 'LIST' }],
    }),
    blockOrUnblockUser: builder.mutation({
      query: (userId) => ({
        url: `/auth/block/${userId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    makeAccountPremiumVerify: builder.mutation({
      query: () => ({
        url: '/auth/verify',
        method: 'PUT',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    updateAccountStatus: builder.mutation({
      query: ({ userId, status, days }) => ({
        url: `/auth/status/${userId}`,
        method: 'PUT',
        body: status === 'suspended' ? { accountStatus: status, days } : { accountStatus: status },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Auth', id: userId }, { type: 'Auth', id: 'LIST' }],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/auth/delete/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Auth', id: 'LIST' }],
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
  useGetAllUsersQuery,
  useMakeUserAdminMutation,
  useBlockOrUnblockUserMutation,
  useMakeAccountPremiumVerifyMutation,
  useUpdateAccountStatusMutation,
  useDeleteUserMutation,
} = authApi;
