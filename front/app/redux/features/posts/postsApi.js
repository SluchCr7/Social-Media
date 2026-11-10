import { baseApi } from '../../api/baseApi';

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => `/post?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.posts && Array.isArray(result.posts)
          ? [...result.posts.map(({ _id }) => ({ type: 'Post', id: _id })), { type: 'Post', id: 'FEED' }]
          : [{ type: 'Post', id: 'FEED' }],
    }),
    getUserPosts: builder.query({
      query: ({ userId, page = 1, limit = 5 }) => `/post/user/${userId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { userId }) => [{ type: 'Post', id: `USER_${userId}` }],
    }),
    getPostById: builder.query({
      query: (id) => `/post/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    getMemories: builder.query({
      query: () => '/post/memories',
      providesTags: [{ type: 'Post', id: 'MEMORIES' }],
    }),
    createPost: builder.mutation({
      query: (formData) => ({
        url: '/post/add',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Post', id: 'FEED' }],
    }),
    editPost: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/post/edit/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }, { type: 'Post', id: 'FEED' }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/post/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }, { type: 'Post', id: 'FEED' }],
    }),
    likePost: builder.mutation({
      query: (postId) => ({
        url: `/post/like/${postId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, postId) => [{ type: 'Post', id: postId }],
    }),
    hahaPost: builder.mutation({
      query: (postId) => ({
        url: `/post/haha/${postId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, postId) => [{ type: 'Post', id: postId }],
    }),
    savePost: builder.mutation({
      query: (postId) => ({
        url: `/post/save/${postId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, postId) => [{ type: 'Post', id: postId }],
    }),
    viewPost: builder.mutation({
      query: (postId) => ({
        url: `/post/view/${postId}`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useLazyGetPostsQuery,
  useGetUserPostsQuery,
  useLazyGetUserPostsQuery,
  useGetPostByIdQuery,
  useLazyGetPostByIdQuery,
  useGetMemoriesQuery,
  useLazyGetMemoriesQuery,
  useCreatePostMutation,
  useEditPostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useHahaPostMutation,
  useSavePostMutation,
  useViewPostMutation,
} = postsApi;
