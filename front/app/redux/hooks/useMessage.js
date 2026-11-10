'use client';

import { useEffect, useCallback, useMemo, useRef } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useNotify } from './useNotification';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectConversationUsers,
  selectIsUserLoading,
  selectSelectedUser,
  selectMessages,
  selectIsMessagesLoading,
  selectMessagesByUser,
  selectReplyingTo,
  selectUnreadTotalMessages,
  selectUnreadCountPerUser,
} from '../features/messages/messagesSelectors';
import {
  setUsers as setReduxUsers,
  setIsUserLoading,
  setSelectedUser as setReduxSelectedUser,
  setMessages as setReduxMessages,
  addMessageToThread,
  updateMessageInThread,
  removeMessageFromThread,
  setIsMessagesLoading,
  setMessagesByUser as setReduxMessagesByUser,
  setReplyingTo as setReduxReplyingTo,
  setUnReadedMessage as setReduxUnreadMessage,
  setUnreadCountPerUser as setReduxUnreadCountPerUser,
  markReadForUser,
} from '../features/messages/messagesSlice';
import axios from 'axios';



export const useMessage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { addNotify } = useNotify();
  const { showAlert } = useFeedback();

  const users = useAppSelector(selectConversationUsers);
  const isUserLoading = useAppSelector(selectIsUserLoading);
  const selectedUser = useAppSelector(selectSelectedUser);
  const messages = useAppSelector(selectMessages);
  const isMessagesLoading = useAppSelector(selectIsMessagesLoading);
  const messagesByUser = useAppSelector(selectMessagesByUser);
  const replyingTo = useAppSelector(selectReplyingTo);
  const unReadedMessage = useAppSelector(selectUnreadTotalMessages);
  const unreadCountPerUser = useAppSelector(selectUnreadCountPerUser);

  const cancelSource = useRef(null);

  const setSelectedUser = useCallback(
    (u) => {
      dispatch(setReduxSelectedUser(u));
    },
    [dispatch]
  );

  const setReplyingTo = useCallback(
    (reply) => {
      dispatch(setReduxReplyingTo(reply));
    },
    [dispatch]
  );

  const fetchUsers = useCallback(async () => {
    if (!user?.token) return;
    dispatch(setIsUserLoading(true));

    cancelSource.current?.cancel?.();
    cancelSource.current = axios.CancelToken.source();

    try {
      const res = await api.get('/message/users', {
        cancelToken: cancelSource.current.token,
      });

      const formattedUsers = Array.isArray(res.data)
        ? res.data.map((u) => ({
            ...u,
            lastMessage: u.lastMessage || '',
            lastMessageAt: u.lastMessageAt ? new Date(u.lastMessageAt) : null,
            unreadCount: u.unreadCount || 0,
          }))
        : [];

      dispatch(setReduxUsers(formattedUsers));
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Fetch users error:', err);
      }
    } finally {
      dispatch(setIsUserLoading(false));
    }
  }, [user?.token, dispatch]);

  const fetchMessagesBetweenUsers = useCallback(async () => {
    if (!selectedUser?._id || !user?.token) return;
    dispatch(setIsMessagesLoading(true));

    try {
      const res = await api.get(`/message/messages/${selectedUser._id}`);
      dispatch(setReduxMessages(Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      dispatch(setIsMessagesLoading(false));
    }
  }, [selectedUser?._id, user?.token, dispatch]);

  const fetchMessagesByUser = useCallback(async () => {
    if (!user?._id || !user?.token) return;
    try {
      const res = await api.get(`/message/user/${user._id}`);
      dispatch(setReduxMessagesByUser(Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error('Error fetching messages by user:', err);
    }
  }, [user?._id, user?.token, dispatch]);

  const fetchUnreadMessages = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await api.get('/message/messages/unread');
      const unreadMessages = Array.isArray(res.data) ? res.data : [];
      const unreadCountPerUser = unreadMessages.reduce((counts, message) => {
        const senderId = message.sender?._id || message.sender;
        if (senderId) counts[senderId] = (counts[senderId] || 0) + 1;
        return counts;
      }, {});
      dispatch(setReduxUnreadMessage(unreadMessages.length));
      dispatch(setReduxUnreadCountPerUser(unreadCountPerUser));
    } catch (err) {
      console.error('Error fetching unread messages:', err);
    }
  }, [user?._id, dispatch]);

  const markAllAsReadBetweenUsers = useCallback(
    async (target) => {
      if (!target?._id || !user?._id) return;
      try {
        await api.patch(`/message/read/${target._id}`);
        dispatch(markReadForUser(target._id));
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    },
    [user?._id, dispatch]
  );

  const AddNewMessage = useCallback(
    async (text, images, replyTo = null) => {
      if (!selectedUser?._id || !user?.token) return;

      const tempId = Date.now().toString();
      const tempPhotos = images?.map((img) => ({ url: URL.createObjectURL(img) })) || [];

      const tempMessage = {
        _id: tempId,
        text,
        Photos: tempPhotos,
        sender: user._id,
        receiver: selectedUser._id,
        createdAt: new Date().toISOString(),
        isRead: false,
        pending: true,
        ...(replyTo && { replyTo }),
      };

      dispatch(addMessageToThread(tempMessage));

      try {
        const formData = new FormData();
        images?.forEach((img) => formData.append('image', img));
        if (text) formData.append('text', text);
        if (replyTo) formData.append('replyTo', replyTo._id);

        const res = await api.post(`/message/send/${selectedUser._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const newMessage = res.data;
        dispatch(updateMessageInThread({ _id: tempId, ...newMessage, pending: false }));

        await addNotify({
          content: `${user.username} sent you a message`,
          type: 'message',
          receiverId: selectedUser._id,
          actionRef: newMessage._id,
          actionModel: 'Message',
        });
      } catch (err) {
        console.error('Error sending message:', err);
        dispatch(updateMessageInThread({ _id: tempId, error: true, pending: false }));
        showAlert('Failed to send message.');
      }
    },
    [selectedUser, user, addNotify, showAlert, dispatch]
  );

  const toggleLikeMessage = useCallback(
    async (messageId) => {
      if (!user?._id) return;
      try {
        await api.patch(`/message/like/${messageId}`);
      } catch (err) {
        console.error('Error liking message:', err);
      }
    },
    [user?._id]
  );

  const deleteMessage = useCallback(
    async (messageId) => {
      try {
        await api.delete(`/message/delete/${messageId}`);
        dispatch(removeMessageFromThread(messageId));
        showAlert('Message deleted');
      } catch (err) {
        console.error('Error deleting message:', err);
        showAlert('Failed to delete message');
      }
    },
    [dispatch, showAlert]
  );

  const deleteForMe = useCallback(
    async (messageId) => {
      try {
        await api.patch(`/message/deleteFor/${messageId}`);
        dispatch(removeMessageFromThread(messageId));
        showAlert('Message removed for you');
      } catch (err) {
        console.error('Error deleting for me:', err);
      }
    },
    [dispatch, showAlert]
  );

  const copyMessageText = useCallback(
    (text) => {
      if (!text) return;
      navigator.clipboard.writeText(text);
      showAlert('Message copied to clipboard');
    },
    [showAlert]
  );

  useEffect(() => {
    fetchUsers();
    return () => cancelSource.current?.cancel?.();
  }, [fetchUsers]);

  useEffect(() => {
    fetchMessagesBetweenUsers();
  }, [fetchMessagesBetweenUsers]);

  useEffect(() => {
    fetchMessagesByUser();
  }, [fetchMessagesByUser]);

  useEffect(() => {
    fetchUnreadMessages();
  }, [fetchUnreadMessages]);

  return useMemo(
    () => ({
      users,
      isUserLoading,
      selectedUser,
      setSelectedUser,
      AddNewMessage,
      messages,
      isMessagesLoading,
      messagesByUser,
      markAllAsReadBetweenUsers,
      unReadedMessage,
      unreadCountPerUser,
      fetchUnreadMessages,
      toggleLikeMessage,
      deleteMessage,
      deleteForMe,
      copyMessageText,
      replyingTo,
      setReplyingTo,
    }),
    [
      users,
      isUserLoading,
      selectedUser,
      setSelectedUser,
      AddNewMessage,
      messages,
      isMessagesLoading,
      messagesByUser,
      markAllAsReadBetweenUsers,
      unReadedMessage,
      unreadCountPerUser,
      fetchUnreadMessages,
      toggleLikeMessage,
      deleteMessage,
      deleteForMe,
      copyMessageText,
      replyingTo,
      setReplyingTo,
    ]
  );
};

export default useMessage;
