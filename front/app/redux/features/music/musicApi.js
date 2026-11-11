import { baseApi } from '../../api/baseApi';

export const musicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMusicList: builder.query({
      query: ({ page = 1, limit = 12, genre = 'All' } = {}) => ({
        url: '/music',
        params: { page, limit, genre },
      }),
      providesTags: (result) =>
        result?.music && Array.isArray(result.music)
          ? [...result.music.map(({ _id }) => ({ type: 'Music', id: _id })), { type: 'Music', id: 'LIST' }]
          : [{ type: 'Music', id: 'LIST' }],
    }),
    getTopCharts: builder.query({
      query: () => '/music/top-charts',
      providesTags: [{ type: 'Music', id: 'TOP_CHARTS' }],
    }),
    searchMusic: builder.query({
      query: (query) => `/music/search?q=${encodeURIComponent(query)}`,
      providesTags: [{ type: 'Music', id: 'SEARCH' }],
    }),
    uploadMusic: builder.mutation({
      query: (formData) => ({
        url: '/music',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Music', id: 'LIST' }, { type: 'Music', id: 'TOP_CHARTS' }],
    }),
    deleteMusic: builder.mutation({
      query: (id) => ({
        url: `/music/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Music', id },
        { type: 'Music', id: 'LIST' },
        { type: 'Music', id: 'TOP_CHARTS' },
      ],
    }),
    likeMusic: builder.mutation({
      query: (id) => ({
        url: `/music/like/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Music', id }, { type: 'Music', id: 'TOP_CHARTS' }],
    }),
    viewMusic: builder.mutation({
      query: (id) => ({
        url: `/music/view/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Music', id }],
    }),
    addListen: builder.mutation({
      query: (musicId) => ({
        url: `/music/listen/${musicId}`,
        method: 'POST',
      }),
    }),
    shareMusicAsPost: builder.mutation({
      query: ({ musicId, customText = '' }) => ({
        url: `/music/share/${musicId}`,
        method: 'POST',
        body: { customText },
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetMusicListQuery,
  useLazyGetMusicListQuery,
  useGetTopChartsQuery,
  useLazyGetTopChartsQuery,
  useSearchMusicQuery,
  useLazySearchMusicQuery,
  useUploadMusicMutation,
  useDeleteMusicMutation,
  useLikeMusicMutation,
  useViewMusicMutation,
  useAddListenMutation,
  useShareMusicAsPostMutation,
} = musicApi;
