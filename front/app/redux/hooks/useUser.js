'use client';

import { useEffect, useCallback, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { MESSAGES } from '@/app/utils/messages';
import {
  selectSuggestedUsers,
  selectOnlineUsers,
  selectUserLoading,
  selectUpdateProfileLoading,
} from '../features/user/userSelectors';
import {
  setSuggestedUsers as setReduxSuggestedUsers,
  setUserLoading,
  setUpdateProfileLoading,
} from '../features/user/userSlice';



export const useUser = () => {
  const dispatch = useAppDispatch();
  const { user, setUser, setUsers } = useAuth();
  const { showToast } = useFeedback();

  const suggestedUsers = useAppSelector(selectSuggestedUsers);
  const onlineUsers = useAppSelector(selectOnlineUsers);
  const loading = useAppSelector(selectUserLoading);
  const updateProfileLoading = useAppSelector(selectUpdateProfileLoading);

  const updateLocalUser = useCallback(
    (updatedUserData) => {
      setUser(updatedUserData);
    },
    [setUser]
  );

  const followUser = useCallback(
    async (targetId) => {
      if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

      const isCurrentlyFollowing = user.following?.some(
        (u) => (typeof u === 'string' ? u : u._id) === targetId
      );

      const optimisticFollowing = isCurrentlyFollowing
        ? user.following.filter((u) => (typeof u === 'string' ? u : u._id) !== targetId)
        : [...(user.following || []), targetId];

      updateLocalUser({ ...user, following: optimisticFollowing });

      dispatch(setUserLoading(true));
      try {
        const res = await api.put(`/auth/follow/${targetId}`, {});
        const { user: updatedCurrentUser, targetUser: updatedTargetUser } = res.data;

        setUsers((prev) => prev.map((u) => (u._id === targetId ? updatedTargetUser : u)));
        updateLocalUser(updatedCurrentUser);

        showToast(res.data.message, 'success');
        return { success: true, isFollowing: res.data.isFollowing };
      } catch (err) {
        updateLocalUser({ ...user, following: user.following });
        console.error('Follow error:', err);
        showToast(err.response?.data?.message || MESSAGES.COMMON.ERROR_OCCURRED, 'error');
        return { success: false, error: err.response?.data?.message };
      } finally {
        dispatch(setUserLoading(false));
      }
    },
    [user, setUsers, showToast, updateLocalUser, dispatch]
  );

  const updatePhoto = useCallback(
    async (photoFile, customText = '') => {
      if (!photoFile) return;

      const localPreviewUrl = URL.createObjectURL(photoFile);
      const previousPhoto = user.profilePhoto;

      const optimisticUser = {
        ...user,
        profilePhoto: localPreviewUrl,
      };
      updateLocalUser(optimisticUser);

      const formData = new FormData();
      formData.append('image', photoFile);
      if (customText) formData.append('customText', customText);

      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
      try {
        const res = await api.post('/auth/photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const serverPhotoUrl = res.data?.profilePhoto || res.data;
        const updatedUser = {
          ...user,
          profilePhoto: serverPhotoUrl,
        };

        updateLocalUser(updatedUser);
        showToast(MESSAGES.USER.PHOTO_UPDATE_SUCCESS, 'success', { id: loadingToast });
      } catch (err) {
        console.error('Photo update error:', err);
        updateLocalUser({ ...user, profilePhoto: previousPhoto });
        showToast(MESSAGES.USER.PHOTO_UPDATE_ERROR, 'error', { id: loadingToast });
      }
    },
    [user, showToast, updateLocalUser]
  );

  const updateCoverPhoto = useCallback(
    async (photoFile, customText = '') => {
      if (!photoFile) return;

      const localPreviewUrl = URL.createObjectURL(photoFile);
      const previousCover = user.coverPhoto;

      const optimisticUser = {
        ...user,
        coverPhoto: localPreviewUrl,
      };
      updateLocalUser(optimisticUser);

      const formData = new FormData();
      formData.append('image', photoFile);
      if (customText) formData.append('customText', customText);

      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
      try {
        const res = await api.post('/auth/cover', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const serverCoverUrl = res.data?.coverPhoto || res.data;
        const updatedUser = {
          ...user,
          coverPhoto: serverCoverUrl,
        };

        updateLocalUser(updatedUser);
        showToast('Cover photo updated successfully.', 'success', { id: loadingToast });
      } catch (err) {
        console.error('Cover photo update error:', err);
        updateLocalUser({ ...user, coverPhoto: previousCover });
        showToast('Failed to update cover photo.', 'error', { id: loadingToast });
      }
    },
    [user, showToast, updateLocalUser]
  );

  const updateProfile = useCallback(
    async (fields) => {
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
        if (newValue !== undefined && newValue !== user[key]) {
          payload[key] = newValue;
        }
      });

      if (fields.dateOfBirth && fields.dateOfBirth !== user.dateOfBirth) {
        payload.dateOfBirth = fields.dateOfBirth;
      }

      if (fields.partner !== undefined && fields.partner !== user.partner) {
        payload.partner = fields.partner || null;
      }

      if (Array.isArray(fields.interests)) {
        payload.interests = fields.interests;
      }

      if (fields.socialLinks) {
        payload.socialLinks = { ...user.socialLinks, ...fields.socialLinks };
      }

      if (Object.keys(payload).length === 0) {
        return showToast('No changes detected.', 'info');
      }

      dispatch(setUpdateProfileLoading(true));
      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

      try {
        const res = await api.put('/auth/update', payload);
        const newUserData = res.data.user || res.data;
        const updatedUser = { ...user, ...newUserData };
        delete updatedUser.token;
        delete updatedUser.accessToken;

        updateLocalUser(updatedUser);
        showToast(MESSAGES.USER.PROFILE_UPDATE_SUCCESS, 'success', { id: loadingToast });
      } catch (err) {
        console.error('Profile update error:', err);
        showToast(MESSAGES.USER.PROFILE_UPDATE_ERROR, 'error', { id: loadingToast });
      } finally {
        dispatch(setUpdateProfileLoading(false));
      }
    },
    [user, showToast, updateLocalUser, dispatch]
  );

  const updatePassword = useCallback(
    async ({ oldPassword, newPassword }) => {
      const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
      try {
        const res = await api.put('/auth/update/pass', { oldPassword, newPassword });
        showToast(res.data.message || MESSAGES.AUTH.PASSWORD_UPDATE_SUCCESS, 'success', { id: loadingToast });
        return { success: true };
      } catch (err) {
        showToast(err.response?.data?.message || MESSAGES.AUTH.PASSWORD_UPDATE_ERROR, 'error', { id: loadingToast });
        return { error: err.response?.data?.message };
      }
    },
    [showToast]
  );

  const toggleShowOnlineStatus = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.put('/auth/update', { showOnlineStatus: !user.showOnlineStatus });
      const updatedUser = { ...user, showOnlineStatus: !user.showOnlineStatus };
      updateLocalUser(updatedUser);
      showToast('Activity status updated.', 'success');
      return res.data;
    } catch (err) {
      showToast('Failed to update activity status.', 'error');
    }
  }, [user, updateLocalUser, showToast]);

  const togglePrivateAccount = useCallback(async () => {
    if (!user) return;
    try {
      await api.put('/auth/account/private', {});
      const isPrivate = !user.isPrivate;
      updateLocalUser({ ...user, isPrivate });
      showToast(MESSAGES.USER.PRIVACY_UPDATE(isPrivate), 'success');
    } catch (err) {
      showToast('Failed to update privacy settings.', 'error');
    }
  }, [user, showToast, updateLocalUser]);

  const getUserById = useCallback(async (id) => {
    if (!id) return null;
    try {
      const res = await api.get(`/auth/${id}`);
      return res.data;
    } catch (err) {
      console.error('Fetch user error:', err);
      return null;
    }
  }, []);

  const saveMusicInPlayList = useCallback(
    async (musicId) => {
      try {
        const res = await api.put(`/auth/save/music/${musicId}`, {});
        showToast(res.data.message || MESSAGES.COMMON.SAVED, 'success');
        if (user && Array.isArray(res.data.playlist)) {
          updateLocalUser({ ...user, myMusicPlaylist: res.data.playlist });
        }
        return res.data;
      } catch (err) {
        showToast('Failed to save music.', 'error');
        return null;
      }
    },
    [user, updateLocalUser, showToast]
  );

  const toggleBlockNotification = useCallback(
    async (targetUserId) => {
      try {
        const res = await api.post(`/auth/block/notify/${targetUserId}`, {});
        const updatedUser = {
          ...user,
          BlockedNotificationFromUsers: res.data.blockedUsers || [],
        };
        updateLocalUser(updatedUser);
        showToast(res.data.message || 'Preferences updated.', 'success');
        return res.data;
      } catch (err) {
        showToast('Failed to update notification settings.', 'error');
      }
    },
    [user, updateLocalUser, showToast]
  );

  const toggleSaveReel = useCallback(
    async (reelId) => {
      if (!user?._id) {
        showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
        return null;
      }
      try {
        const res = await api.put(`/auth/save/reel/${reelId}`, {});
        showToast(res.data.message || MESSAGES.COMMON.SAVED, 'success');
        if (Array.isArray(res.data.savedReels)) {
          updateLocalUser((currentUser) => currentUser
            ? { ...currentUser, savedReels: res.data.savedReels }
            : currentUser);
        }
        return res.data;
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to update reel status.', 'error');
        return null;
      }
    },
    [user, updateLocalUser, showToast]
  );

  const pinPost = useCallback(
    async (postId) => {
      try {
        const res = await api.put(`/auth/pin/${postId}`, {});
        showToast(res.data.message || MESSAGES.POST.PIN_SUCCESS, 'success');
        if (res.data.pinsPosts) {
          updateLocalUser({ ...user, pinsPosts: res.data.pinsPosts });
        }
      } catch (err) {
        showToast('Failed to pin post.', 'error');
      }
    },
    [user, updateLocalUser, showToast]
  );

  const blockUser = useCallback(
    async (targetUserId) => {
      try {
        const res = await api.put(`/auth/block/${targetUserId}`, {});
        if (res.data.blockedUsers) {
          updateLocalUser({
            ...user,
            blockedUsers: res.data.blockedUsers,
            following: res.data.following || user.following,
          });
        }
        showToast(res.data.message || 'Action completed.', 'success');
        return res.data;
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to block user.', 'error');
      }
    },
    [user, updateLocalUser, showToast]
  );

  const getPointsHistory = useCallback(async (userId) => {
    try {
      const res = await api.get(`/auth/${userId}/points/history`);
      return res.data;
    } catch (err) {
      console.error('Fetch points history error:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchSuggested = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get('/auth/suggested');
        dispatch(setReduxSuggestedUsers(Array.isArray(res.data) ? res.data : []));
      } catch (err) {
        console.error('Suggested users fetch error:', err);
      }
    };
    fetchSuggested();
  }, [user?._id, dispatch]);

  return useMemo(
    () => ({
      suggestedUsers,
      onlineUsers,
      loading,
      updateProfileLoading,
      followUser,
      updatePhoto,
      updateProfile,
      updatePassword,
      togglePrivateAccount,
      toggleShowOnlineStatus,
      getUserById,
      updateCoverPhoto,
      saveMusicInPlayList,
      toggleBlockNotification,
      toggleSaveReel,
      pinPost,
      blockUser,
      getPointsHistory,
    }),
    [
      suggestedUsers,
      onlineUsers,
      loading,
      updateProfileLoading,
      followUser,
      updatePhoto,
      updateProfile,
      updatePassword,
      togglePrivateAccount,
      toggleShowOnlineStatus,
      getUserById,
      updateCoverPhoto,
      saveMusicInPlayList,
      toggleBlockNotification,
      toggleSaveReel,
      pinPost,
      blockUser,
      getPointsHistory,
    ]
  );
};

export default useUser;
