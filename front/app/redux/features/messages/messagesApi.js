import { baseApi } from '../../api/baseApi';

const messageTags = (result) => [
  ...(Array.isArray(result) ? result.filter((message) => message?._id)
    .map((message) => ({ type: 'Message', id: message._id })) : []),
];

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConversationUsers: build.query({
      query: () => '/message/users',
      providesTags: [{ type: 'Message', id: 'USERS' }],
    }),
    getMessages: build.query({
      query: ({ targetUserId }) => `/message/messages/${targetUserId}`,
      providesTags: (result, error, { targetUserId }) => [
        { type: 'Message', id: `CONVERSATION-${targetUserId}` },
        ...messageTags(result),
      ],
    }),
    getMessagesByUser: build.query({
      query: ({ userId }) => `/message/user/${userId}`,
      providesTags: (result, error, { userId }) => [
        { type: 'Message', id: `BY-USER-${userId}` },
        ...messageTags(result),
      ],
    }),
    getUnreadMessages: build.query({
      query: () => '/message/messages/unread',
      providesTags: (result) => [
        { type: 'Message', id: 'UNREAD' },
        ...messageTags(result),
      ],
    }),
    sendMessage: build.mutation({
      query: ({ targetUserId, formData }) => ({
        url: `/message/send/${targetUserId}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { targetUserId, currentUserId }) => [
        { type: 'Message', id: `CONVERSATION-${targetUserId}` },
        { type: 'Message', id: `BY-USER-${currentUserId}` },
        { type: 'Message', id: 'USERS' },
        { type: 'Message', id: 'UNREAD' },
      ],
    }),
    markConversationRead: build.mutation({
      query: (targetUserId) => ({
        url: `/message/read/${targetUserId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, targetUserId) => [
        { type: 'Message', id: `CONVERSATION-${targetUserId}` },
        { type: 'Message', id: 'UNREAD' },
        { type: 'Message', id: 'USERS' },
      ],
    }),
    likeMessage: build.mutation({
      query: (messageId) => ({ url: `/message/like/${messageId}`, method: 'PATCH' }),
      invalidatesTags: (result, error, messageId) => [{ type: 'Message', id: messageId }],
    }),
    deleteMessage: build.mutation({
      query: ({ id }) => ({ url: `/message/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { id, targetUserId, currentUserId }) => [
        { type: 'Message', id },
        { type: 'Message', id: `CONVERSATION-${targetUserId}` },
        { type: 'Message', id: `BY-USER-${currentUserId}` },
        { type: 'Message', id: 'USERS' },
      ],
    }),
    deleteMessageForMe: build.mutation({
      query: ({ id }) => ({ url: `/message/deleteFor/${id}`, method: 'PATCH' }),
      invalidatesTags: (result, error, { id, targetUserId, currentUserId }) => [
        { type: 'Message', id },
        { type: 'Message', id: `CONVERSATION-${targetUserId}` },
        { type: 'Message', id: `BY-USER-${currentUserId}` },
        { type: 'Message', id: 'USERS' },
      ],
    }),
  }),
});

export const {
  useGetConversationUsersQuery,
  useGetMessagesQuery,
  useGetMessagesByUserQuery,
  useGetUnreadMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  useLikeMessageMutation,
  useDeleteMessageMutation,
  useDeleteMessageForMeMutation,
} = messagesApi;
