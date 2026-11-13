import { baseApi } from '../../api/baseApi';
import { normalizeMusicItem, normalizeMusicList } from './musicSlice';

const musicTags = (items) => [
  ...(Array.isArray(items) ? items.filter((music) => music?._id)
    .map((music) => ({ type: 'Music', id: music._id })) : []),
];

export const musicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMusic: build.infiniteQuery({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
          lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      },
      query: ({ queryArg, pageParam }) => ({
        url: '/music',
        params: { page: pageParam, limit: 12, genre: queryArg.genre },
      }),
      transformResponse: (response) => ({
        ...response,
        music: normalizeMusicList(response?.music),
      }),
      providesTags: (result) => [
        { type: 'Music', id: 'LIST' },
        ...(result?.pages || []).flatMap((page) => musicTags(page?.music)),
      ],
    }),
    searchMusic: build.query({
      query: ({ query }) => ({ url: '/music/search', params: { q: query } }),
      transformResponse: (response) => normalizeMusicList(response),
      providesTags: (result, error, { query }) => [
        { type: 'Music', id: 'SEARCH' },
        { type: 'Music', id: `SEARCH-${query.toLowerCase()}` },
        ...musicTags(result),
      ],
    }),
    getTopMusicCharts: build.query({
      query: () => '/music/top-charts',
      transformResponse: (response) => ({
        trending: normalizeMusicList(response?.trending),
        popular: normalizeMusicList(response?.popular),
      }),
      providesTags: (result) => [
        { type: 'Music', id: 'TOP_CHARTS' },
        ...musicTags(result?.trending),
        ...musicTags(result?.popular),
      ],
    }),
    uploadMusic: build.mutation({
      query: (formData) => ({ url: '/music', method: 'POST', body: formData }),
      transformResponse: (response) => normalizeMusicItem(response),
      invalidatesTags: [
        { type: 'Music', id: 'LIST' },
        { type: 'Music', id: 'TOP_CHARTS' },
        { type: 'Music', id: 'SEARCH' },
      ],
    }),
    deleteMusic: build.mutation({
      query: (id) => ({ url: `/music/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Music', id },
        { type: 'Music', id: 'LIST' },
        { type: 'Music', id: 'TOP_CHARTS' },
        { type: 'Music', id: 'SEARCH' },
      ],
    }),
    likeMusic: build.mutation({
      query: (id) => ({ url: `/music/like/${id}`, method: 'PUT' }),
      transformResponse: (response) => normalizeMusicItem(response?.music),
      invalidatesTags: (result, error, id) => [
        { type: 'Music', id },
        { type: 'Music', id: 'LIST' },
        { type: 'Music', id: 'TOP_CHARTS' },
        { type: 'Music', id: 'SEARCH' },
      ],
    }),
    viewMusic: build.mutation({
      query: (id) => ({ url: `/music/view/${id}`, method: 'PUT' }),
      transformResponse: (response) => normalizeMusicItem(response),
      invalidatesTags: (result, error, id) => [{ type: 'Music', id }],
    }),
    addMusicListen: build.mutation({
      query: (id) => ({ url: `/music/listen/${id}`, method: 'POST' }),
      transformResponse: (response) => normalizeMusicItem(response),
      invalidatesTags: (result, error, id) => [
        { type: 'Music', id },
        { type: 'Music', id: 'TOP_CHARTS' },
      ],
    }),
    shareMusicAsPost: build.mutation({
      query: ({ musicId, customText }) => ({
        url: `/music/share/${musicId}`,
        method: 'POST',
        body: { customText },
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMusicInfiniteQuery,
  useSearchMusicQuery,
  useGetTopMusicChartsQuery,
  useUploadMusicMutation,
  useDeleteMusicMutation,
  useLikeMusicMutation,
  useViewMusicMutation,
  useAddMusicListenMutation,
  useShareMusicAsPostMutation,
} = musicApi;
