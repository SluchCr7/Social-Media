import { baseApi } from '../../api/baseApi';

const commentTags = (result) => {
  const comments = result?.pages
    ? result.pages.flatMap((page) => page?.comments || [])
    : [];
  return [
    { type: 'Comment', id: 'LIST' },
    ...comments.filter((comment) => comment?._id)
      .map((comment) => ({ type: 'Comment', id: comment._id })),
  ];
};

const updateCommentInResult = (draft, commentId, update) => {
  const updateList = (comments) => {
    if (!Array.isArray(comments)) return;
    comments.forEach((comment, index) => {
      if (String(comment?._id) === String(commentId)) {
        comments[index] = update(comment);
      } else {
        updateList(comment?.replies);
      }
    });
  };

  if (Array.isArray(draft?.pages)) {
    draft.pages.forEach((page) => updateList(page?.comments));
  } else if (Array.isArray(draft?.comments)) {
    updateList(draft.comments);
  }
};

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getComments: build.infiniteQuery({
      query: ({ queryArg, pageParam }) => ({
        url: `/comment/${queryArg.targetType}/${queryArg.targetId}`,
        params: { limit: queryArg.limit || 10, ...(pageParam ? { cursor: pageParam } : {}) },
      }),
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage?.hasMore ? lastPage.nextCursor : undefined,
      },
      providesTags: (result, error, { targetId, targetType }) => [
        { type: 'Comment', id: `target-${targetType}-${targetId}` },
        ...commentTags(result),
      ],
    }),
    getCommentReplies: build.infiniteQuery({
      query: ({ queryArg, pageParam }) => ({
        url: `/comment/${queryArg.commentId}/replies`,
        params: { limit: queryArg.limit || 5, ...(pageParam ? { cursor: pageParam } : {}) },
      }),
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage?.hasMore ? lastPage.nextCursor : undefined,
      },
      providesTags: (result, error, { commentId }) => [
        { type: 'Comment', id: `replies-${commentId}` },
        ...commentTags(result),
      ],
    }),
    addComment: build.mutation({
      query: ({ text, targetType, targetId }) => ({
        url: '/comment',
        method: 'POST',
        body: { text, targetType, targetId },
      }),
      invalidatesTags: (result, error, { targetId, targetType }) => [
        { type: 'Comment', id: `target-${targetType}-${targetId}` },
        { type: 'Comment', id: targetId },
        { type: 'Comment', id: `replies-${targetId}` },
      ],
    }),
    deleteComment: build.mutation({
      query: (id) => ({ url: `/comment/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'LIST' },
      ],
    }),
    updateComment: build.mutation({
      query: ({ id, text }) => ({
        url: `/comment/update/${id}`,
        method: 'PUT',
        body: { text },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Comment', id }],
    }),
    likeComment: build.mutation({
      query: (id) => ({ url: `/comment/like/${id}`, method: 'PUT', body: {} }),
      invalidatesTags: (result, error, id) => [{ type: 'Comment', id }],
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const userId = getState().auth?.user?._id;
        if (!userId) return;
        const entries = baseApi.util.selectInvalidatedBy(getState(), [{ type: 'Comment', id }]);
        const patches = entries.map(({ endpointName, originalArgs }) =>
          dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
            updateCommentInResult(draft, id, (comment) => {
              const likes = comment.likes || [];
              const isLiked = likes.some((user) => String(user?._id || user) === String(userId));
              return {
                ...comment,
                likes: isLiked
                  ? likes.filter((user) => String(user?._id || user) !== String(userId))
                  : [...likes, userId],
              };
            });
          }))
        );
        try {
          const { data } = await queryFulfilled;
          const updated = data?.comment || data;
          if (updated?._id) {
            entries.forEach(({ endpointName, originalArgs }) => {
              dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
                updateCommentInResult(draft, id, (comment) => ({ ...comment, ...updated }));
              }));
            });
          }
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
  }),
});

export const {
  useGetCommentsInfiniteQuery,
  useLazyGetCommentsInfiniteQuery,
  useGetCommentRepliesInfiniteQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useLikeCommentMutation,
} = commentsApi;
