import { baseApi } from '../../api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuggestedUsers: builder.query({
      query: () => '/auth/suggested',
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `/auth/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    followUser: builder.mutation({
      query: (targetId) => ({
        url: `/auth/follow/${targetId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, targetId) => [
        { type: 'User', id: targetId },
        { type: 'User', id: 'SUGGESTED' },
        'Auth',
      ],
    }),
    updatePhoto: builder.mutation({
      query: (formData) => ({
        url: '/auth/photo',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    updateCoverPhoto: builder.mutation({
      query: (formData) => ({
        url: '/auth/cover',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: '/auth/update',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: '/auth/update/pass',
        method: 'PUT',
        body: { oldPassword, newPassword },
      }),
    }),
    togglePrivateAccount: builder.mutation({
      query: () => ({
        url: '/auth/account/private',
        method: 'PUT',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    saveMusicInPlayList: builder.mutation({
      query: (musicId) => ({
        url: `/auth/save/music/${musicId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Auth', 'Music'],
    }),
    toggleBlockNotification: builder.mutation({
      query: (targetUserId) => ({
        url: `/auth/block/notify/${targetUserId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    toggleSaveReel: builder.mutation({
      query: (reelId) => ({
        url: `/auth/save/reel/${reelId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Auth', 'Reel'],
    }),
    pinPost: builder.mutation({
      query: (postId) => ({
        url: `/auth/pin/${postId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Auth', 'Post'],
    }),
    blockUser: builder.mutation({
      query: (targetUserId) => ({
        url: `/auth/block/${targetUserId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    getPointsHistory: builder.query({
      query: (userId) => `/auth/${userId}/points/history`,
      providesTags: (result, error, userId) => [{ type: 'User', id: `points-${userId}` }],
    }),
  }),
});

export const {
  useGetSuggestedUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useFollowUserMutation,
  useUpdatePhotoMutation,
  useUpdateCoverPhotoMutation,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useTogglePrivateAccountMutation,
  useSaveMusicInPlayListMutation,
  useToggleBlockNotificationMutation,
  useToggleSaveReelMutation,
  usePinPostMutation,
  useBlockUserMutation,
  useGetPointsHistoryQuery,
  useLazyGetPointsHistoryQuery,
} = userApi;
