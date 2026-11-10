import { baseApi } from '../../api/baseApi';

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query({
      query: ({ q, type = 'all', sortBy = 'relevance', dateRange = 'all', hasMedia = false, verifiedOnly = false, page = 1, limit = 12 }) =>
        `/search?q=${encodeURIComponent(q)}&type=${type}&sortBy=${sortBy}&dateRange=${dateRange}&hasMedia=${hasMedia}&verifiedOnly=${verifiedOnly}&page=${page}&limit=${limit}`,
      providesTags: ['Search'],
    }),
    getSearchHistory: builder.query({
      query: () => '/search/history',
      providesTags: [{ type: 'Search', id: 'HISTORY' }],
    }),
    addToSearchHistory: builder.mutation({
      query: (body) => ({
        url: '/search/history',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Search', id: 'HISTORY' }],
    }),
    removeFromSearchHistory: builder.mutation({
      query: (id) => ({
        url: `/search/history?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Search', id: 'HISTORY' }],
    }),
    clearSearchHistory: builder.mutation({
      query: () => ({
        url: '/search/history',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Search', id: 'HISTORY' }],
    }),
  }),
});

export const {
  useSearchQuery,
  useLazySearchQuery,
  useGetSearchHistoryQuery,
  useLazyGetSearchHistoryQuery,
  useAddToSearchHistoryMutation,
  useRemoveFromSearchHistoryMutation,
  useClearSearchHistoryMutation,
} = searchApi;
