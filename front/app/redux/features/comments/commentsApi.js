import { baseApi } from '../../api/baseApi';

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByTarget: builder.query({
      query: ({ targetType, targetId }) => `/comment/${targetType}/${targetId}`,
      providesTags: (result, error, { targetId }) => [{ type: 'Comment', id: `TARGET_${targetId}` }],
    }),
    getRepliesForComment: builder.query({
      query: (commentId) => `/comment/${commentId}/replies`,
      providesTags: (result, error, commentId) => [{ type: 'Comment', id: `REPLIES_${commentId}` }],
    }),
    addComment: builder.mutation({
      query: (data) => ({
        url: '/comment',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Comment', 'Post'],
    }),
    updateComment: builder.mutation({
      query: ({ commentId, text }) => ({
        url: `/comment/update/${commentId}`,
        method: 'PUT',
        body: { text },
      }),
      invalidatesTags: (result, error, { commentId }) => [{ type: 'Comment', id: commentId }],
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comment/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, commentId) => [{ type: 'Comment', id: commentId }, 'Post'],
    }),
    likeComment: builder.mutation({
      query: (commentId) => ({
        url: `/comment/like/${commentId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, commentId) => [{ type: 'Comment', id: commentId }],
    }),
  }),
});

export const {
  useGetCommentsByTargetQuery,
  useLazyGetCommentsByTargetQuery,
  useGetRepliesForCommentQuery,
  useLazyGetRepliesForCommentQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} = commentsApi;
