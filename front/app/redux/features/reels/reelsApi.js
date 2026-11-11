import { baseApi } from '../../api/baseApi';

export const reelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReels: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/reel',
        params: { page, limit },
      }),
      providesTags: (result) =>
        result?.reels && Array.isArray(result.reels)
          ? [...result.reels.map(({ _id }) => ({ type: 'Reel', id: _id })), { type: 'Reel', id: 'FEED' }]
          : [{ type: 'Reel', id: 'FEED' }],
    }),
    uploadReel: builder.mutation({
      query: (formData) => ({
        url: '/reel',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Reel', id: 'FEED' }],
    }),
    deleteReel: builder.mutation({
      query: (id) => ({
        url: `/reel/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Reel', id }, { type: 'Reel', id: 'FEED' }],
    }),
    likeReel: builder.mutation({
      query: (id) => ({
        url: `/reel/like/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Reel', id }],
    }),
    viewReel: builder.mutation({
      query: (id) => ({
        url: `/reel/view/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Reel', id }],
    }),
    shareReel: builder.mutation({
      query: (id) => ({
        url: `/reel/share/${id}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Reel', id: 'FEED' }],
    }),
  }),
});

export const {
  useGetReelsQuery,
  useLazyGetReelsQuery,
  useUploadReelMutation,
  useDeleteReelMutation,
  useLikeReelMutation,
  useViewReelMutation,
  useShareReelMutation,
} = reelsApi;
