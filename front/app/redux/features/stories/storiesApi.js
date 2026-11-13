import { baseApi } from '../../api/baseApi';

const storyTags = (result) => [
  { type: 'Story', id: 'LIST' },
  ...(Array.isArray(result) ? result.filter((story) => story?._id)
    .map((story) => ({ type: 'Story', id: story._id })) : []),
];

const updateStoryResult = (draft, storyId, update) => {
  const updateList = (stories) => {
    if (!Array.isArray(stories)) return;
    const index = stories.findIndex((story) => String(story?._id) === String(storyId));
    if (index !== -1) stories[index] = update(stories[index]);
  };
  if (Array.isArray(draft)) updateList(draft);
  else if (draft?._id && String(draft._id) === String(storyId)) {
    Object.assign(draft, update(draft));
  }
};

const patchStoryCaches = (dispatch, getState, storyId, update) => {
  const entries = baseApi.util.selectInvalidatedBy(getState(), [{ type: 'Story', id: storyId }]);
  entries.forEach(({ endpointName, originalArgs }) => {
    dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
      updateStoryResult(draft, storyId, update);
    }));
  });
};

export const storiesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStories: build.query({
      query: () => '/story',
      providesTags: storyTags,
    }),
    getUserStories: build.query({
      query: ({ userId }) => `/story/user/${userId}`,
      providesTags: storyTags,
    }),
    getArchivedStories: build.query({
      query: ({ userId }) => `/story/user/${userId}/archive`,
      providesTags: storyTags,
    }),
    getStoryViewers: build.query({
      query: (storyId) => `/story/viewers/${storyId}`,
      providesTags: (result, error, storyId) => [{ type: 'Story', id: `VIEWERS-${storyId}` }],
    }),
    addStory: build.mutation({
      query: (formData) => ({ url: '/story/add', method: 'POST', body: formData }),
      invalidatesTags: [{ type: 'Story', id: 'LIST' }],
    }),
    deleteStory: build.mutation({
      query: (storyId) => ({ url: `/story/delete/${storyId}`, method: 'DELETE' }),
      invalidatesTags: (result, error, storyId) => [
        { type: 'Story', id: storyId },
        { type: 'Story', id: 'LIST' },
        { type: 'Highlight', id: 'LIST' },
      ],
    }),
    viewStory: build.mutation({
      query: (storyId) => ({ url: `/story/view/${storyId}`, method: 'POST', body: {} }),
      invalidatesTags: (result, error, storyId) => [{ type: 'Story', id: storyId }],
    }),
    toggleLoveStory: build.mutation({
      query: (storyId) => ({ url: `/story/love/${storyId}`, method: 'POST', body: {} }),
      invalidatesTags: (result, error, storyId) => [{ type: 'Story', id: storyId }],
      async onQueryStarted(storyId, { dispatch, getState, queryFulfilled }) {
        const userId = getState().auth?.user?._id;
        if (!userId) return;
        const entries = baseApi.util.selectInvalidatedBy(getState(), [{ type: 'Story', id: storyId }]);
        const patches = entries.map(({ endpointName, originalArgs }) =>
          dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
            updateStoryResult(draft, storyId, (story) => {
              const loves = story.loves || [];
              const isLoved = loves.some((id) => String(id?._id || id) === String(userId));
              return {
                ...story,
                loves: isLoved
                  ? loves.filter((id) => String(id?._id || id) !== String(userId))
                  : [...loves, userId],
              };
            });
          }))
        );
        try {
          const { data } = await queryFulfilled;
          const story = data?.story || data;
          if (story?._id) patchStoryCaches(dispatch, getState, storyId, (old) => ({ ...old, ...story }));
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
    reactToStory: build.mutation({
      query: ({ storyId, emoji }) => ({
        url: `/story/react/${storyId}`,
        method: 'POST',
        body: { emoji },
      }),
      invalidatesTags: (result, error, { storyId }) => [{ type: 'Story', id: storyId }],
      async onQueryStarted({ storyId, emoji }, { dispatch, getState, queryFulfilled }) {
        const userId = getState().auth?.user?._id;
        if (!userId) return;
        const entries = baseApi.util.selectInvalidatedBy(getState(), [
          { type: 'Story', id: storyId },
        ]);
        const patches = entries.map(({ endpointName, originalArgs }) =>
          dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
            updateStoryResult(draft, storyId, (story) => {
              const reactions = story.reactions || [];
              const index = reactions.findIndex((reaction) =>
                String(reaction.user?._id || reaction.user) === String(userId)
              );
              if (index >= 0) reactions[index] = { ...reactions[index], emoji };
              else reactions.push({ user: userId, emoji, createdAt: new Date().toISOString() });
              return { ...story, reactions };
            });
          }))
        );
        try {
          const { data } = await queryFulfilled;
          const story = data?.story || data;
          if (story?._id) patchStoryCaches(dispatch, getState, storyId, (old) => ({ ...old, ...story }));
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
    shareStory: build.mutation({
      query: (storyId) => ({ url: `/story/share/${storyId}`, method: 'POST', body: {} }),
      invalidatesTags: [{ type: 'Story', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetStoriesQuery,
  useGetUserStoriesQuery,
  useGetArchivedStoriesQuery,
  useGetStoryViewersQuery,
  useLazyGetStoryViewersQuery,
  useAddStoryMutation,
  useDeleteStoryMutation,
  useViewStoryMutation,
  useToggleLoveStoryMutation,
  useReactToStoryMutation,
  useShareStoryMutation,
} = storiesApi;
