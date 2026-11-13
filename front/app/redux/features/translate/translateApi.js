import { baseApi } from '../../api/baseApi';

export const translateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    translateText: builder.mutation({
      query: (body) => ({
        url: '/translate',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useTranslateTextMutation } = translateApi;
