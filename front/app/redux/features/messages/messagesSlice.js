import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  isUserLoading: false,
  selectedUser: null,
  messages: [],
  isMessagesLoading: false,
  messagesByUser: [],
  replyingTo: null,
  unReadedMessage: 0,
  unreadCountPerUser: {},
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = Array.isArray(action.payload) ? action.payload : [];
    },
    setIsUserLoading: (state, action) => {
      state.isUserLoading = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = Array.isArray(action.payload) ? action.payload : [];
    },
    addMessageToThread: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessageInThread: (state, action) => {
      const updated = action.payload;
      state.messages = state.messages.map((m) => (m._id === updated._id ? { ...m, ...updated } : m));
    },
    removeMessageFromThread: (state, action) => {
      const id = action.payload;
      state.messages = state.messages.filter((m) => m._id !== id);
    },
    setIsMessagesLoading: (state, action) => {
      state.isMessagesLoading = action.payload;
    },
    setMessagesByUser: (state, action) => {
      state.messagesByUser = Array.isArray(action.payload) ? action.payload : [];
    },
    setReplyingTo: (state, action) => {
      state.replyingTo = action.payload;
    },
    setUnReadedMessage: (state, action) => {
      state.unReadedMessage = action.payload;
    },
    setUnreadCountPerUser: (state, action) => {
      state.unreadCountPerUser = action.payload;
    },
    updateUnreadOnNewMessage: (state, action) => {
      const message = action.payload;
      const senderId = message?.sender?._id || message?.sender;
      if (senderId && state.selectedUser?._id !== senderId) {
        state.unReadedMessage = (state.unReadedMessage || 0) + 1;
        state.unreadCountPerUser = {
          ...state.unreadCountPerUser,
          [senderId]: (state.unreadCountPerUser[senderId] || 0) + 1,
        };
      }
    },
    markReadForUser: (state, action) => {
      const userId = action.payload;
      const countForUser = state.unreadCountPerUser[userId] || 0;
      state.unReadedMessage = Math.max(0, state.unReadedMessage - countForUser);
      state.unreadCountPerUser = {
        ...state.unreadCountPerUser,
        [userId]: 0,
      };
      state.messages = state.messages.map((m) => ({ ...m, isRead: true }));
    },
  },
});

export const {
  setUsers,
  setIsUserLoading,
  setSelectedUser,
  setMessages,
  addMessageToThread,
  updateMessageInThread,
  removeMessageFromThread,
  setIsMessagesLoading,
  setMessagesByUser,
  setReplyingTo,
  setUnReadedMessage,
  setUnreadCountPerUser,
  updateUnreadOnNewMessage,
  markReadForUser,
} = messagesSlice.actions;

export default messagesSlice.reducer;
