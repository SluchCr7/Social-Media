'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";
import { useNotify } from "./NotifyContext";
import { useAlert } from "./AlertContext";
import { useSocket } from "./SocketContext";
import { useMessageActions } from "../Custome/Message/useMesssageActions";
import { useUnReadMessage } from "../Custome/Message/useUnReadMessage";
import axios from "axios"; // Still needed for CancelToken if we want that, but api instance is preferred.

export const MessageContext = createContext();

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageContextProvider');
  }
  return context;
};

export const MessageContextProvider = ({ children }) => {
  const { user } = useAuth();
  const { addNotify } = useNotify();
  const { showAlert } = useAlert();
  const { socket } = useSocket();

  // --- State ---
  const [users, setUsers] = useState([]);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesByUser, setMessagesByUser] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [unReadedMessage, setUnReadedMessage] = useState(0);
  const [unreadCountPerUser, setUnreadCountPerUser] = useState({});

  // --- Hooks ---
  const { toggleLikeMessage, deleteMessage, deleteForMe, copyMessageText } = useMessageActions({
    user,
    showAlert,
    setMessages
  });

  const { fetchUnreadMessages, markAllAsReadBetweenUsers, updateUnreadCounters } = useUnReadMessage({
    user,
    setUnReadedMessage,
    setUnreadCountPerUser,
    unreadCountPerUser
  });

  const cancelSource = useRef(null);

  /**
   * Fetch conversation users
   */
  const fetchUsers = useCallback(async () => {
    if (!user?.token) return;
    setIsUserLoading(true);

    // Cancel previous request if any
    cancelSource.current?.cancel?.();
    cancelSource.current = axios.CancelToken.source();

    try {
      const res = await api.get('/message/users', {
        cancelToken: cancelSource.current.token
      });

      const formattedUsers = Array.isArray(res.data) ? res.data.map(u => ({
        ...u,
        lastMessage: u.lastMessage || "",
        lastMessageAt: u.lastMessageAt ? new Date(u.lastMessageAt) : null,
        unreadCount: u.unreadCount || 0
      })) : [];

      setUsers(formattedUsers);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Fetch users error:', err);
      }
    } finally {
      setIsUserLoading(false);
    }
  }, [user?.token]);

  /**
   * Fetch messages between selected user and current user
   */
  const fetchMessagesBetweenUsers = useCallback(async () => {
    if (!selectedUser?._id || !user?.token) return;
    setIsMessagesLoading(true);

    try {
      const res = await api.get(`/message/messages/${selectedUser._id}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsMessagesLoading(false);
    }
  }, [selectedUser?._id, user?.token]);

  /**
   * Add a new message
   */
  const AddNewMessage = useCallback(async (text, images, replyTo = null) => {
    if (!selectedUser?._id || !user?.token) return;

    const tempId = Date.now().toString();
    const tempPhotos = images?.map(img => ({ url: URL.createObjectURL(img) })) || [];

    const tempMessage = {
      _id: tempId,
      text,
      Photos: tempPhotos,
      sender: user._id,
      receiver: selectedUser._id,
      createdAt: new Date().toISOString(),
      isRead: false,
      pending: true,
      ...(replyTo && { replyTo })
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const formData = new FormData();
      images?.forEach(img => formData.append("image", img));
      if (text) formData.append("text", text);
      if (replyTo) formData.append("replyTo", replyTo._id);

      const res = await api.post(`/message/send/${selectedUser._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const newMessage = res.data;
      setMessages(prev => prev.map(m => (m._id === tempId ? { ...newMessage, pending: false } : m)));

      await addNotify({
        content: `${user.username} sent you a message`,
        type: "message",
        receiverId: selectedUser._id,
        actionRef: newMessage._id,
        actionModel: "Message"
      });

    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => prev.map(m => (m._id === tempId ? { ...m, error: true, pending: false } : m)));
      showAlert("Failed to send message.");
    }
  }, [selectedUser, user, addNotify, showAlert]);

  /**
   * Fetch messages sent by current user
   */
  const fetchMessagesByUser = useCallback(async () => {
    if (!user?._id || !user?.token) return;
    try {
      const res = await api.get(`/message/user/${user._id}`);
      setMessagesByUser(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching messages by user:', err);
    }
  }, [user?._id, user?.token]);

  // --- Effects ---

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

  // Socket listener
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (message) => {
      const senderId = message.sender?._id || message.sender;
      // If we are chatting with this user, add to list
      if (selectedUser?._id === senderId) {
        setMessages(prev => [...prev, message]);
        // Mark as read locally or notify "read"? 
        // We usually mark read on focus or explicit action.
      }
      updateUnreadCounters(message);
    };

    const handleMessageLike = ({ messageId, userId, action }) => {
      setMessages(prev => prev.map(m => {
        if (m._id === messageId) {
          let newLikes = m.likes || [];
          // Ensure we don't duplicate ID if already there
          if (action === "liked" && !newLikes.includes(userId)) {
            newLikes = [...newLikes, userId];
          } else if (action === "unliked") {
            newLikes = newLikes.filter(id => id !== userId);
          }
          return { ...m, likes: newLikes };
        }
        return m;
      }));
    };

    const handleDeleteMessage = (messageId) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageLikeUpdate", handleMessageLike);
    socket.on("message:delete", handleDeleteMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageLikeUpdate", handleMessageLike);
      socket.off("message:delete", handleDeleteMessage);
    };
  }, [socket, selectedUser, updateUnreadCounters]);

  // Context value
  const contextValue = useMemo(() => ({
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
    setReplyingTo
  }), [
    users, isUserLoading, selectedUser, messages, isMessagesLoading,
    messagesByUser, markAllAsReadBetweenUsers, unReadedMessage, unreadCountPerUser,
    fetchUnreadMessages, toggleLikeMessage, deleteMessage, deleteForMe, copyMessageText,
    replyingTo
  ]);

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};
