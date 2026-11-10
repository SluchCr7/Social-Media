import { baseApi } from '../../api/baseApi';

export const exploreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExploreContent: builder.query({
      query: ({ tabName = 'trending', pageNum = 1, limit = 12 } = {}) =>
        `/search/explore?tab=${tabName}&page=${pageNum}&limit=${limit}`,
      providesTags: (result, error, { tabName }) => [{ type: 'Explore', id: tabName }],
    }),
    getTrending: builder.query({
      query: () => '/search/trending',
      providesTags: [{ type: 'Explore', id: 'TRENDING' }],
    }),
  }),
});

export const {
  useGetExploreContentQuery,
  useLazyGetExploreContentQuery,
  useGetTrendingQuery,
  useLazyGetTrendingQuery,
} = exploreApi;
