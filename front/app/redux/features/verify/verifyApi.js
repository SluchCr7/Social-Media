import { baseApi } from '../../api/baseApi';

export const verifyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyAccount: builder.query({
      query: ({ id, token }) => `/auth/${id}/verify/${token}`,
      providesTags: ['Auth'],
    }),
    resetPassword: builder.mutation({
      query: ({ id, token, password }) => ({
        url: `/password/reset-password/${id}/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),
    forgetEmail: builder.mutation({
      query: (email) => ({
        url: '/password/reset',
        method: 'POST',
        body: { email },
      }),
    }),
  }),
});

export const {
  useVerifyAccountQuery,
  useLazyVerifyAccountQuery,
  useResetPasswordMutation,
  useForgetEmailMutation,
} = verifyApi;
