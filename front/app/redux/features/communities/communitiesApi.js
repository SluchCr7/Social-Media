import { baseApi } from '../../api/baseApi';

export const communitiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommunities: builder.query({
      query: () => '/community',
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [...result.map(({ _id }) => ({ type: 'Community', id: _id })), { type: 'Community', id: 'LIST' }]
          : [{ type: 'Community', id: 'LIST' }],
    }),
    createCommunity: builder.mutation({
      query: (data) => ({
        url: '/community/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Community', id: 'LIST' }],
    }),
    updateCommunity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/community/edit/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Community', id }],
    }),
    deleteCommunity: builder.mutation({
      query: (id) => ({
        url: `/community/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Community', id: 'LIST' }],
    }),
    joinCommunity: builder.mutation({
      query: (id) => ({
        url: `/community/join/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Community', id }],
    }),
    leaveCommunity: builder.mutation({
      query: (id) => ({
        url: `/community/join/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Community', id }],
    }),
    requestJoinCommunity: builder.mutation({
      query: (id) => ({
        url: `/community/join-request/${id}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Community', id }],
    }),
    acceptJoinRequest: builder.mutation({
      query: ({ communityId, userId }) => ({
        url: `/community/join-request/approve/${communityId}/${userId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { communityId }) => [{ type: 'Community', id: communityId }],
    }),
    rejectJoinRequest: builder.mutation({
      query: ({ communityId, userId }) => ({
        url: `/community/join-request/reject/${communityId}/${userId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { communityId }) => [{ type: 'Community', id: communityId }],
    }),
  }),
});

export const {
  useGetCommunitiesQuery,
  useLazyGetCommunitiesQuery,
  useCreateCommunityMutation,
  useUpdateCommunityMutation,
  useDeleteCommunityMutation,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
  useRequestJoinCommunityMutation,
  useAcceptJoinRequestMutation,
  useRejectJoinRequestMutation,
} = communitiesApi;
