'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector, useAppStore } from './hooks';
import { selectCurrentUser } from './features/auth/authSelectors';
import { connectSocket, disconnectSocket } from './features/socket/socketManager';
import { setSocketConnected } from './features/socket/socketSlice';
import { setOnlineUsers } from './features/user/userSlice';
import { setUser } from './features/auth/authSlice';
import { userApi } from './features/user/userApi';
import { baseApi } from './api/baseApi';
import { updateReelCache } from './features/reels/reelsApi';
import { updateQueueTrack, removeQueueTrack } from './features/musicPlayer/musicPlayerSlice';
import toast from 'react-hot-toast';

export default function SocketBridge() {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const user = useAppSelector(selectCurrentUser);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!user?._id) {
      disconnectSocket();
      dispatch(setSocketConnected(false));
      return;
    }

    const socket = connectSocket(user._id);
    if (!socket) return;

    const handleConnect = () => dispatch(setSocketConnected(true));
    const handleDisconnect = () => dispatch(setSocketConnected(false));
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    if (socket.connected) handleConnect();

    // Online users
    const handleOnlineUsers = (users) => dispatch(setOnlineUsers(users));
    socket.on('getOnlineUsers', handleOnlineUsers);

    // User updates
    const handleUserUpdate = (updatedUser) => {
      if (updatedUser?._id) {
        dispatch(
          userApi.util.invalidateTags([
            { type: 'User', id: updatedUser._id },
            { type: 'User', id: 'SUGGESTED' },
          ])
        );
      }
      const currentUser = userRef.current;
      if (currentUser && currentUser._id === updatedUser._id) {
        dispatch(setUser({ ...currentUser, ...updatedUser }));
      }
    };
    socket.on('user:update', handleUserUpdate);

    // Points updates
    const handlePointsUpdate = (data) => {
      const { points, level, levelChanged, pointsChange, action, nextLevelPoints } = data;
      const currentUser = userRef.current;
      if (currentUser) {
        dispatch(userApi.util.invalidateTags([{ type: 'User', id: currentUser._id }]));
        dispatch(
          setUser({
            ...currentUser,
            userLevelPoints: points,
            level,
            nextLevelPoints,
          })
        );
        if (levelChanged) {
          toast.success(`🎉 Level Up! You are now Level ${level}!`);
        } else if (pointsChange > 0) {
          const actionLabel = action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
          toast.success(`+${pointsChange} Points: ${actionLabel}`);
        }
      }
    };
    socket.on('pointsUpdate', handlePointsUpdate);

    // Post events
    const handlePostCreate = (newPost) => {
      const currentUserId = userRef.current?._id?.toString();
      const ownerId = newPost?.owner?._id?.toString() || newPost?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      dispatch(baseApi.util.invalidateTags([{ type: 'Post', id: 'LIST' }]));
    };
    const handlePostUpdate = (updatedPost) => {
      if (updatedPost?._id) dispatch(baseApi.util.invalidateTags([{ type: 'Post', id: updatedPost._id }]));
    };
    const handlePostDelete = (postId) => {
      dispatch(baseApi.util.invalidateTags([
        { type: 'Post', id: postId },
        { type: 'Post', id: 'LIST' },
      ]));
    };

    socket.on('post:create', handlePostCreate);
    socket.on('post:update', handlePostUpdate);
    socket.on('post:delete', handlePostDelete);

    // Comment events
    const handleCommentCreate = (newComment) => {
      const currentUserId = userRef.current?._id?.toString();
      const ownerId = newComment?.owner?._id?.toString() || newComment?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      dispatch(baseApi.util.invalidateTags([
        { type: 'Comment', id: `target-${newComment.targetType}-${newComment.targetId}` },
        { type: 'Comment', id: `replies-${newComment.targetId}` },
        { type: 'Comment', id: newComment.targetId },
      ]));
    };
    const handleCommentUpdate = (updatedComment) => {
      if (updatedComment?._id) {
        dispatch(baseApi.util.invalidateTags([{ type: 'Comment', id: updatedComment._id }]));
      }
    };
    const handleCommentDelete = () => {
      dispatch(baseApi.util.invalidateTags([{ type: 'Comment', id: 'LIST' }]));
    };

    socket.on('comment:create', handleCommentCreate);
    socket.on('comment:update', handleCommentUpdate);
    socket.on('comment:delete', handleCommentDelete);

    // Message events
    const handleNewMessage = (message) => {
      const currentUserId = userRef.current?._id?.toString();
      const senderId = message?.sender?._id?.toString() || message?.sender?.toString();
      const receiverId = message?.receiver?._id?.toString() || message?.receiver?.toString();
      if (!currentUserId || (senderId !== currentUserId && receiverId !== currentUserId)) return;
      const otherUserId = senderId === currentUserId ? receiverId : senderId;
      dispatch(baseApi.util.invalidateTags([
        { type: 'Message', id: `CONVERSATION-${otherUserId}` },
        { type: 'Message', id: `BY-USER-${currentUserId}` },
        { type: 'Message', id: 'USERS' },
        { type: 'Message', id: 'UNREAD' },
      ]));
    };
    const handleMessageLike = ({ messageId }) => {
      if (messageId) dispatch(baseApi.util.invalidateTags([{ type: 'Message', id: messageId }]));
    };
    const handleMessageDelete = (messageId) => {
      if (messageId) {
        dispatch(baseApi.util.invalidateTags([
          { type: 'Message', id: messageId },
          { type: 'Message', id: 'USERS' },
          { type: 'Message', id: 'UNREAD' },
        ]));
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageLikeUpdate', handleMessageLike);
    socket.on('message:delete', handleMessageDelete);

    // Notification events
    const handleNotification = (notify) => {
      dispatch(baseApi.util.invalidateTags([
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD' },
      ]));
      toast(notify.content || 'You have a new notification!', { icon: '🔔' });
    };
    const handleNotificationUpdate = (updated) => {
      dispatch(baseApi.util.invalidateTags([
        ...(updated?._id ? [{ type: 'Notification', id: updated._id }] : []),
        { type: 'Notification', id: 'UNREAD' },
      ]));
    };
    const handleNotificationDelete = () => {
      dispatch(baseApi.util.invalidateTags([
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD' },
      ]));
    };
    const handleNotificationReadAll = () => {
      dispatch(baseApi.util.invalidateTags([
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD' },
      ]));
    };
    const handleNotificationClearAll = handleNotificationDelete;

    socket.on('notification', handleNotification);
    socket.on('notification:update', handleNotificationUpdate);
    socket.on('notification:delete', handleNotificationDelete);
    socket.on('notification:read-all', handleNotificationReadAll);
    socket.on('notification:clear-all', handleNotificationClearAll);

    // Community events
    const handleCommunityCreate = (newCom) => {
      const currentUserId = userRef.current?._id?.toString();
      const ownerId = newCom?.owner?._id?.toString() || newCom?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      dispatch(baseApi.util.invalidateTags([{ type: 'Community', id: 'LIST' }]));
    };
    const handleCommunityUpdate = (updated) => {
      dispatch(baseApi.util.invalidateTags([
        ...(updated?._id ? [{ type: 'Community', id: updated._id }] : []),
        { type: 'Community', id: 'LIST' },
      ]));
    };
    const handleCommunityDelete = (id) => {
      dispatch(baseApi.util.invalidateTags([
        { type: 'Community', id },
        { type: 'Community', id: 'LIST' },
      ]));
    };

    socket.on('community:create', handleCommunityCreate);
    socket.on('community:update', handleCommunityUpdate);
    socket.on('community:delete', handleCommunityDelete);

    // Story events
    const handleNewStory = (newStory) => {
      const currentUserId = userRef.current?._id?.toString();
      const ownerId = newStory?.owner?._id?.toString() || newStory?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      dispatch(baseApi.util.invalidateTags([{ type: 'Story', id: 'LIST' }]));
    };
    const handleDeletedStory = (storyId) => {
      dispatch(baseApi.util.invalidateTags([
        { type: 'Story', id: storyId },
        { type: 'Story', id: 'LIST' },
        { type: 'Highlight', id: 'LIST' },
      ]));
    };
    const handleUpdatedStory = (updatedStory) => {
      if (updatedStory?._id) {
        dispatch(baseApi.util.invalidateTags([{ type: 'Story', id: updatedStory._id }]));
      }
    };

    socket.on('new-story', handleNewStory);
    socket.on('delete-story', handleDeletedStory);
    socket.on('update-story', handleUpdatedStory);

    // Reel events
    const handleReelCreate = (newReel) => {
      const currentUserId = userRef.current?._id?.toString();
      const ownerId = newReel?.owner?._id?.toString() || newReel?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      dispatch(baseApi.util.invalidateTags([{ type: 'Reel', id: 'LIST' }]));
    };
    const handleReelUpdate = (updated) => {
      if (updated?._id) dispatch(baseApi.util.invalidateTags([{ type: 'Reel', id: updated._id }]));
    };
    const handleReelView = (viewResult) => {
      if (viewResult?._id) {
        updateReelCache(dispatch, () => store.getState(), viewResult._id, (reel) => ({ ...reel, ...viewResult }));
      }
    };
    const handleReelDelete = (id) => dispatch(baseApi.util.invalidateTags([
      { type: 'Reel', id },
      { type: 'Reel', id: 'LIST' },
    ]));

    socket.on('reel:create', handleReelCreate);
    socket.on('reel:update', handleReelUpdate);
    socket.on('reel:view', handleReelView);
    socket.on('reel:delete', handleReelDelete);

    // Music events
    const handleMusicCreate = (newM) => {
      const currentUserId = userRef.current?._id?.toString();
      const ownerId = newM?.owner?._id?.toString() || newM?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      dispatch(baseApi.util.invalidateTags([
        { type: 'Music', id: 'LIST' },
        { type: 'Music', id: 'TOP_CHARTS' },
      ]));
    };
    const handleMusicUpdate = (updated) => {
      if (updated?._id) {
        dispatch(baseApi.util.invalidateTags([{ type: 'Music', id: updated._id }]));
        dispatch(updateQueueTrack(updated));
      }
    };
    const handleMusicDelete = (id) => {
      dispatch(baseApi.util.invalidateTags([
        { type: 'Music', id },
        { type: 'Music', id: 'LIST' },
        { type: 'Music', id: 'TOP_CHARTS' },
      ]));
      dispatch(removeQueueTrack(id));
    };

    socket.on('music:create', handleMusicCreate);
    socket.on('music:update', handleMusicUpdate);
    socket.on('music:delete', handleMusicDelete);

    // Event events
    const handleEventCreate = () => dispatch(baseApi.util.invalidateTags([{ type: 'Event', id: 'LIST' }]));
    const handleEventUpdate = (updated) => {
      dispatch(baseApi.util.invalidateTags([
        ...(updated?._id ? [{ type: 'Event', id: updated._id }] : []),
        { type: 'Event', id: 'LIST' },
      ]));
    };
    const handleEventDelete = (id) => dispatch(baseApi.util.invalidateTags([
      { type: 'Event', id },
      { type: 'Event', id: 'LIST' },
    ]));

    socket.on('event:create', handleEventCreate);
    socket.on('event:update', handleEventUpdate);
    socket.on('event:delete', handleEventDelete);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('getOnlineUsers', handleOnlineUsers);
      socket.off('user:update', handleUserUpdate);
      socket.off('pointsUpdate', handlePointsUpdate);
      socket.off('post:create', handlePostCreate);
      socket.off('post:update', handlePostUpdate);
      socket.off('post:delete', handlePostDelete);
      socket.off('comment:create', handleCommentCreate);
      socket.off('comment:update', handleCommentUpdate);
      socket.off('comment:delete', handleCommentDelete);
      socket.off('newMessage', handleNewMessage);
      socket.off('messageLikeUpdate', handleMessageLike);
      socket.off('message:delete', handleMessageDelete);
      socket.off('notification', handleNotification);
      socket.off('notification:update', handleNotificationUpdate);
      socket.off('notification:delete', handleNotificationDelete);
      socket.off('notification:read-all', handleNotificationReadAll);
      socket.off('notification:clear-all', handleNotificationClearAll);
      socket.off('community:create', handleCommunityCreate);
      socket.off('community:update', handleCommunityUpdate);
      socket.off('community:delete', handleCommunityDelete);
      socket.off('new-story', handleNewStory);
      socket.off('delete-story', handleDeletedStory);
      socket.off('update-story', handleUpdatedStory);
      socket.off('reel:create', handleReelCreate);
      socket.off('reel:update', handleReelUpdate);
      socket.off('reel:view', handleReelView);
      socket.off('reel:delete', handleReelDelete);
      socket.off('music:create', handleMusicCreate);
      socket.off('music:update', handleMusicUpdate);
      socket.off('music:delete', handleMusicDelete);
      socket.off('event:create', handleEventCreate);
      socket.off('event:update', handleEventUpdate);
      socket.off('event:delete', handleEventDelete);
    };
  }, [user?._id, dispatch, store]);

  return null;
}
