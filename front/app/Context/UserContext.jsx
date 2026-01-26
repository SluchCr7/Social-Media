'use client';

import axios from 'axios';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
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

  // --- Helper for Authorized Requests ---
  const getAuthHeader = useCallback(() => ({
    headers: { Authorization: `Bearer ${user?.token}` }
  }), [user?.token]);

  // --- Actions ---

  /**
   * Toggle follow/unfollow for a user
   */
  const followUser = useCallback(async (targetId) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/follow/${targetId}`,
        {},
        getAuthHeader()
      );

      const { message, userId } = res.data;
      const isFollowed = message === 'Followed successfully';

      showToast(isFollowed ? MESSAGES.USER.FOLLOW_SUCCESS('user') : MESSAGES.USER.UNFOLLOW_SUCCESS('user'), 'success');

      // Update global users list
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
              ...u,
              followers: isFollowed
                ? [...(u.followers || []), { _id: user._id }]
                : (u.followers || []).filter((f) => f._id !== user._id),
            }
            : u
        )
      );

      // Update current user state
      const updatedUser = isFollowed
        ? { ...user, following: [...(user.following || []), { _id: userId }] }
        : { ...user, following: (user.following || []).filter((f) => f._id !== userId) };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Follow error:', err);
      showToast(err.response?.data?.message || MESSAGES.COMMON.ERROR_OCCURRED, 'error');
    } finally {
      setLoading(false);
    }
  }, [user, getAuthHeader, setUser, setUsers, showToast]);

  /**
   * Update profile photo
   */
  const updatePhoto = useCallback(async (photoFile) => {
    const formData = new FormData();
    formData.append('image', photoFile);

    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/photo`,
        formData,
        {
          headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updatedUser = {
        ...user,
        profilePhoto: res.data?.profilePhoto || res.data,
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showToast(MESSAGES.USER.PHOTO_UPDATE_SUCCESS, 'success', { id: loadingToast });
    } catch (err) {
      console.error('Photo update error:', err);
      showToast(MESSAGES.USER.PHOTO_UPDATE_ERROR, 'error', { id: loadingToast });
    }
  }, [user, getAuthHeader, setUser, showToast]);

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
      const newValue = fields[key]?.trim?.() || fields[key];
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
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update`,
        payload,
        getAuthHeader()
      );

      const newUserData = res.data.user || res.data;
      const updatedUser = { ...user, ...newUserData, token: user.token };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showToast(MESSAGES.USER.PROFILE_UPDATE_SUCCESS, 'success', { id: loadingToast });

      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error('Profile update error:', err);
      showToast(MESSAGES.USER.PROFILE_UPDATE_ERROR, 'error', { id: loadingToast });
    } finally {
      setUpdateProfileLoading(false);
    }
  }, [user, getAuthHeader, setUser, showToast]);

  /**
   * Update password
   */
  const updatePassword = useCallback(async (password) => {
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update/pass`,
        { password },
        getAuthHeader()
      );
      showToast(res.data.message || MESSAGES.AUTH.PASSWORD_UPDATE_SUCCESS, 'success', { id: loadingToast });
    } catch (err) {
      showToast(MESSAGES.AUTH.PASSWORD_UPDATE_ERROR, 'error', { id: loadingToast });
    }
  }, [getAuthHeader, showToast]);

  /**
   * Toggle account privacy
   */
  const togglePrivateAccount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/account/private`,
        {},
        getAuthHeader()
      );
      const isPrivate = !user.isPrivate;
      setUser(prev => ({ ...prev, isPrivate }));
      showToast(MESSAGES.USER.PRIVACY_UPDATE(isPrivate), 'success');
    } catch (err) {
      showToast('Failed to update privacy settings.', 'error');
    }
  }, [user, getAuthHeader, setUser, showToast]);

  /**
   * Fetch user by ID
   */
  const getUserById = useCallback(async (id) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/${id}`);
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
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/save/music/${musicId}`,
        {},
        getAuthHeader()
      );
      showToast(res.data.message || MESSAGES.COMMON.SAVED, 'success');
      return res.data;
    } catch (err) {
      showToast('Failed to save music.', 'error');
      return null;
    }
  }, [getAuthHeader, showToast]);

  /**
   * Block notifications from a specific user
   */
  const toggleBlockNotification = useCallback(async (targetUserId) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/block/notify/${targetUserId}`,
        {},
        getAuthHeader()
      );

      const updatedUser = {
        ...user,
        BlockedNotificationFromUsers: res.data.blockedUsers || [],
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showToast(res.data.message || 'Preferences updated.', 'success');
      return res.data;
    } catch (err) {
      showToast('Failed to update notification settings.', 'error');
    }
  }, [user, getAuthHeader, setUser, showToast]);

  /**
   * Save/Unsave a reel
   */
  const toggleSaveReel = useCallback(async (reelId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/save/reel/${reelId}`,
        {},
        getAuthHeader()
      );
      showToast(res.data.message || MESSAGES.COMMON.SAVED, 'success');
      return res.data;
    } catch (err) {
      showToast('Failed to update reel status.', 'error');
      return null;
    }
  }, [getAuthHeader, showToast]);

  /**
   * Pin a post to profile
   */
  const pinPost = useCallback(async (postId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/pin/${postId}`,
        {},
        getAuthHeader()
      );
      showToast(res.data.message || MESSAGES.POST.PIN_SUCCESS, 'success');
    } catch (err) {
      showToast('Failed to pin post.', 'error');
    }
  }, [getAuthHeader, showToast]);

  // --- Effects ---

  // Fetch suggested users
  useEffect(() => {
    const fetchSuggested = async () => {
      if (!user?.token) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/suggested`,
          getAuthHeader()
        );
        setSuggestedUsers(res.data);
      } catch (err) {
        console.error('Suggested users fetch error:', err);
      }
    };
    fetchSuggested();
  }, [user?.token, getAuthHeader]);

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
    getUserById,
    saveMusicInPlayList,
    toggleBlockNotification,
    toggleSaveReel,
    pinPost,
  }), [
    suggestedUsers, onlineUsers, loading, updateProfileLoading,
    followUser, updatePhoto, updateProfile, updatePassword,
    togglePrivateAccount, getUserById, saveMusicInPlayList,
    toggleBlockNotification, toggleSaveReel, pinPost
  ]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
