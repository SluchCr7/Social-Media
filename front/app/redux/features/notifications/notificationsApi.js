import { baseApi } from '../../api/baseApi';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query({
      query: () => '/notification/user',
      providesTags: (result) => [
        { type: 'Notification', id: 'LIST' },
        ...(Array.isArray(result) ? result.filter((item) => item?._id)
          .map((item) => ({ type: 'Notification', id: item._id })) : []),
      ],
    }),
    getUnreadNotificationCount: build.query({
      query: () => '/notification/user/unread-count',
      providesTags: [{ type: 'Notification', id: 'UNREAD' }],
    }),
    addNotification: build.mutation({
      query: ({ receiverId, content, type, actionRef, actionModel }) => ({
        url: `/notification/${receiverId}`,
        method: 'POST',
        body: { content, type, actionRef, actionModel },
      }),
    }),
    deleteNotification: build.mutation({
      query: (id) => ({ url: `/notification/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD' },
      ],
    }),
    clearNotifications: build.mutation({
      query: () => ({ url: '/notification/clear', method: 'DELETE' }),
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD' },
      ],
    }),
    markNotificationRead: build.mutation({
      query: (id) => ({ url: `/notification/${id}/read`, method: 'PATCH', body: {} }),
      invalidatesTags: (result, error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD' },
      ],
    }),
    markAllNotificationsRead: build.mutation({
      query: () => ({ url: '/notification/read-all', method: 'PATCH', body: {} }),
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD' },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useAddNotificationMutation,
  useDeleteNotificationMutation,
  useClearNotificationsMutation,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
