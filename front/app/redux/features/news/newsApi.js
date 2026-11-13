import { baseApi } from '../../api/baseApi';

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query({
      query: (params = {}) => ({
        url: '/news',
        params,
      }),
      transformResponse: (response) => response?.articles || [],
      providesTags: ['News'],
    }),
  }),
});

export const { useGetNewsQuery } = newsApi;
