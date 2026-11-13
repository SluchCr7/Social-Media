import { baseApi } from '../../api/baseApi';

const postListTags = (result) => {
  const posts = result?.pages
    ? result.pages.flatMap((page) => page?.posts || [])
    : result?.posts || [];
  return [
    { type: 'Post', id: 'LIST' },
    ...posts.filter((post) => post?._id).map((post) => ({ type: 'Post', id: post._id })),
  ];
};

const updatePostInResult = (draft, postId, update) => {
  const updateList = (posts) => {
    if (!Array.isArray(posts)) return;
    const index = posts.findIndex((post) => String(post?._id) === String(postId));
    if (index !== -1) posts[index] = update(posts[index]);
  };

  if (Array.isArray(draft?.pages)) {
    draft.pages.forEach((page) => updateList(page?.posts));
  } else if (Array.isArray(draft?.posts)) {
    updateList(draft.posts);
  } else if (Array.isArray(draft)) {
    updateList(draft);
  } else if (String(draft?._id) === String(postId)) {
    Object.assign(draft, update(draft));
  }
};

const patchPostCaches = (dispatch, getState, postId, update) => {
  const entries = baseApi.util.selectInvalidatedBy(getState(), [{ type: 'Post', id: postId }]);
  entries.forEach(({ endpointName, originalArgs }) => {
    dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
      updatePostInResult(draft, postId, update);
    }));
  });
};

const buildInfinitePostsQuery = (url, paramsForArg = () => ({})) => ({
  query: ({ pageParam, queryArg }) => ({
    url: typeof url === 'function' ? url(queryArg) : url,
    params: { ...paramsForArg(queryArg), page: pageParam, limit: queryArg.limit || 10 },
  }),
  infiniteQueryOptions: {
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage?.page) || 1;
      const totalPages = Number(lastPage?.pages) || 0;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  },
  providesTags: postListTags,
});

export const postsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.infiniteQuery(buildInfinitePostsQuery('/post', (arg) => ({
      viewerId: arg.viewerId,
    }))),
    getVideoPosts: build.infiniteQuery(buildInfinitePostsQuery('/post/videos', (arg) => ({
      viewerId: arg.viewerId,
    }))),
    getCommunityPosts: build.infiniteQuery(buildInfinitePostsQuery(
      ({ communityId }) => `/post/community/${communityId}`,
      (arg) => ({ viewerId: arg.viewerId })
    )),
    getUserPosts: build.infiniteQuery(buildInfinitePostsQuery(
      ({ userId }) => `/post/user/${userId}`,
      (arg) => ({ viewerId: arg.viewerId })
    )),
    getMemories: build.query({
      query: () => '/post/memories',
      providesTags: (result) => [
        { type: 'Post', id: 'MEMORIES' },
        ...(Array.isArray(result) ? result.filter((post) => post?._id).map((post) => ({ type: 'Post', id: post._id })) : []),
      ],
    }),
    getPostById: build.query({
      query: (id) => `/post/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    addPost: build.mutation({
      query: (formData) => ({ url: '/post/add', method: 'POST', body: formData }),
      invalidatesTags: [
        { type: 'Post', id: 'LIST' },
        { type: 'Search', id: 'RESULTS' },
      ],
    }),
    editPost: build.mutation({
      query: ({ id, formData }) => ({ url: `/post/edit/${id}`, method: 'PUT', body: formData }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
        { type: 'Search', id: 'RESULTS' },
      ],
    }),
    deletePost: build.mutation({
      query: (id) => ({ url: `/post/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
        { type: 'Search', id: 'RESULTS' },
      ],
    }),
    likePost: build.mutation({
      query: (id) => ({ url: `/post/like/${id}`, method: 'PUT', body: {} }),
      invalidatesTags: (result, error, id) => [
        { type: 'Post', id },
        { type: 'Search', id: 'RESULTS' },
      ],
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const userId = getState().auth?.user?._id;
        if (!userId) return;
        const patches = [];
        const entries = baseApi.util.selectInvalidatedBy(getState(), [{ type: 'Post', id }]);
        entries.forEach(({ endpointName, originalArgs }) => {
          patches.push(dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
            updatePostInResult(draft, id, (post) => {
              if (post.hahas?.some((user) => String(user?._id || user) === String(userId))) return post;
              const likes = post.likes || [];
              const isLiked = likes.some((user) => String(user?._id || user) === String(userId));
              return {
                ...post,
                likes: isLiked
                  ? likes.filter((user) => String(user?._id || user) !== String(userId))
                  : [...likes, userId],
              };
            });
          })));
        });
        try {
          const { data } = await queryFulfilled;
          const updatedPost = data?.post || data;
          if (updatedPost?._id) {
            patchPostCaches(dispatch, getState, id, (post) => ({ ...post, ...updatedPost }));
          }
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
    hahaPost: build.mutation({
      query: (id) => ({ url: `/post/haha/${id}`, method: 'PUT', body: {} }),
      invalidatesTags: (result, error, id) => [
        { type: 'Post', id },
        { type: 'Search', id: 'RESULTS' },
      ],
    }),
    savePost: build.mutation({
      query: (id) => ({ url: `/post/save/${id}`, method: 'PUT', body: {} }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const userId = getState().auth?.user?._id;
        if (!userId) return;
        const patches = [];
        const entries = baseApi.util.selectInvalidatedBy(getState(), [{ type: 'Post', id }]);
        entries.forEach(({ endpointName, originalArgs }) => {
          patches.push(dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
            updatePostInResult(draft, id, (post) => {
              const saved = post.saved || [];
              const isSaved = saved.some((user) => String(user?._id || user) === String(userId));
              return {
                ...post,
                saved: isSaved
                  ? saved.filter((user) => String(user?._id || user) !== String(userId))
                  : [...saved, userId],
              };
            });
          })));
        });
        try {
          const { data } = await queryFulfilled;
          const updatedPost = data?.post || data;
          if (updatedPost?._id) {
            patchPostCaches(dispatch, getState, id, (post) => ({ ...post, ...updatedPost }));
          }
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
    sharePost: build.mutation({
      query: ({ id, customText }) => ({
        url: `/post/share/${id}`,
        method: 'POST',
        body: { customText },
      }),
      invalidatesTags: [
        { type: 'Post', id: 'LIST' },
        { type: 'Search', id: 'RESULTS' },
      ],
    }),
    viewPost: build.mutation({
      query: (id) => ({ url: `/post/view/${id}`, method: 'PUT', body: {} }),
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?._id) {
            patchPostCaches(dispatch, getState, id, (post) => ({ ...post, ...data }));
          }
        } catch {
          // The caller handles view failures without interrupting post display.
        }
      },
    }),
  }),
});

export const {
  useGetPostsInfiniteQuery,
  useGetVideoPostsInfiniteQuery,
  useGetCommunityPostsInfiniteQuery,
  useGetUserPostsInfiniteQuery,
  useGetMemoriesQuery,
  useGetPostByIdQuery,
  useLazyGetPostByIdQuery,
  useAddPostMutation,
  useEditPostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useHahaPostMutation,
  useSavePostMutation,
  useSharePostMutation,
  useViewPostMutation,
} = postsApi;
