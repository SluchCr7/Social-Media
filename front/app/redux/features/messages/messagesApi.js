import { baseApi } from '../../api/baseApi';

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversationUsers: builder.query({
      query: () => '/message/users',
      providesTags: ['Message'],
    }),
    getMessagesBetweenUsers: builder.query({
      query: (userId) => `/message/messages/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Message', id: `CONV_${userId}` }],
    }),
    getMessagesByUser: builder.query({
      query: (userId) => `/message/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Message', id: `USER_${userId}` }],
    }),
    sendMessage: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `/message/send/${userId}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Message', id: `CONV_${userId}` },
        'Message',
      ],
    }),
    toggleLikeMessage: builder.mutation({
      query: (messageId) => ({
        url: `/message/like/${messageId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, messageId) => [{ type: 'Message', id: messageId }],
    }),
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/message/delete/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, messageId) => [{ type: 'Message', id: messageId }],
    }),
    deleteForMe: builder.mutation({
      query: (messageId) => ({
        url: `/message/deleteFor/${messageId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, messageId) => [{ type: 'Message', id: messageId }],
    }),
    markMessagesAsRead: builder.mutation({
      query: (userId) => ({
        url: `/message/read/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'Message', id: `CONV_${userId}` }, 'Message'],
    }),
    getUnreadMessagesCount: builder.query({
      query: () => '/message/messages/unread',
      providesTags: [{ type: 'Message', id: 'UNREAD' }],
    }),
  }),
});

export const {
  useGetConversationUsersQuery,
  useLazyGetConversationUsersQuery,
  useGetMessagesBetweenUsersQuery,
  useLazyGetMessagesBetweenUsersQuery,
  useGetMessagesByUserQuery,
  useLazyGetMessagesByUserQuery,
  useSendMessageMutation,
  useToggleLikeMessageMutation,
  useDeleteMessageMutation,
  useDeleteForMeMutation,
  useMarkMessagesAsReadMutation,
  useGetUnreadMessagesCountQuery,
  useLazyGetUnreadMessagesCountQuery,
} = messagesApi;
