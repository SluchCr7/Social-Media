import { baseApi } from '../../api/baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['Admin'],
    }),
    getAdminUsers: builder.query({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: (result) =>
        result?.users
          ? [...result.users.map(({ _id }) => ({ type: 'Admin', id: _id })), { type: 'Admin', id: 'USERS_LIST' }]
          : [{ type: 'Admin', id: 'USERS_LIST' }],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status, days, reason }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PUT',
        body: { status, days, reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Admin', id }, { type: 'Admin', id: 'USERS_LIST' }, 'User'],
    }),
    toggleUserRole: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Admin', id }, { type: 'Admin', id: 'USERS_LIST' }, 'User'],
    }),
    toggleUserVerify: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/verify`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Admin', id }, { type: 'Admin', id: 'USERS_LIST' }, 'User'],
    }),
    forceLogoutUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/force-logout`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Admin', id }],
    }),
    deleteUserByAdmin: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      invalidatesTags: [{ type: 'Admin', id: 'USERS_LIST' }, 'User', 'Post'],
    }),
    getAdminContent: builder.query({
      query: (params) => ({
        url: '/admin/content',
        params,
      }),
      providesTags: ['Admin'],
    }),
    deleteContentItem: builder.mutation({
      query: ({ type, id, reason }) => ({
        url: `/admin/content/${type}/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      invalidatesTags: ['Admin', 'Post', 'Comment', 'Community'],
    }),
    broadcastAnnouncement: builder.mutation({
      query: ({ title, content }) => ({
        url: '/admin/broadcast',
        method: 'POST',
        body: { title, content },
      }),
      invalidatesTags: ['Notification'],
    }),
    getAdminLogs: builder.query({
      query: (params) => ({
        url: '/admin/logs',
        params,
      }),
      providesTags: ['Admin'],
    }),
    runSystemCleanup: builder.mutation({
      query: ({ jobType }) => ({
        url: '/admin/system/cleanup',
        method: 'POST',
        body: { jobType },
      }),
      invalidatesTags: ['Admin', 'Story'],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useLazyGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useLazyGetAdminUsersQuery,
  useUpdateUserStatusMutation,
  useToggleUserRoleMutation,
  useToggleUserVerifyMutation,
  useForceLogoutUserMutation,
  useDeleteUserByAdminMutation,
  useGetAdminContentQuery,
  useLazyGetAdminContentQuery,
  useDeleteContentItemMutation,
  useBroadcastAnnouncementMutation,
  useGetAdminLogsQuery,
  useLazyGetAdminLogsQuery,
  useRunSystemCleanupMutation,
} = adminApi;
