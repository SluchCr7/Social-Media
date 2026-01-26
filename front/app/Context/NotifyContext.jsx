'use client';

import axios from "axios";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";
import { useFeedback } from "./FeedbackContext";

const NotifyContext = createContext();

export const useNotify = () => {
  const context = useContext(NotifyContext);
  if (!context) {
    throw new Error('useNotify must be used within a NotifyContextProvider');
  }
  return context;
};

export const NotifyContextProvider = ({ children }) => {
  const [notificationsByUser, setNotificationsByUser] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { socket } = useSocket();
  const { showToast } = useFeedback();

  const getAuthHeader = useCallback(() => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  }), [user?.token]);

  // --- Persistent Notification Actions ---

  /**
   * Add a notification for a user (called by other contexts/components)
   */
  const addNotify = useCallback(async ({ content, type = 'custom', receiverId, actionRef, actionModel }) => {
    if (!receiverId || receiverId === user?._id || !user?.token) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${receiverId}`,
        { content, type, actionRef, actionModel },
        getAuthHeader()
      );
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
  }, [user?._id, user?.token, getAuthHeader]);

  /**
   * Delete a single notification
   */
  const deleteNotify = useCallback(async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${id}`,
        getAuthHeader()
      );
      setNotificationsByUser(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, [getAuthHeader]);

  /**
   * Clear all user notifications
   */
  const clearAllNotifications = useCallback(async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/clear`,
        getAuthHeader()
      );
      setNotificationsByUser([]);
      setUnreadCount(0);
      showToast('Notifications cleared successfully.', 'success');
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  }, [getAuthHeader, showToast]);

  /**
   * Mark a notification as read
   */
  const markAsRead = useCallback(async (id) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/${id}/read`,
        {},
        getAuthHeader()
      );
      setNotificationsByUser(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(prev - 1, 0));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, [getAuthHeader]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/read-all`,
        {},
        getAuthHeader()
      );
      setNotificationsByUser(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, [getAuthHeader]);

  /**
   * Fetch all notifications for current user
   */
  const fetchUserNotifications = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/user`,
        getAuthHeader()
      );
      setNotificationsByUser(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user?.token, getAuthHeader]);

  /**
   * Fetch unread notifications count
   */
  const fetchUnreadCount = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/notification/user/unread-count`,
        getAuthHeader()
      );
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [user?.token, getAuthHeader]);

  // --- Real-time Socket Listener ---
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notify) => {
      setNotificationsByUser(prev => {
        if (prev.some(n => n._id === notify._id)) return prev;
        return [notify, ...prev];
      });
      setUnreadCount(prev => prev + 1);
      showToast(notify.content || "You have a new notification!", 'info');
    };

    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, [socket, showToast]);

  // --- Initial Data Fetch ---
  useEffect(() => {
    if (user?.token) {
      fetchUserNotifications();
      fetchUnreadCount();
    }
  }, [user?.token, fetchUserNotifications, fetchUnreadCount]);

  const value = useMemo(() => ({
    notificationsByUser,
    unreadCount,
    addNotify,
    deleteNotify,
    clearAllNotifications,
    markAsRead,
    markAllAsRead,
    fetchUserNotifications,
    fetchUnreadCount,
    setNotificationsByUser,
    setUnreadCount
  }), [
    notificationsByUser, unreadCount, addNotify, deleteNotify,
    clearAllNotifications, markAsRead, markAllAsRead,
    fetchUserNotifications, fetchUnreadCount
  ]);

  return (
    <NotifyContext.Provider value={value}>
      {children}
    </NotifyContext.Provider>
  );
};
