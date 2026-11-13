import { baseApi } from '../../api/baseApi';

const highlightTags = (result, userId) => [
  { type: 'Highlight', id: 'LIST' },
  { type: 'Highlight', id: `USER-${userId}` },
  ...(Array.isArray(result) ? result.filter((highlight) => highlight?._id)
    .map((highlight) => ({ type: 'Highlight', id: highlight._id })) : []),
];

export const highlightsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserHighlights: build.query({
      query: ({ userId }) => `/highlight/user/${userId}`,
      providesTags: (result, error, { userId }) => highlightTags(result, userId),
    }),
    getHighlightById: build.query({
      query: (id) => `/highlight/${id}`,
      providesTags: (result, error, id) => [{ type: 'Highlight', id }],
    }),
    createHighlight: build.mutation({
      query: (formData) => ({ url: '/highlight', method: 'POST', body: formData }),
      invalidatesTags: [{ type: 'Highlight', id: 'LIST' }],
    }),
    deleteHighlight: build.mutation({
      query: (id) => ({ url: `/highlight/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Highlight', id },
        { type: 'Highlight', id: 'LIST' },
      ],
    }),
    addStoryToHighlight: build.mutation({
      query: ({ id, payload }) => ({
        url: `/highlight/${id}/stories`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Highlight', id },
        { type: 'Highlight', id: 'LIST' },
      ],
    }),
    updateHighlight: build.mutation({
      query: ({ id, formData }) => ({
        url: `/highlight/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Highlight', id },
        { type: 'Highlight', id: 'LIST' },
      ],
    }),
    removeStoryFromHighlight: build.mutation({
      query: ({ highlightId, storyId }) => ({
        url: `/highlight/${highlightId}/stories/${storyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { highlightId }) => [
        { type: 'Highlight', id: highlightId },
        { type: 'Highlight', id: 'LIST' },
      ],
    }),
    reorderStoriesInHighlight: build.mutation({
      query: ({ highlightId, storyIds }) => ({
        url: `/highlight/${highlightId}/reorder-stories`,
        method: 'PATCH',
        body: { storyIds },
      }),
      invalidatesTags: (result, error, { highlightId }) => [
        { type: 'Highlight', id: highlightId },
        { type: 'Highlight', id: 'LIST' },
      ],
    }),
    reorderHighlights: build.mutation({
      query: (highlightIds) => ({
        url: '/highlight/reorder',
        method: 'POST',
        body: { highlightIds },
      }),
      invalidatesTags: [{ type: 'Highlight', id: 'LIST' }],
      async onQueryStarted(highlightIds, { dispatch, getState, queryFulfilled }) {
        const order = new Map(highlightIds.map((id, index) => [String(id), index]));
        const entries = baseApi.util.selectInvalidatedBy(getState(), [
          { type: 'Highlight', id: 'LIST' },
        ]);
        const patches = entries.map(({ endpointName, originalArgs }) =>
          dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
            if (Array.isArray(draft)) {
              draft.sort((a, b) =>
                (order.get(String(a._id)) ?? Number.MAX_SAFE_INTEGER) -
                (order.get(String(b._id)) ?? Number.MAX_SAFE_INTEGER)
              );
            }
          }))
        );
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
  }),
});

export const {
  useGetUserHighlightsQuery,
  useLazyGetUserHighlightsQuery,
  useGetHighlightByIdQuery,
  useCreateHighlightMutation,
  useDeleteHighlightMutation,
  useAddStoryToHighlightMutation,
  useUpdateHighlightMutation,
  useRemoveStoryFromHighlightMutation,
  useReorderStoriesInHighlightMutation,
  useReorderHighlightsMutation,
} = highlightsApi;
