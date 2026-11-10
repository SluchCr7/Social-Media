import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notificationsByUser: [],
  unreadCount: 0,
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationsByUser: (state, action) => {
      state.notificationsByUser = Array.isArray(action.payload) ? action.payload : [];
    },
    addNotificationToState: (state, action) => {
      const notify = action.payload;
      if (!state.notificationsByUser.some((n) => n._id === notify._id)) {
        state.notificationsByUser = [notify, ...state.notificationsByUser];
      }
    },
    updateNotificationInState: (state, action) => {
      const updated = action.payload;
      state.notificationsByUser = state.notificationsByUser.map((n) => (n._id === updated._id ? { ...n, ...updated } : n));
    },
    removeNotificationFromState: (state, action) => {
      const id = action.payload;
      state.notificationsByUser = state.notificationsByUser.filter((n) => n._id !== id);
    },
    clearAllNotificationsState: (state) => {
      state.notificationsByUser = [];
      state.unreadCount = 0;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount = (state.unreadCount || 0) + 1;
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max((state.unreadCount || 0) - 1, 0);
    },
    markNotificationAsReadState: (state, action) => {
      const id = action.payload;
      state.notificationsByUser = state.notificationsByUser.map((n) => (n._id === id ? { ...n, isRead: true } : n));
      state.unreadCount = Math.max((state.unreadCount || 0) - 1, 0);
    },
    markAllNotificationsAsReadState: (state) => {
      state.notificationsByUser = state.notificationsByUser.map((n) => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotificationsByUser,
  addNotificationToState,
  updateNotificationInState,
  removeNotificationFromState,
  clearAllNotificationsState,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  markNotificationAsReadState,
  markAllNotificationsAsReadState,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
