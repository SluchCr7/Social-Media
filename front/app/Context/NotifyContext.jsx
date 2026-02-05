'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import api from "../utils/api";
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

  // --- Persistent Notification Actions ---

  /**
   * Add a notification for a user (called by other contexts/components)
   */
  const addNotify = useCallback(async ({ content, type = 'custom', receiverId, actionRef, actionModel }) => {
    if (!receiverId || receiverId === user?._id || !user?.token) return;
    try {
      await api.post(`/notification/${receiverId}`, { content, type, actionRef, actionModel });
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
  }, [user?._id, user?.token]);

  /**
   * Delete a single notification
   */
  const deleteNotify = useCallback(async (id) => {
    try {
      await api.delete(`/notification/${id}`);
      setNotificationsByUser(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, []);

  /**
   * Clear all user notifications
   */
  const clearAllNotifications = useCallback(async () => {
    try {
      await api.delete('/notification/clear');
      setNotificationsByUser([]);
      setUnreadCount(0);
      showToast('Notifications cleared successfully.', 'success');
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  }, [showToast]);

  /**
   * Mark a notification as read
   */
  const markAsRead = useCallback(async (id) => {
    try {
      await api.patch(`/notification/${id}/read`, {});
      setNotificationsByUser(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(prev - 1, 0));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch('/notification/read-all', {});
      setNotificationsByUser(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  /**
   * Fetch all notifications for current user
   */
  const fetchUserNotifications = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await api.get('/notification/user');
      setNotificationsByUser(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user?.token]);

  /**
   * Fetch unread notifications count
   */
  const fetchUnreadCount = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await api.get('/notification/user/unread-count');
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [user?.token]);

  // --- Real-time Socket Listener ---
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notify) => {
      // Prevent duplicate
      setNotificationsByUser(prev => {
        if (prev.some(n => n._id === notify._id)) return prev;
        return [notify, ...prev];
      });
      setUnreadCount(prev => prev + 1);
      showToast(notify.content || "You have a new notification!", 'info');
    };

    const handleUpdate = (updated) => {
      setNotificationsByUser(prev => prev.map(n => n._id === updated._id ? updated : n));
      // If marked as read, decrease count
      if (updated.isRead) {
        setUnreadCount(prev => {
          // Check if it was already read locally? Hard to know strict sync state.
          // But usually this event comes from "markAsRead".
          return Math.max(0, prev - 1);
        });
      }
    };

    const handleDelete = (id) => {
      setNotificationsByUser(prev => prev.filter(n => n._id !== id));
      // Use fetchUnreadCount to ensure accuracy
      fetchUnreadCount();
    };

    const handleReadAll = () => {
      setNotificationsByUser(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    };

    const handleClearAll = () => {
      setNotificationsByUser([]);
      setUnreadCount(0);
    };

    socket.on("notification", handleNotification);
    socket.on("notification:update", handleUpdate);
    socket.on("notification:delete", handleDelete);
    socket.on("notification:read-all", handleReadAll);
    socket.on("notification:clear-all", handleClearAll);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("notification:update", handleUpdate);
      socket.off("notification:delete", handleDelete);
      socket.off("notification:read-all", handleReadAll);
      socket.off("notification:clear-all", handleClearAll);
    };
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
