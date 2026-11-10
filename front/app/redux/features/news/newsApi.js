import { baseApi } from '../../api/baseApi';

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query({
      query: (params = {}) => ({
        url: '/news',
        params,
      }),
      providesTags: ['News'],
    }),
  }),
});

export const { useGetNewsQuery, useLazyGetNewsQuery } = newsApi;
