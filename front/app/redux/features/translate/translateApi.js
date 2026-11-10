import { baseApi } from '../../api/baseApi';

export const translateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    translate: builder.mutation({
      query: ({ text, targetLang }) => ({
        url: '/translate',
        method: 'POST',
        body: { text, targetLang },
      }),
    }),
  }),
});

export const { useTranslateMutation } = translateApi;
