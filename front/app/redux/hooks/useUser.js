'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { MESSAGES } from '@/app/utils/messages';
import { baseApi } from '../api/baseApi';
import { logoutSuccess } from '../features/auth/authSlice';
import {
  selectOnlineUsers,
  selectShowAllSuggestedUsers,
} from '../features/user/userSelectors';
import { setShowAllSuggestedUsers as setShowSuggestedUsers } from '../features/user/userSlice';
import {
  useFollowUserMutation,
  useGetSuggestedUsersQuery,
  useLazyGetUserByIdQuery,
  useLazyGetPublicUserByUsernameQuery,
  useLazyGetUserPointsHistoryQuery,
  useLazyGetRelationshipQuery,
  useDeleteCurrentUserMutation,
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
} from '../features/user/userApi';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { showToast, confirmAction } = useFeedback();

  const [followRequest, { isLoading: loading }] = useFollowUserMutation();
  const [uploadProfilePhoto] = useUploadProfilePhotoMutation();
  const [uploadCoverPhoto] = useUploadCoverPhotoMutation();
  const [updateUserProfile, { isLoading: updateProfileLoading }] = useUpdateUserProfileMutation();
  const [updateUserPassword] = useUpdateUserPasswordMutation();
  const [togglePrivateAccountRequest] = useTogglePrivateAccountMutation();
  const [toggleSongInPlaylist] = useToggleSongInPlaylistMutation();
  const [toggleBlockNotificationRequest] = useToggleBlockNotificationMutation();
  const [saveReel] = useSaveReelMutation();
  const [pinUserPost] = usePinPostMutation();
  const [toggleBlockUserRequest] = useToggleBlockUserMutation();
  const [updateRelationshipRequest] = useUpdateRelationshipMutation();
  const [deleteCurrentUserRequest] = useDeleteCurrentUserMutation();
  const [fetchUserById] = useLazyGetUserByIdQuery();
  const [fetchPublicUserByUsername] = useLazyGetPublicUserByUsernameQuery();
  const [fetchPointsHistory] = useLazyGetUserPointsHistoryQuery();
  const [fetchRelationship] = useLazyGetRelationshipQuery();

  const { data: suggestedUsers = [] } = useGetSuggestedUsersQuery(user?._id, {
    skip: !user?._id,
  });
  const onlineUsers = useAppSelector(selectOnlineUsers);
  const showAllSuggestedUsers = useAppSelector(selectShowAllSuggestedUsers);

  const updateLocalUser = useCallback(
    (updatedUserData) => {
      setUser(updatedUserData);
    },
    [setUser]
  );

  const setShowAllSuggestedUsers = useCallback(
    (show) => dispatch(setShowSuggestedUsers(show)),
    [dispatch]
  );

  const followUser = useCallback(
    async (targetId) => {
      if (!user?._id) {
        showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
        return { success: false };
      }

      const currentFollowing = user.following || [];
      const isCurrentlyFollowing = currentFollowing.some(
        (item) => (typeof item === 'string' ? item : item?._id) === targetId
      );
      const optimisticFollowing = isCurrentlyFollowing
        ? currentFollowing.filter((item) => (typeof item === 'string' ? item : item?._id) !== targetId)
        : [...currentFollowing, targetId];

      updateLocalUser({ ...user, following: optimisticFollowing });
      try {
        const result = await followRequest({ targetId, userId: user._id }).unwrap();
        if (result.user) updateLocalUser(result.user);
        showToast(result.message, 'success');
        return { success: true, isFollowing: result.isFollowing };
      } catch (error) {
        updateLocalUser(user);
        const message = error.data?.message || MESSAGES.COMMON.ERROR_OCCURRED;
        console.error('Follow error:', error);
        showToast(message, 'error');
        return { success: false, error: message };
      }
    },
    [user, followRequest, updateLocalUser, showToast]
  );

  const updatePhoto = useCallback(
    async (photoFile, customText = '') => {
      if (!photoFile || !user?._id) return;

      const localPreviewUrl = URL.createObjectURL(photoFile);
      const previousPhoto = user.profilePhoto;
      updateLocalUser({ ...user, profilePhoto: localPreviewUrl });

      const formData = new FormData();
      formData.append('image', photoFile);
      if (customText) formData.append('customText', customText);

      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
      try {
        const result = await uploadProfilePhoto({ userId: user._id, formData }).unwrap();
        updateLocalUser({ ...user, profilePhoto: result.profilePhoto || result });
        showToast(MESSAGES.USER.PHOTO_UPDATE_SUCCESS, 'success', { id: loadingToast });
      } catch (error) {
        console.error('Photo update error:', error);
        updateLocalUser({ ...user, profilePhoto: previousPhoto });
        showToast(error.data?.message || MESSAGES.USER.PHOTO_UPDATE_ERROR, 'error', { id: loadingToast });
      } finally {
        URL.revokeObjectURL(localPreviewUrl);
      }
    },
    [user, uploadProfilePhoto, showToast, updateLocalUser]
  );

  const updateCoverPhoto = useCallback(
    async (photoFile, customText = '') => {
      if (!photoFile || !user?._id) return;

      const localPreviewUrl = URL.createObjectURL(photoFile);
      const previousCover = user.coverPhoto;
      updateLocalUser({ ...user, coverPhoto: localPreviewUrl });

      const formData = new FormData();
      formData.append('image', photoFile);
      if (customText) formData.append('customText', customText);

      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
      try {
        const result = await uploadCoverPhoto({ userId: user._id, formData }).unwrap();
        updateLocalUser({ ...user, coverPhoto: result.coverPhoto || result });
        showToast('Cover photo updated successfully.', 'success', { id: loadingToast });
      } catch (error) {
        console.error('Cover photo update error:', error);
        updateLocalUser({ ...user, coverPhoto: previousCover });
        showToast(error.data?.message || 'Failed to update cover photo.', 'error', { id: loadingToast });
      } finally {
        URL.revokeObjectURL(localPreviewUrl);
      }
    },
    [user, uploadCoverPhoto, showToast, updateLocalUser]
  );

  const updateProfile = useCallback(
    async (fields) => {
      if (!user?._id) return;

      const payload = {};
      const allowedFields = [
        'username',
        'profileName',
        'description',
        'country',
        'city',
        'phone',
        'gender',
        'preferedLanguage',
        'relationshipStatus',
      ];

      allowedFields.forEach((key) => {
        const newValue = typeof fields[key] === 'string' ? fields[key].trim() : fields[key];
        if (newValue !== undefined && newValue !== user[key]) payload[key] = newValue;
      });

      if (fields.dateOfBirth && fields.dateOfBirth !== user.dateOfBirth) {
        payload.dateOfBirth = fields.dateOfBirth;
      }
      if (fields.partner !== undefined && fields.partner !== user.partner) {
        payload.partner = fields.partner || null;
      }
      if (Array.isArray(fields.interests)) payload.interests = fields.interests;
      if (fields.socialLinks) payload.socialLinks = { ...user.socialLinks, ...fields.socialLinks };

      if (Object.keys(payload).length === 0) {
        showToast('No changes detected.', 'info');
        return;
      }

      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
      try {
        const result = await updateUserProfile({ userId: user._id, fields: payload }).unwrap();
        const updatedUser = { ...user, ...(result.user || result) };
        delete updatedUser.token;
        delete updatedUser.accessToken;
        updateLocalUser(updatedUser);
        showToast(MESSAGES.USER.PROFILE_UPDATE_SUCCESS, 'success', { id: loadingToast });
      } catch (error) {
        console.error('Profile update error:', error);
        showToast(error.data?.message || MESSAGES.USER.PROFILE_UPDATE_ERROR, 'error', { id: loadingToast });
      }
    },
    [user, updateUserProfile, showToast, updateLocalUser]
  );

  const updatePassword = useCallback(
    async ({ oldPassword, newPassword }) => {
      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
      try {
        const result = await updateUserPassword({ oldPassword, newPassword }).unwrap();
        showToast(result.message || MESSAGES.AUTH.PASSWORD_UPDATE_SUCCESS, 'success', { id: loadingToast });
        return { success: true };
      } catch (error) {
        const message = error.data?.message || MESSAGES.AUTH.PASSWORD_UPDATE_ERROR;
        showToast(message, 'error', { id: loadingToast });
        return { error: message };
      }
    },
    [updateUserPassword, showToast]
  );

  const toggleShowOnlineStatus = useCallback(async () => {
    if (!user?._id) return;
    try {
      const result = await updateUserProfile({
        userId: user._id,
        fields: { showOnlineStatus: !user.showOnlineStatus },
      }).unwrap();
      updateLocalUser(result.user || { ...user, showOnlineStatus: !user.showOnlineStatus });
      showToast('Activity status updated.', 'success');
      return result;
    } catch (error) {
      showToast(error.data?.message || 'Failed to update activity status.', 'error');
    }
  }, [user, updateUserProfile, updateLocalUser, showToast]);

  const togglePrivateAccount = useCallback(async () => {
    if (!user?._id) return;
    try {
      const result = await togglePrivateAccountRequest(user._id).unwrap();
      const isPrivate = result.isPrivate ?? !user.isPrivate;
      updateLocalUser({ ...user, isPrivate });
      showToast(MESSAGES.USER.PRIVACY_UPDATE(isPrivate), 'success');
      return result;
    } catch (error) {
      showToast(error.data?.message || 'Failed to update privacy settings.', 'error');
    }
  }, [user, togglePrivateAccountRequest, showToast, updateLocalUser]);

  const getUserById = useCallback(
    async (id) => {
      if (!id) return null;
      try {
        return await fetchUserById(id).unwrap();
      } catch (error) {
        console.error('Fetch user error:', error);
        return null;
      }
    },
    [fetchUserById]
  );

  const getUserByUsername = useCallback(
    async (username) => {
      if (!username) return null;
      try {
        return await fetchPublicUserByUsername(decodeURIComponent(username)).unwrap();
      } catch (error) {
        console.error('Fetch user by username error:', error);
        return null;
      }
    },
    [fetchPublicUserByUsername]
  );

  const saveMusicInPlayList = useCallback(
    async (musicId) => {
      try {
        const result = await toggleSongInPlaylist({ songId: musicId, userId: user?._id }).unwrap();
        showToast(result.message || MESSAGES.COMMON.SAVED, 'success');
        if (user && Array.isArray(result.playlist)) {
          updateLocalUser({ ...user, myMusicPlaylist: result.playlist });
        }
        return result;
      } catch (error) {
        showToast(error.data?.message || 'Failed to save music.', 'error');
        return null;
      }
    },
    [user, toggleSongInPlaylist, updateLocalUser, showToast]
  );

  const toggleBlockNotification = useCallback(
    async (targetUserId) => {
      try {
        const result = await toggleBlockNotificationRequest({
          targetUserId,
          userId: user?._id,
        }).unwrap();
        updateLocalUser({
          ...user,
          BlockedNotificationFromUsers: result.blockedUsers || [],
        });
        showToast(result.message || 'Preferences updated.', 'success');
        return result;
      } catch (error) {
        showToast(error.data?.message || 'Failed to update notification settings.', 'error');
      }
    },
    [user, toggleBlockNotificationRequest, updateLocalUser, showToast]
  );

  const toggleSaveReel = useCallback(
    async (reelId) => {
      if (!user?._id) {
        showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
        return null;
      }
      try {
        const result = await saveReel({ reelId, userId: user._id }).unwrap();
        showToast(result.message || MESSAGES.COMMON.SAVED, 'success');
        if (Array.isArray(result.savedReels)) {
          updateLocalUser((currentUser) =>
            currentUser ? { ...currentUser, savedReels: result.savedReels } : currentUser
          );
        }
        return result;
      } catch (error) {
        showToast(error.data?.message || 'Failed to update reel status.', 'error');
        return null;
      }
    },
    [user, saveReel, updateLocalUser, showToast]
  );

  const pinPost = useCallback(
    async (postId) => {
      try {
        const result = await pinUserPost({ postId, userId: user?._id }).unwrap();
        showToast(result.message || MESSAGES.POST.PIN_SUCCESS, 'success');
        if (result.pinsPosts) updateLocalUser({ ...user, pinsPosts: result.pinsPosts });
        return result;
      } catch (error) {
        showToast(error.data?.message || 'Failed to pin post.', 'error');
        return null;
      }
    },
    [user, pinUserPost, updateLocalUser, showToast]
  );

  const blockUser = useCallback(
    async (targetUserId) => {
      try {
        const result = await toggleBlockUserRequest({
          targetUserId,
          userId: user?._id,
        }).unwrap();
        if (result.blockedUsers) {
          updateLocalUser({
            ...user,
            blockedUsers: result.blockedUsers,
            following: result.following || user.following,
          });
        }
        showToast(result.message || 'Action completed.', 'success');
        return result;
      } catch (error) {
        showToast(error.data?.message || 'Failed to block user.', 'error');
        return null;
      }
    },
    [user, toggleBlockUserRequest, updateLocalUser, showToast]
  );

  const getPointsHistory = useCallback(
    async (userId) => {
      if (!userId) return [];
      try {
        return await fetchPointsHistory(userId).unwrap();
      } catch (error) {
        console.error('Fetch points history error:', error);
        return [];
      }
    },
    [fetchPointsHistory]
  );

  const getRelationship = useCallback(
    async (userId) => {
      if (!userId) return null;
      try {
        return await fetchRelationship(userId).unwrap();
      } catch (error) {
        console.error('Fetch relationship error:', error);
        return null;
      }
    },
    [fetchRelationship]
  );

  const updateRelationship = useCallback(
    async (userId, body) => {
      try {
        return await updateRelationshipRequest({ userId, body }).unwrap();
      } catch (error) {
        showToast(error.data?.message || 'Failed to update relationship.', 'error');
        return null;
      }
    },
    [updateRelationshipRequest, showToast]
  );

  const deleteAccount = useCallback(async () => {
    const confirmed = await confirmAction({
      title: 'Delete Account Permanently',
      text: 'This will permanently delete your account and its data. This action cannot be undone.',
      confirmButtonText: 'Delete Account',
      type: 'danger',
    });
    if (!confirmed) return false;

    try {
      const result = await deleteCurrentUserRequest().unwrap();
      dispatch(logoutSuccess());
      dispatch(baseApi.util.resetApiState());
      showToast(result.message || 'Account deleted successfully.', 'success');
      router.replace('/Pages/Login');
      return true;
    } catch (error) {
      showToast(error.data?.message || 'Failed to delete your account.', 'error');
      return false;
    }
  }, [confirmAction, deleteCurrentUserRequest, dispatch, router, showToast]);

  return useMemo(
    () => ({
      suggestedUsers,
      onlineUsers,
      loading,
      updateProfileLoading,
      showAllSuggestedUsers,
      setShowAllSuggestedUsers,
      followUser,
      updatePhoto,
      updateProfile,
      updatePassword,
      togglePrivateAccount,
      toggleShowOnlineStatus,
      getUserById,
      getUserByUsername,
      updateCoverPhoto,
      saveMusicInPlayList,
      toggleBlockNotification,
      toggleSaveReel,
      pinPost,
      blockUser,
      getPointsHistory,
      getRelationship,
      updateRelationship,
      deleteAccount,
    }),
    [
      suggestedUsers,
      onlineUsers,
      loading,
      updateProfileLoading,
      showAllSuggestedUsers,
      setShowAllSuggestedUsers,
      followUser,
      updatePhoto,
      updateProfile,
      updatePassword,
      togglePrivateAccount,
      toggleShowOnlineStatus,
      getUserById,
      getUserByUsername,
      updateCoverPhoto,
      saveMusicInPlayList,
      toggleBlockNotification,
      toggleSaveReel,
      pinPost,
      blockUser,
      getPointsHistory,
      getRelationship,
      updateRelationship,
      deleteAccount,
    ]
  );
};

export default useUser;
