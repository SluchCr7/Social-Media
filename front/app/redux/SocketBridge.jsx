'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectCurrentUser } from './features/auth/authSelectors';
import { connectSocket, disconnectSocket } from './features/socket/socketManager';
import { setSocketConnected } from './features/socket/socketSlice';
import { setOnlineUsers, updateSuggestedUser } from './features/user/userSlice';
import { updateUserInUsersList, setUser } from './features/auth/authSlice';
import { addPost, updatePostInState, removePostFromState } from './features/posts/postsSlice';
import { insertComment, updateComment, deleteCommentFromState } from './features/comments/commentsSlice';
import { addMessageToThread, updateUnreadOnNewMessage, removeMessageFromThread, updateMessageInThread } from './features/messages/messagesSlice';
import {
  addNotificationToState,
  updateNotificationInState,
  removeNotificationFromState,
  markAllNotificationsAsReadState,
  clearAllNotificationsState,
  incrementUnreadCount,
} from './features/notifications/notificationsSlice';
import { addCommunityToState, updateCommunityInState, removeCommunityFromState, invalidateCommunities } from './features/communities/communitiesSlice';
import { addStoryToState, updateStoryInState, removeStoryFromState } from './features/stories/storiesSlice';
import { removeStoryFromAllHighlights } from './features/highlights/highlightsSlice';
import { addReelToState, updateReelInState, removeReelFromState } from './features/reels/reelsSlice';
import { addMusicToState, updateMusicInState, removeMusicFromState } from './features/music/musicSlice';
import { addEventToState, updateEventInState, removeEventFromState } from './features/events/eventsSlice';
import toast from 'react-hot-toast';

export default function SocketBridge() {
  const dispatch = useAppDispatch();
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
      dispatch(updateUserInUsersList(updatedUser));
      dispatch(updateSuggestedUser(updatedUser));
      const currentUser = userRef.current;
      if (currentUser && currentUser._id === updatedUser._id) {
        dispatch(setUser({ ...currentUser, ...updatedUser, token: currentUser.token || currentUser.accessToken }));
      }
    };
    socket.on('user:update', handleUserUpdate);

    // Points updates
    const handlePointsUpdate = (data) => {
      const { points, level, levelChanged, pointsChange, action, nextLevelPoints } = data;
      const currentUser = userRef.current;
      if (currentUser) {
        dispatch(
          setUser({
            ...currentUser,
            userLevelPoints: points,
            level,
            nextLevelPoints,
            token: currentUser.token || currentUser.accessToken,
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
      dispatch(addPost(newPost));
    };
    const handlePostUpdate = (updatedPost) => dispatch(updatePostInState(updatedPost));
    const handlePostDelete = (postId) => dispatch(removePostFromState(postId));

    socket.on('post:create', handlePostCreate);
    socket.on('post:update', handlePostUpdate);
    socket.on('post:delete', handlePostDelete);

    // Comment events
    const handleCommentCreate = (newComment) => {
      const currentUserId = userRef.current?._id?.toString();
      const ownerId = newComment?.owner?._id?.toString() || newComment?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      dispatch(insertComment(newComment));
    };
    const handleCommentUpdate = (updatedComment) => dispatch(updateComment(updatedComment));
    const handleCommentDelete = (commentId) => dispatch(deleteCommentFromState(commentId));

    socket.on('comment:create', handleCommentCreate);
    socket.on('comment:update', handleCommentUpdate);
    socket.on('comment:delete', handleCommentDelete);

    // Message events
    const handleNewMessage = (message) => {
      dispatch(addMessageToThread(message));
      dispatch(updateUnreadOnNewMessage(message));
    };
    const handleMessageLike = ({ messageId, userId, action }) => {
      dispatch(
        updateMessageInThread({
          _id: messageId,
          likedAction: action,
          likedUserId: userId,
        })
      );
    };
    const handleMessageDelete = (messageId) => dispatch(removeMessageFromThread(messageId));

    socket.on('newMessage', handleNewMessage);
    socket.on('messageLikeUpdate', handleMessageLike);
    socket.on('message:delete', handleMessageDelete);

    // Notification events
    const handleNotification = (notify) => {
      dispatch(addNotificationToState(notify));
      dispatch(incrementUnreadCount());
      toast(notify.content || 'You have a new notification!', { icon: '🔔' });
    };
    const handleNotificationUpdate = (updated) => dispatch(updateNotificationInState(updated));
    const handleNotificationDelete = (id) => dispatch(removeNotificationFromState(id));
    const handleNotificationReadAll = () => dispatch(markAllNotificationsAsReadState());
    const handleNotificationClearAll = () => dispatch(clearAllNotificationsState());

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
      dispatch(addCommunityToState(newCom));
      dispatch(invalidateCommunities());
    };
    const handleCommunityUpdate = (updated) => {
      dispatch(updateCommunityInState(updated));
      dispatch(invalidateCommunities());
    };
    const handleCommunityDelete = (id) => {
      dispatch(removeCommunityFromState(id));
      dispatch(invalidateCommunities());
    };

    socket.on('community:create', handleCommunityCreate);
    socket.on('community:update', handleCommunityUpdate);
    socket.on('community:delete', handleCommunityDelete);

    // Story events
    const handleNewStory = (newStory) => {
      const currentUserId = userRef.current?._id?.toString();
      const ownerId = newStory?.owner?._id?.toString() || newStory?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      dispatch(addStoryToState(newStory));
    };
    const handleDeletedStory = (storyId) => {
      dispatch(removeStoryFromState(storyId));
      dispatch(removeStoryFromAllHighlights(storyId));
    };
    const handleUpdatedStory = (updatedStory) => dispatch(updateStoryInState(updatedStory));

    socket.on('new-story', handleNewStory);
    socket.on('delete-story', handleDeletedStory);
    socket.on('update-story', handleUpdatedStory);

    // Reel events
    const handleReelCreate = (newReel) => {
      const currentUserId = userRef.current?._id?.toString();
      const ownerId = newReel?.owner?._id?.toString() || newReel?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      dispatch(addReelToState(newReel));
    };
    const handleReelUpdate = (updated) => dispatch(updateReelInState(updated));
    const handleReelView = (viewResult) => dispatch(updateReelInState(viewResult));
    const handleReelDelete = (id) => dispatch(removeReelFromState(id));

    socket.on('reel:create', handleReelCreate);
    socket.on('reel:update', handleReelUpdate);
    socket.on('reel:view', handleReelView);
    socket.on('reel:delete', handleReelDelete);

    // Music events
    const handleMusicCreate = (newM) => {
      const currentUserId = userRef.current?._id?.toString();
      const ownerId = newM?.owner?._id?.toString() || newM?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      dispatch(addMusicToState(newM));
    };
    const handleMusicUpdate = (updated) => dispatch(updateMusicInState(updated));
    const handleMusicDelete = (id) => dispatch(removeMusicFromState(id));

    socket.on('music:create', handleMusicCreate);
    socket.on('music:update', handleMusicUpdate);
    socket.on('music:delete', handleMusicDelete);

    // Event events
    const handleEventCreate = (newEv) => {
      const currentUserId = userRef.current?._id?.toString();
      const creatorId = newEv?.createdBy?._id?.toString() || newEv?.createdBy?.toString();
      if (currentUserId && creatorId === currentUserId) return;
      dispatch(addEventToState(newEv));
    };
    const handleEventUpdate = (updated) => dispatch(updateEventInState(updated));
    const handleEventDelete = (id) => dispatch(removeEventFromState(id));

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
  }, [user?._id, dispatch]);

  return null;
}
