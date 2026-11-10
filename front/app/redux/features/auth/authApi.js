import { baseApi } from '../../api/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshSession: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
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
