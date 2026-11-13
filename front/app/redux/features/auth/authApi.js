import { baseApi } from '../../api/baseApi';
import { refreshAuthSession } from '../../../utils/authRefresh';
import { setUser, logoutSuccess, setIsAuthChecked } from './authSlice';

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
            dispatch(setUser(data.user));
          }
        } catch (rejection) {
          if ((getState().auth?.sessionVersion || 0) === sessionVersion) {
            const status = rejection?.error?.status;
            if ([401, 403, 404].includes(status)) {
              dispatch(logoutSuccess());
            } else {
              dispatch(setIsAuthChecked(true));
            }
          }
        }
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch {
          // The caller handles credential errors.
        }
      },
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch {
          // The caller handles validation errors.
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logoutSuccess());
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
