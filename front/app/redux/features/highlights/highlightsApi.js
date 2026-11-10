import { baseApi } from '../../api/baseApi';

export const highlightsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserHighlights: builder.query({
      query: (userId) => `/highlight/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Highlight', id: `USER_${userId}` }],
    }),
    createHighlight: builder.mutation({
      query: (formData) => ({
        url: '/highlight',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Highlight'],
    }),
    deleteHighlight: builder.mutation({
      query: (id) => ({
        url: `/highlight/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Highlight', id }, 'Highlight'],
    }),
    updateHighlight: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/highlight/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Highlight', id }],
    }),
    addStoryToHighlight: builder.mutation({
      query: ({ highlightId, payload }) => ({
        url: `/highlight/${highlightId}/stories`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (result, error, { highlightId }) => [{ type: 'Highlight', id: highlightId }],
    }),
    removeStoryFromHighlight: builder.mutation({
      query: ({ highlightId, storyId }) => ({
        url: `/highlight/${highlightId}/stories/${storyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { highlightId }) => [{ type: 'Highlight', id: highlightId }],
    }),
    reorderStoriesInHighlight: builder.mutation({
      query: ({ highlightId, storyIds }) => ({
        url: `/highlight/${highlightId}/reorder-stories`,
        method: 'PATCH',
        body: { storyIds },
      }),
      invalidatesTags: (result, error, { highlightId }) => [{ type: 'Highlight', id: highlightId }],
    }),
    reorderHighlights: builder.mutation({
      query: ({ highlightIds }) => ({
        url: '/highlight/reorder',
        method: 'POST',
        body: { highlightIds },
      }),
      invalidatesTags: ['Highlight'],
    }),
  }),
});

export const {
  useGetUserHighlightsQuery,
  useLazyGetUserHighlightsQuery,
  useCreateHighlightMutation,
  useDeleteHighlightMutation,
  useUpdateHighlightMutation,
  useAddStoryToHighlightMutation,
  useRemoveStoryFromHighlightMutation,
  useReorderStoriesInHighlightMutation,
  useReorderHighlightsMutation,
} = highlightsApi;
