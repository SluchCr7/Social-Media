import { baseApi } from '../../api/baseApi';

const updateReelInPageCache = (draft, reelId, update) => {
  for (const page of draft?.pages || []) {
    const reels = page?.reels || [];
    const index = reels.findIndex((reel) => String(reel?._id) === String(reelId));
    if (index !== -1) reels[index] = update(reels[index]);
  }
};

export const updateReelCache = (dispatch, getState, reelId, update) => {
  const entries = baseApi.util.selectInvalidatedBy(getState(), [{ type: 'Reel', id: reelId }]);
  entries.forEach(({ endpointName, originalArgs }) => {
    dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
      updateReelInPageCache(draft, reelId, update);
    }));
  });
};

export const reelsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReels: build.infiniteQuery({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
          lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      },
      query: ({ pageParam }) => `/reel?page=${pageParam}&limit=10`,
      providesTags: (result) => [
        { type: 'Reel', id: 'LIST' },
        ...(result?.pages || []).flatMap((page) =>
          (page?.reels || []).filter((reel) => reel?._id)
            .map((reel) => ({ type: 'Reel', id: reel._id }))
        ),
      ],
    }),
    createReel: build.mutation({
      query: (formData) => ({ url: '/reel', method: 'POST', body: formData }),
      invalidatesTags: [{ type: 'Reel', id: 'LIST' }],
    }),
    deleteReel: build.mutation({
      query: (id) => ({ url: `/reel/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Reel', id },
        { type: 'Reel', id: 'LIST' },
      ],
    }),
    likeReel: build.mutation({
      query: (id) => ({ url: `/reel/like/${id}`, method: 'PUT' }),
      invalidatesTags: (result, error, id) => [{ type: 'Reel', id }],
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const userId = getState().auth?.user?._id;
        if (!userId) return;
        const entries = baseApi.util.selectInvalidatedBy(getState(), [{ type: 'Reel', id }]);
        const patches = entries.map(({ endpointName, originalArgs }) =>
          dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
            updateReelInPageCache(draft, id, (reel) => {
              const likes = reel.likes || [];
              const isLiked = likes.some((like) =>
                String(like?._id || like) === String(userId)
              );
              return {
                ...reel,
                likes: isLiked
                  ? likes.filter((like) => String(like?._id || like) !== String(userId))
                  : [...likes, userId],
              };
            });
          }))
        );
        try {
          const { data } = await queryFulfilled;
          if (data?._id) updateReelCache(dispatch, getState, id, (reel) => ({ ...reel, ...data }));
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
    viewReel: build.mutation({
      query: (id) => ({ url: `/reel/view/${id}`, method: 'PUT' }),
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          updateReelCache(dispatch, getState, id, (reel) => ({ ...reel, ...data }));
        } catch {
          // A failed view request does not alter the cached reel.
        }
      },
    }),
    shareReel: build.mutation({
      query: (id) => ({ url: `/reel/share/${id}`, method: 'POST' }),
      invalidatesTags: [{ type: 'Reel', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetReelsInfiniteQuery,
  useCreateReelMutation,
  useDeleteReelMutation,
  useLikeReelMutation,
  useViewReelMutation,
  useShareReelMutation,
} = reelsApi;
