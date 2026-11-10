import { baseApi } from '../../api/baseApi';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserNotifications: builder.query({
      query: () => '/notification/user',
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [...result.map(({ _id }) => ({ type: 'Notification', id: _id })), { type: 'Notification', id: 'LIST' }]
          : [{ type: 'Notification', id: 'LIST' }],
    }),
    getUnreadCount: builder.query({
      query: () => '/notification/user/unread-count',
      providesTags: [{ type: 'Notification', id: 'COUNT' }],
    }),
    createNotification: builder.mutation({
      query: ({ receiverId, content, type = 'custom', actionRef, actionModel }) => ({
        url: `/notification/${receiverId}`,
        method: 'POST',
        body: { content, type, actionRef, actionModel },
      }),
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Notification', id }, { type: 'Notification', id: 'COUNT' }],
    }),
    clearAllNotifications: builder.mutation({
      query: () => ({
        url: '/notification/clear',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }, { type: 'Notification', id: 'COUNT' }],
    }),
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Notification', id }, { type: 'Notification', id: 'COUNT' }],
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/notification/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }, { type: 'Notification', id: 'COUNT' }],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useLazyGetUserNotificationsQuery,
  useGetUnreadCountQuery,
  useLazyGetUnreadCountQuery,
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationsApi;
