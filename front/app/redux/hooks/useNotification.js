'use client';

import { useEffect, useCallback, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectNotifications,
  selectUnreadNotificationsCount,
} from '../features/notifications/notificationsSelectors';
import {
  setNotificationsByUser as setReduxNotifications,
  setUnreadCount as setReduxUnreadCount,
  removeNotificationFromState,
  clearAllNotificationsState,
  markNotificationAsReadState,
  markAllNotificationsAsReadState,
} from '../features/notifications/notificationsSlice';



export const useNotify = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showToast } = useFeedback();

  const notificationsByUser = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadNotificationsCount);

  const setNotificationsByUser = useCallback(
    (data) => {
      dispatch(setReduxNotifications(data));
    },
    [dispatch]
  );

  const setUnreadCount = useCallback(
    (count) => {
      dispatch(setReduxUnreadCount(count));
    },
    [dispatch]
  );

  const addNotify = useCallback(
    async ({ content, type = 'custom', receiverId, actionRef, actionModel }) => {
      if (!receiverId || receiverId === user?._id || !user?.token) return;
      try {
        await api.post(`/notification/${receiverId}`, { content, type, actionRef, actionModel });
      } catch (err) {
        console.error('Failed to send notification:', err);
      }
    },
    [user?._id, user?.token]
  );

  const deleteNotify = useCallback(
    async (id) => {
      try {
        await api.delete(`/notification/${id}`);
        dispatch(removeNotificationFromState(id));
      } catch (err) {
        console.error('Failed to delete notification:', err);
      }
    },
    [dispatch]
  );

  const clearAllNotifications = useCallback(async () => {
    try {
      await api.delete('/notification/clear');
      dispatch(clearAllNotificationsState());
      showToast('Notifications cleared successfully.', 'success');
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  }, [dispatch, showToast]);

  const markAsRead = useCallback(
    async (id) => {
      try {
        await api.patch(`/notification/${id}/read`, {});
        dispatch(markNotificationAsReadState(id));
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    },
    [dispatch]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch('/notification/read-all', {});
      dispatch(markAllNotificationsAsReadState());
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, [dispatch]);

  const fetchUserNotifications = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await api.get('/notification/user');
      dispatch(setReduxNotifications(Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user?.token, dispatch]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await api.get('/notification/user/unread-count');
      dispatch(setReduxUnreadCount(res.data.unreadCount || 0));
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [user?.token, dispatch]);

  useEffect(() => {
    if (user?.token) {
      fetchUserNotifications();
      fetchUnreadCount();
    }
  }, [user?.token, fetchUserNotifications, fetchUnreadCount]);

  return useMemo(
    () => ({
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
      setUnreadCount,
    }),
    [
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
      setUnreadCount,
    ]
  );
};

export default useNotify;
