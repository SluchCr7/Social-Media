import { baseApi } from '../../api/baseApi';

const userTag = (id) => ({ type: 'User', id });

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id) => `/auth/${id}`,
      providesTags: (result, error, id) => [userTag(result?._id || id)],
    }),
    getPublicUserByUsername: builder.query({
      query: (username) => ({
        url: '/auth/username',
        params: { username },
      }),
      providesTags: (result) => result?._id ? [userTag(result._id)] : [],
    }),
    getSuggestedUsers: builder.query({
      query: () => '/auth/suggested',
      providesTags: (result) =>
        result
          ? [...result.map((user) => userTag(user._id)), userTag('SUGGESTED')]
          : [userTag('SUGGESTED')],
    }),
    getUserPointsHistory: builder.query({
      query: (id) => `/auth/${id}/points/history`,
      providesTags: (result, error, id) => [userTag(id)],
    }),
    getRelationship: builder.query({
      query: (id) => `/auth/relationship/${id}`,
      providesTags: (result, error, id) => [userTag(id)],
    }),
    deleteCurrentUser: builder.mutation({
      query: () => ({ url: '/auth/delete', method: 'DELETE' }),
      invalidatesTags: ['Auth', userTag('SUGGESTED')],
    }),
    followUser: builder.mutation({
      query: ({ targetId }) => ({
        url: `/auth/follow/${targetId}`,
        method: 'PUT',
        body: {},
      }),
      invalidatesTags: (result, error, { targetId, userId }) => [
        userTag(targetId),
        userTag(userId),
        userTag('SUGGESTED'),
      ],
    }),
    uploadProfilePhoto: builder.mutation({
      query: ({ formData }) => ({
        url: '/auth/photo',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { userId }) => [userTag(userId)],
    }),
    uploadCoverPhoto: builder.mutation({
      query: ({ formData }) => ({
        url: '/auth/cover',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { userId }) => [userTag(userId)],
    }),
    updateUserProfile: builder.mutation({
      query: ({ fields }) => ({
        url: '/auth/update',
        method: 'PUT',
        body: fields,
      }),
      invalidatesTags: (result, error, { userId, fields }) => [
        userTag(userId),
        userTag('SUGGESTED'),
        ...(fields.partner ? [userTag(fields.partner)] : []),
      ],
    }),
    updateUserPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/update/pass',
        method: 'PUT',
        body,
      }),
    }),
    togglePrivateAccount: builder.mutation({
      query: () => ({
        url: '/auth/account/private',
        method: 'PUT',
        body: {},
      }),
      invalidatesTags: (result, error, userId) => [userTag(userId), userTag('SUGGESTED')],
    }),
    toggleSongInPlaylist: builder.mutation({
      query: ({ songId }) => ({
        url: `/auth/save/music/${songId}`,
        method: 'PUT',
        body: {},
      }),
      invalidatesTags: (result, error, { userId }) => [userTag(userId)],
    }),
    toggleBlockNotification: builder.mutation({
      query: ({ targetUserId }) => ({
        url: `/auth/block/notify/${targetUserId}`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: (result, error, { userId }) => [userTag(userId)],
    }),
    saveReel: builder.mutation({
      query: ({ reelId }) => ({
        url: `/auth/save/reel/${reelId}`,
        method: 'PUT',
        body: {},
      }),
      invalidatesTags: (result, error, { userId }) => [userTag(userId)],
    }),
    pinPost: builder.mutation({
      query: ({ postId }) => ({
        url: `/auth/pin/${postId}`,
        method: 'PUT',
        body: {},
      }),
      invalidatesTags: (result, error, { userId }) => [userTag(userId)],
    }),
    toggleBlockUser: builder.mutation({
      query: ({ targetUserId }) => ({
        url: `/auth/block/${targetUserId}`,
        method: 'PUT',
        body: {},
      }),
      invalidatesTags: (result, error, { targetUserId, userId }) => [
        userTag(targetUserId),
        userTag(userId),
        userTag('SUGGESTED'),
      ],
    }),
    updateRelationship: builder.mutation({
      query: ({ userId, body }) => ({
        url: `/auth/relationship/${userId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { userId, body }) => [
        userTag(userId),
        ...(body.partnerId ? [userTag(body.partnerId)] : []),
      ],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useGetPublicUserByUsernameQuery,
  useLazyGetPublicUserByUsernameQuery,
  useGetSuggestedUsersQuery,
  useGetUserPointsHistoryQuery,
  useLazyGetUserPointsHistoryQuery,
  useGetRelationshipQuery,
  useLazyGetRelationshipQuery,
  useDeleteCurrentUserMutation,
  useFollowUserMutation,
  useUploadProfilePhotoMutation,
  useUploadCoverPhotoMutation,
  useUpdateUserProfileMutation,
  useUpdateUserPasswordMutation,
  useTogglePrivateAccountMutation,
  useToggleSongInPlaylistMutation,
  useToggleBlockNotificationMutation,
  useSaveReelMutation,
  usePinPostMutation,
  useToggleBlockUserMutation,
  useUpdateRelationshipMutation,
} = userApi;
