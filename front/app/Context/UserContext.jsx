'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import { useFeedback } from './FeedbackContext';
import { useSocket } from './SocketContext';
import { MESSAGES } from '../utils/messages';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};

export const UserContextProvider = ({ children }) => {
  const { user, setUser, setUsers } = useAuth();
  const { showToast } = useFeedback();
  const { socket } = useSocket();

  // --- State ---
  const [loading, setLoading] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // --- Actions ---

  /**
   * Helper to update user state locally and in localStorage
   */
  const updateLocalUser = useCallback((updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  }, [setUser]);

  /**
   * Toggle follow/unfollow for a user with real-time updates
   */
  const followUser = useCallback(async (targetId) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

    // Optimistic update - update UI immediately
    const isCurrentlyFollowing = user.following?.some(
      u => (typeof u === 'string' ? u : u._id) === targetId
    );

    // Create optimistic user state
    const optimisticFollowing = isCurrentlyFollowing
      ? user.following.filter(u => (typeof u === 'string' ? u : u._id) !== targetId)
      : [...(user.following || []), targetId];

    // Update UI immediately for instant feedback
    updateLocalUser({ ...user, following: optimisticFollowing });

    setLoading(true);
    try {
      const res = await api.put(`/auth/follow/${targetId}`, {});

      const { user: updatedCurrentUser, targetUser: updatedTargetUser } = res.data;

      // Update global users list with the target user's new follower count
      setUsers((prev) =>
        prev.map((u) => (u._id === targetId ? updatedTargetUser : u))
      );

      // Update current user state with server response
      updateLocalUser({ ...updatedCurrentUser, token: user.token });

      showToast(res.data.message, 'success');

      return { success: true, isFollowing: res.data.isFollowing };
    } catch (err) {
      // Revert optimistic update on error
      updateLocalUser({ ...user, following: user.following });

      console.error('Follow error:', err);
      showToast(err.response?.data?.message || MESSAGES.COMMON.ERROR_OCCURRED, 'error');

      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, [user, setUsers, showToast, updateLocalUser]);

  /**
   * Update profile photo
   */
  const updatePhoto = useCallback(async (photoFile, customText = '') => {
    if (!photoFile) return;

    const formData = new FormData();
    formData.append('image', photoFile);
    if (customText) formData.append('customText', customText);

    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
    try {
      const res = await api.post('/auth/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = {
        ...user,
        profilePhoto: res.data?.profilePhoto || res.data,
      };

      updateLocalUser(updatedUser);
      showToast(MESSAGES.USER.PHOTO_UPDATE_SUCCESS, 'success', { id: loadingToast });
    } catch (err) {
      console.error('Photo update error:', err);
      showToast(MESSAGES.USER.PHOTO_UPDATE_ERROR, 'error', { id: loadingToast });
    }
  }, [user, showToast, updateLocalUser]);

  /**
   * Update cover photo
   */
  const updateCoverPhoto = useCallback(async (photoFile, customText = '') => {
    if (!photoFile) return;

    const formData = new FormData();
    formData.append('image', photoFile);
    if (customText) formData.append('customText', customText);

    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
    try {
      const res = await api.post('/auth/cover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = {
        ...user,
        coverPhoto: res.data?.coverPhoto || res.data,
      };

      updateLocalUser(updatedUser);
      showToast('Cover photo updated successfully.', 'success', { id: loadingToast });
    } catch (err) {
      console.error('Cover photo update error:', err);
      showToast('Failed to update cover photo.', 'error', { id: loadingToast });
    }
  }, [user, showToast, updateLocalUser]);

  /**
   * Update profile information
   */
  const updateProfile = useCallback(async (fields) => {
    const payload = {};
    const allowedFields = [
      'username', 'profileName', 'description', 'country',
      'city', 'phone', 'gender', 'preferedLanguage', 'relationshipStatus'
    ];

    allowedFields.forEach(key => {
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

    setUpdateProfileLoading(true);
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

    try {
      const res = await api.put('/auth/update', payload);

      const newUserData = res.data.user || res.data;
      const updatedUser = { ...user, ...newUserData, token: user.token };

      updateLocalUser(updatedUser);
      showToast(MESSAGES.USER.PROFILE_UPDATE_SUCCESS, 'success', { id: loadingToast });
    } catch (err) {
      console.error('Profile update error:', err);
      showToast(MESSAGES.USER.PROFILE_UPDATE_ERROR, 'error', { id: loadingToast });
    } finally {
      setUpdateProfileLoading(false);
    }
  }, [user, showToast, updateLocalUser]);

  /**
   * Update password
   */
  const updatePassword = useCallback(async ({ oldPassword, newPassword }) => {
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
    try {
      const res = await api.put('/auth/update/pass', { oldPassword, newPassword });
      showToast(res.data.message || MESSAGES.AUTH.PASSWORD_UPDATE_SUCCESS, 'success', { id: loadingToast });
      return { success: true };
    } catch (err) {
      showToast(err.response?.data?.message || MESSAGES.AUTH.PASSWORD_UPDATE_ERROR, 'error', { id: loadingToast });
      return { error: err.response?.data?.message };
    }
  }, [showToast]);

  /**
   * Toggle offline/online visibility
   */
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

  /**
   * Toggle account privacy
   */
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

  /**
   * Fetch user by ID
   */
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

  /**
   * Save music to playlist
   */
  const saveMusicInPlayList = useCallback(async (musicId) => {
    try {
      const res = await api.put(`/auth/save/music/${musicId}`, {});
      showToast(res.data.message || MESSAGES.COMMON.SAVED, 'success');
      return res.data;
    } catch (err) {
      showToast('Failed to save music.', 'error');
      return null;
    }
  }, [showToast]);

  /**
   * Block notifications from a specific user
   */
  const toggleBlockNotification = useCallback(async (targetUserId) => {
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
  }, [user, updateLocalUser, showToast]);

  /**
   * Save/Unsave a reel
   */
  const toggleSaveReel = useCallback(async (reelId) => {
    try {
      const res = await api.put(`/auth/save/reel/${reelId}`, {});
      showToast(res.data.message || MESSAGES.COMMON.SAVED, 'success');
      return res.data;
    } catch (err) {
      showToast('Failed to update reel status.', 'error');
      return null;
    }
  }, [showToast]);

  /**
   * Pin a post to profile
   */
  const pinPost = useCallback(async (postId) => {
    try {
      const res = await api.put(`/auth/pin/${postId}`, {});
      showToast(res.data.message || MESSAGES.POST.PIN_SUCCESS, 'success');
      if (res.data.pinsPosts) {
        updateLocalUser({ ...user, pinsPosts: res.data.pinsPosts });
      }
    } catch (err) {
      showToast('Failed to pin post.', 'error');
    }
  }, [user, updateLocalUser, showToast]);

  /**
   * Block/Unblock a user
   */
  const blockUser = useCallback(async (targetUserId) => {
    try {
      const res = await api.put(`/auth/block/${targetUserId}`, {});

      if (res.data.blockedUsers) {
        updateLocalUser({
          ...user,
          blockedUsers: res.data.blockedUsers,
          following: res.data.following || user.following
        });
      }

      showToast(res.data.message || 'Action completed.', 'success');
      return res.data;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to block user.', 'error');
    }
  }, [user, updateLocalUser, showToast]);

  // --- Effects ---

  // Fetch suggested users
  useEffect(() => {
    const fetchSuggested = async () => {
      if (!user?.token) return;
      try {
        const res = await api.get('/auth/suggested');
        setSuggestedUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Suggested users fetch error:', err);
      }
    };
    fetchSuggested();
  }, [user?.token]);

  // Handle Socket Events for Online Users
  useEffect(() => {
    if (!socket) return;
    socket.on('getOnlineUsers', setOnlineUsers);
    return () => socket.off('getOnlineUsers');
  }, [socket]);

  // --- Context Value ---
  const value = useMemo(() => ({
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
  }), [
    suggestedUsers, onlineUsers, loading, updateProfileLoading,
    followUser, updatePhoto, updateProfile, updatePassword,
    togglePrivateAccount, toggleShowOnlineStatus, getUserById, updateCoverPhoto, saveMusicInPlayList,
    toggleBlockNotification, toggleSaveReel, pinPost, blockUser
  ]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
