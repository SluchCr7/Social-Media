'use client';

import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useNotify } from './useNotification';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import { baseApi } from '../api/baseApi';
import { selectReplyingTo, selectSelectedUser } from '../features/messages/messagesSelectors';
import { setReplyingTo as setReduxReplyingTo, setSelectedUser as setReduxSelectedUser } from '../features/messages/messagesSlice';
import {
  useDeleteMessageForMeMutation,
  useDeleteMessageMutation,
  useGetConversationUsersQuery,
  useGetMessagesByUserQuery,
  useGetMessagesQuery,
  useGetUnreadMessagesQuery,
  useLikeMessageMutation,
  useMarkConversationReadMutation,
  useSendMessageMutation,
} from '../features/messages/messagesApi';

const getMessageId = (message) => message?._id;
const getSenderId = (message) => message?.sender?._id || message?.sender;
const EMPTY_MESSAGES = [];

export const useMessage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { addNotify } = useNotify();
  const { showAlert } = useFeedback();
  const selectedUser = useAppSelector(selectSelectedUser);
  const replyingTo = useAppSelector(selectReplyingTo);

  const usersQuery = useGetConversationUsersQuery(
    { userId: user?._id },
    { skip: !user?._id }
  );
  const messagesQuery = useGetMessagesQuery({
    targetUserId: selectedUser?._id,
    viewerId: user?._id,
  }, {
    skip: !selectedUser?._id || !user?._id,
  });
  const messagesByUserQuery = useGetMessagesByUserQuery(
    { userId: user?._id },
    { skip: !user?._id }
  );
  const unreadQuery = useGetUnreadMessagesQuery(
    { userId: user?._id },
    { skip: !user?._id }
  );
  const [sendMessageRequest] = useSendMessageMutation();
  const [markReadRequest] = useMarkConversationReadMutation();
  const [likeMessageRequest] = useLikeMessageMutation();
  const [deleteMessageRequest] = useDeleteMessageMutation();
  const [deleteMessageForMeRequest] = useDeleteMessageForMeMutation();
  const refetchUsers = usersQuery.refetch;
  const refetchMessages = messagesQuery.refetch;
  const refetchMessagesByUser = messagesByUserQuery.refetch;
  const refetchUnreadMessages = unreadQuery.refetch;

  const users = useMemo(() => (usersQuery.currentData || []).map((item) => ({
    ...item,
    lastMessage: item.lastMessage || '',
    unreadCount: item.unreadCount || 0,
  })), [usersQuery.currentData]);
  const messages = messagesQuery.currentData || EMPTY_MESSAGES;
  const messagesByUser = messagesByUserQuery.currentData || EMPTY_MESSAGES;
  const unreadMessages = unreadQuery.currentData || EMPTY_MESSAGES;
  const unreadCountPerUser = useMemo(() => unreadMessages.reduce((counts, message) => {
    const senderId = getSenderId(message);
    if (senderId) counts[senderId] = (counts[senderId] || 0) + 1;
    return counts;
  }, {}), [unreadMessages]);

  const setSelectedUser = useCallback(
    (item) => dispatch(setReduxSelectedUser(item)),
    [dispatch]
  );
  const setReplyingTo = useCallback(
    (item) => dispatch(setReduxReplyingTo(item)),
    [dispatch]
  );

  const fetchUsers = useCallback(async () => {
    if (!user?._id) return [];
    try {
      return await refetchUsers().unwrap();
    } catch (error) {
      console.error('Fetch users error:', error);
      return [];
    }
  }, [refetchUsers, user?._id]);

  const fetchMessagesBetweenUsers = useCallback(async () => {
    if (!selectedUser?._id || !user?._id) return [];
    try {
      return await refetchMessages().unwrap();
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }, [refetchMessages, selectedUser?._id, user?._id]);

  const fetchMessagesByUser = useCallback(async () => {
    if (!user?._id) return [];
    try {
      return await refetchMessagesByUser().unwrap();
    } catch (error) {
      console.error('Error fetching messages by user:', error);
      return [];
    }
  }, [refetchMessagesByUser, user?._id]);

  const fetchUnreadMessages = useCallback(async () => {
    if (!user?._id) return [];
    try {
      return await refetchUnreadMessages().unwrap();
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      return [];
    }
  }, [refetchUnreadMessages, user?._id]);

  const markAllAsReadBetweenUsers = useCallback(async (target) => {
    const targetUserId = typeof target === 'string' ? target : target?._id;
    if (!targetUserId || !user?._id) return;
    try {
      await markReadRequest(targetUserId).unwrap();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [markReadRequest, user?._id]);

  const AddNewMessage = useCallback(async (text, images, replyTo = null) => {
    if (!selectedUser?._id || !user?._id) return null;

    const targetUserId = selectedUser._id;
    const tempId = `temp-${Date.now()}`;
    const tempPhotos = images?.map((image) => ({ url: URL.createObjectURL(image) })) || [];
    const tempMessage = {
      _id: tempId,
      text,
      Photos: tempPhotos,
      sender: user._id,
      receiver: targetUserId,
      createdAt: new Date().toISOString(),
      isRead: false,
      pending: true,
      ...(replyTo && { replyTo }),
    };
    const queryArg = { targetUserId, viewerId: user._id };
    const patch = dispatch(baseApi.util.updateQueryData('getMessages', queryArg, (draft) => {
      if (Array.isArray(draft)) draft.push(tempMessage);
    }));

    const formData = new FormData();
    images?.forEach((image) => formData.append('image', image));
    if (text) formData.append('text', text);
    if (replyTo) formData.append('replyTo', replyTo._id);

    try {
      const newMessage = await sendMessageRequest({
        targetUserId,
        currentUserId: user._id,
        formData,
      }).unwrap();
      dispatch(baseApi.util.updateQueryData('getMessages', queryArg, (draft) => {
        if (!Array.isArray(draft)) return;
        const index = draft.findIndex((message) => message._id === tempId);
        if (index !== -1) draft[index] = { ...newMessage, pending: false };
      }));
      await addNotify({
        content: `${user.username} sent you a message`,
        type: 'message',
        receiverId: targetUserId,
        actionRef: getMessageId(newMessage),
        actionModel: 'Message',
      });
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      patch.undo();
      showAlert('Failed to send message.');
      return null;
    }
  }, [addNotify, dispatch, selectedUser?._id, sendMessageRequest, showAlert, user]);

  const toggleLikeMessage = useCallback(async (messageId) => {
    if (!user?._id) return;
    try {
      await likeMessageRequest(messageId).unwrap();
    } catch (error) {
      console.error('Error liking message:', error);
    }
  }, [likeMessageRequest, user?._id]);

  const deleteMessage = useCallback(async (messageId) => {
    try {
      await deleteMessageRequest({
        id: messageId,
        targetUserId: selectedUser?._id,
        currentUserId: user?._id,
      }).unwrap();
      showAlert('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      showAlert('Failed to delete message');
    }
  }, [deleteMessageRequest, selectedUser?._id, showAlert, user?._id]);

  const deleteForMe = useCallback(async (messageId) => {
    try {
      await deleteMessageForMeRequest({
        id: messageId,
        targetUserId: selectedUser?._id,
        currentUserId: user?._id,
      }).unwrap();
      showAlert('Message removed for you');
    } catch (error) {
      console.error('Error deleting for me:', error);
    }
  }, [deleteMessageForMeRequest, selectedUser?._id, showAlert, user?._id]);

  const copyMessageText = useCallback((text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showAlert('Message copied to clipboard');
  }, [showAlert]);

  return useMemo(() => ({
    users,
    isUserLoading: usersQuery.isLoading,
    selectedUser,
    setSelectedUser,
    AddNewMessage,
    messages,
    isMessagesLoading: messagesQuery.isLoading,
    messagesByUser,
    markAllAsReadBetweenUsers,
    unReadedMessage: unreadMessages.length,
    unreadCountPerUser,
    fetchUsers,
    fetchMessagesBetweenUsers,
    fetchMessagesByUser,
    fetchUnreadMessages,
    toggleLikeMessage,
    deleteMessage,
    deleteForMe,
    copyMessageText,
    replyingTo,
    setReplyingTo,
  }), [
    users,
    usersQuery.isLoading,
    selectedUser,
    setSelectedUser,
    AddNewMessage,
    messages,
    messagesQuery.isLoading,
    messagesByUser,
    markAllAsReadBetweenUsers,
    unreadMessages.length,
    unreadCountPerUser,
    fetchUsers,
    fetchMessagesBetweenUsers,
    fetchMessagesByUser,
    fetchUnreadMessages,
    toggleLikeMessage,
    deleteMessage,
    deleteForMe,
    copyMessageText,
    replyingTo,
    setReplyingTo,
  ]);
};

export default useMessage;
