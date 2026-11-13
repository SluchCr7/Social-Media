import { baseApi } from '../../api/baseApi';

const EMPTY_RESULTS = {
  users: [],
  posts: [],
  communities: [],
  hashtags: [],
  pagination: {},
};

const resultTypes = ['users', 'posts', 'communities', 'hashtags'];
const searchResultsTags = (result) => [
  { type: 'Search', id: 'RESULTS' },
  { type: 'Post', id: 'LIST' },
  ...(result?.posts || []).filter((post) => post?._id)
    .map((post) => ({ type: 'Post', id: post._id })),
];

export const searchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSearchResults: build.query({
      query: ({ q, type, page, sortBy, dateRange, hasMedia, verifiedOnly }) => ({
        url: '/search',
        params: {
          q,
          type,
          page,
          limit: 12,
          sortBy,
          dateRange,
          hasMedia: String(Boolean(hasMedia)),
          verifiedOnly: String(Boolean(verifiedOnly)),
        },
      }),
      serializeQueryArgs: ({ queryArgs }) => JSON.stringify({
        q: queryArgs.q,
        sortBy: queryArgs.sortBy,
        dateRange: queryArgs.dateRange,
        hasMedia: queryArgs.hasMedia,
        verifiedOnly: queryArgs.verifiedOnly,
        viewerId: queryArgs.viewerId,
      }),
      merge(currentCache, incoming, { arg }) {
        const types = arg.type === 'all' ? resultTypes : [arg.type];
        if (arg.page === 1 && arg.type === 'all') {
          Object.assign(currentCache, incoming);
          return;
        }
        if (!currentCache.pagination) currentCache.pagination = {};
        types.forEach((type) => {
          const incomingItems = Array.isArray(incoming[type]) ? incoming[type] : [];
          if (arg.page === 1) {
            currentCache[type] = incomingItems;
          } else {
            const existing = currentCache[type] || [];
            const ids = new Set(existing.map((item) => String(item?._id || item?.name || item)));
            currentCache[type] = [
              ...existing,
              ...incomingItems.filter((item) => !ids.has(String(item?._id || item?.name || item))),
            ];
          }
          if (incoming.pagination?.[type]) {
            currentCache.pagination[type] = incoming.pagination[type];
          }
        });
      },
      providesTags: searchResultsTags,
    }),
    getExploreContent: build.infiniteQuery({
      query: ({ queryArg, pageParam }) => ({
        url: '/search/explore',
        params: { tab: queryArg.tab, page: pageParam, limit: queryArg.limit || 12 },
      }),
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.pagination?.hasMore
          ? (Number(lastPage.pagination.page) || 1) + 1
          : undefined,
      },
      providesTags: (result, error, { tab }) => [
        { type: 'Explore', id: tab },
        { type: 'Post', id: 'LIST' },
        ...(result?.pages || []).flatMap((page) =>
          (page?.posts || []).filter((post) => post?._id)
            .map((post) => ({ type: 'Post', id: post._id }))
        ),
      ],
    }),
    getTrending: build.query({
      query: () => '/search/trending',
      providesTags: [{ type: 'Explore', id: 'TRENDING' }, { type: 'Post', id: 'LIST' }],
    }),
    getSearchHistory: build.query({
      query: () => '/search/history',
      providesTags: (result, error, { userId }) => [{ type: 'Search', id: `HISTORY-${userId}` }],
    }),
    addSearchHistory: build.mutation({
      query: ({ userId, ...body }) => ({ url: '/search/history', method: 'POST', body }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Search', id: `HISTORY-${userId}` }],
    }),
    clearSearchHistory: build.mutation({
      query: ({ id } = {}) => ({
        url: '/search/history',
        method: 'DELETE',
        ...(id ? { params: { id } } : {}),
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Search', id: `HISTORY-${userId}` }],
    }),
  }),
});

export const {
  useGetSearchResultsQuery,
  useLazyGetSearchResultsQuery,
  useGetExploreContentInfiniteQuery,
  useGetTrendingQuery,
  useGetSearchHistoryQuery,
  useAddSearchHistoryMutation,
  useClearSearchHistoryMutation,
} = searchApi;

export { EMPTY_RESULTS };
