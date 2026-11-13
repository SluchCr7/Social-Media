import { baseApi } from '../../api/baseApi';

const communityListTags = (result) => [
  { type: 'Community', id: 'LIST' },
  ...(Array.isArray(result) ? result.filter((community) => community?._id)
    .map((community) => ({ type: 'Community', id: community._id })) : []),
];

const communityMutationTags = (id) => [
  ...(id ? [{ type: 'Community', id }] : []),
  { type: 'Community', id: 'LIST' },
];

export const communitiesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCommunities: build.query({
      query: () => '/community',
      providesTags: communityListTags,
    }),
    getCommunitiesByCategory: build.query({
      query: ({ category }) => `/community/category/${encodeURIComponent(category)}`,
      providesTags: communityListTags,
    }),
    getCommunityById: build.query({
      query: ({ id }) => `/community/${id}`,
      transformResponse: (data) => data?.community || data,
      providesTags: (result, error, { id }) => [{ type: 'Community', id }],
    }),
    addCommunity: build.mutation({
      query: (body) => ({ url: '/community/add', method: 'POST', body }),
      invalidatesTags: [{ type: 'Community', id: 'LIST' }],
    }),
    deleteCommunity: build.mutation({
      query: (id) => ({ url: `/community/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => communityMutationTags(id),
    }),
    joinCommunity: build.mutation({
      query: (id) => ({ url: `/community/join/${id}`, method: 'PUT' }),
      invalidatesTags: (result, error, id) => communityMutationTags(id),
    }),
    sendCommunityJoinRequest: build.mutation({
      query: (id) => ({ url: `/community/join-request/${id}`, method: 'POST' }),
      invalidatesTags: (result, error, id) => communityMutationTags(id),
    }),
    approveCommunityJoinRequest: build.mutation({
      query: ({ communityId, userId }) => ({
        url: `/community/join-request/approve/${communityId}/${userId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { communityId }) => communityMutationTags(communityId),
    }),
    rejectCommunityJoinRequest: build.mutation({
      query: ({ communityId, userId }) => ({
        url: `/community/join-request/reject/${communityId}/${userId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { communityId }) => communityMutationTags(communityId),
    }),
    editCommunity: build.mutation({
      query: ({ id, body }) => ({ url: `/community/edit/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => communityMutationTags(id),
    }),
    updateCommunityPicture: build.mutation({
      query: ({ id, body }) => ({ url: `/community/update/${id}`, method: 'POST', body }),
      invalidatesTags: (result, error, { id }) => communityMutationTags(id),
    }),
    updateCommunityCover: build.mutation({
      query: ({ id, body }) => ({ url: `/community/update-cover/${id}`, method: 'POST', body }),
      invalidatesTags: (result, error, { id }) => communityMutationTags(id),
    }),
    removeCommunityMember: build.mutation({
      query: ({ communityId, userId }) => ({
        url: `/community/remove/${communityId}/${userId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { communityId }) => communityMutationTags(communityId),
    }),
    toggleCommunityAdmin: build.mutation({
      query: ({ communityId, userIdToMakeAdmin }) => ({
        url: `/community/admin/${communityId}`,
        method: 'PUT',
        body: { userIdToMakeAdmin },
      }),
      invalidatesTags: (result, error, { communityId }) => communityMutationTags(communityId),
    }),
    updateCommunityRules: build.mutation({
      query: ({ id, rules }) => ({
        url: `/community/rules/${id}`,
        method: 'PUT',
        body: { rules },
      }),
      invalidatesTags: (result, error, { id }) => communityMutationTags(id),
    }),
  }),
});

export const {
  useGetCommunitiesQuery,
  useGetCommunitiesByCategoryQuery,
  useGetCommunityByIdQuery,
  useLazyGetCommunityByIdQuery,
  useAddCommunityMutation,
  useDeleteCommunityMutation,
  useJoinCommunityMutation,
  useSendCommunityJoinRequestMutation,
  useApproveCommunityJoinRequestMutation,
  useRejectCommunityJoinRequestMutation,
  useEditCommunityMutation,
  useUpdateCommunityPictureMutation,
  useUpdateCommunityCoverMutation,
  useRemoveCommunityMemberMutation,
  useToggleCommunityAdminMutation,
  useUpdateCommunityRulesMutation,
} = communitiesApi;
