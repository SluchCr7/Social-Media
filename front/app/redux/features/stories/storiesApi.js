import { baseApi } from '../../api/baseApi';

export const storiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStories: builder.query({
      query: () => '/story',
      providesTags: ['Story'],
    }),
    createStory: builder.mutation({
      query: (formData) => ({
        url: '/story/add',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Story'],
    }),
    deleteStory: builder.mutation({
      query: (id) => ({
        url: `/story/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Story', id }, 'Story'],
    }),
    viewStory: builder.mutation({
      query: (storyId) => ({
        url: `/story/view/${storyId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, storyId) => [{ type: 'Story', id: storyId }],
    }),
    toggleLoveStory: builder.mutation({
      query: (storyId) => ({
        url: `/story/love/${storyId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, storyId) => [{ type: 'Story', id: storyId }],
    }),
    reactToStory: builder.mutation({
      query: ({ storyId, emoji }) => ({
        url: `/story/react/${storyId}`,
        method: 'POST',
        body: { emoji },
      }),
      invalidatesTags: (result, error, { storyId }) => [{ type: 'Story', id: storyId }],
    }),
    getStoryViewers: builder.query({
      query: (storyId) => `/story/viewers/${storyId}`,
      providesTags: (result, error, storyId) => [{ type: 'Story', id: `VIEWERS_${storyId}` }],
    }),
    shareStory: builder.mutation({
      query: (id) => ({
        url: `/story/share/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Story'],
    }),
    getUserStories: builder.query({
      query: (userId) => `/story/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Story', id: `USER_${userId}` }],
    }),
    getArchivedStories: builder.query({
      query: (userId) => `/story/user/${userId}/archive`,
      providesTags: (result, error, userId) => [{ type: 'Story', id: `ARCHIVE_${userId}` }],
    }),
  }),
});

export const {
  useGetStoriesQuery,
  useLazyGetStoriesQuery,
  useCreateStoryMutation,
  useDeleteStoryMutation,
  useViewStoryMutation,
  useToggleLoveStoryMutation,
  useReactToStoryMutation,
  useGetStoryViewersQuery,
  useLazyGetStoryViewersQuery,
  useShareStoryMutation,
  useGetUserStoriesQuery,
  useLazyGetUserStoriesQuery,
  useGetArchivedStoriesQuery,
  useLazyGetArchivedStoriesQuery,
} = storiesApi;
