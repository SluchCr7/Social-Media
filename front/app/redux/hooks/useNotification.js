'use client';

import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import {
  useAddNotificationMutation,
  useClearNotificationsMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '../features/notifications/notificationsApi';

const getErrorMessage = (error) =>
  error?.data?.message || error?.response?.data?.message || error?.message;
const EMPTY_NOTIFICATIONS = [];

export const useNotify = () => {
  const { user } = useAuth();
  const { showToast } = useFeedback();
  const notificationsQuery = useGetNotificationsQuery(
    { userId: user?._id },
    { skip: !user?._id }
  );
  const unreadQuery = useGetUnreadNotificationCountQuery(
    { userId: user?._id },
    { skip: !user?._id }
  );
  const [addNotificationRequest] = useAddNotificationMutation();
  const [deleteNotificationRequest] = useDeleteNotificationMutation();
  const [clearNotificationsRequest] = useClearNotificationsMutation();
  const [markReadRequest] = useMarkNotificationReadMutation();
  const [markAllReadRequest] = useMarkAllNotificationsReadMutation();
  const refetchNotifications = notificationsQuery.refetch;
  const refetchUnread = unreadQuery.refetch;

  const notificationsByUser = notificationsQuery.currentData || EMPTY_NOTIFICATIONS;
  const unreadCount = Number(unreadQuery.currentData?.unreadCount) || 0;

  const addNotify = useCallback(async ({
    content,
    type = 'custom',
    receiverId,
    actionRef,
    actionModel,
  }) => {
    if (!receiverId || receiverId === user?._id || !user?._id) return;
    try {
      await addNotificationRequest({ receiverId, content, type, actionRef, actionModel }).unwrap();
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }, [addNotificationRequest, user?._id]);

  const deleteNotify = useCallback(async (id) => {
    try {
      await deleteNotificationRequest(id).unwrap();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, [deleteNotificationRequest]);

  const clearAllNotifications = useCallback(async () => {
    try {
      await clearNotificationsRequest().unwrap();
      showToast('Notifications cleared successfully.', 'success');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      showToast(getErrorMessage(error) || 'Failed to clear notifications.', 'error');
    }
  }, [clearNotificationsRequest, showToast]);

  const markAsRead = useCallback(async (id) => {
    try {
      await markReadRequest(id).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [markReadRequest]);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllReadRequest().unwrap();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [markAllReadRequest]);

  const fetchUserNotifications = useCallback(async () => {
    if (!user?._id) return [];
    try {
      return await refetchNotifications().unwrap();
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }, [refetchNotifications, user?._id]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user?._id) return 0;
    try {
      const result = await refetchUnread().unwrap();
      return Number(result?.unreadCount) || 0;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      return 0;
    }
  }, [refetchUnread, user?._id]);

  return useMemo(() => ({
    notificationsByUser,
    unreadCount,
    addNotify,
    deleteNotify,
    clearAllNotifications,
    markAsRead,
    markAllAsRead,
    fetchUserNotifications,
    fetchUnreadCount,
  }), [
    notificationsByUser,
    unreadCount,
    addNotify,
    deleteNotify,
    clearAllNotifications,
    markAsRead,
    markAllAsRead,
    fetchUserNotifications,
    fetchUnreadCount,
  ]);
};

export default useNotify;
