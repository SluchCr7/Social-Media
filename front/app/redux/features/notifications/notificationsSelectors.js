import { createSelector } from '@reduxjs/toolkit';

const EMPTY_ARRAY = [];

export const selectNotificationsState = (state) => state.notifications;
export const selectNotifications = createSelector([selectNotificationsState], (n) => n?.notificationsByUser || EMPTY_ARRAY);
export const selectUnreadNotificationsCount = createSelector([selectNotificationsState], (n) => n?.unreadCount || 0);
