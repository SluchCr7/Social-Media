import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suggestedUsers: [],
  onlineUsers: [],
  loading: false,
  updateProfileLoading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = Array.isArray(action.payload) ? action.payload : [];
    },
    updateSuggestedUser: (state, action) => {
      const updated = action.payload;
      if (!updated?._id) return;
      state.suggestedUsers = state.suggestedUsers.map((u) => (u._id === updated._id ? { ...u, ...updated } : u));
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = Array.isArray(action.payload) ? action.payload : [];
    },
    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUpdateProfileLoading: (state, action) => {
      state.updateProfileLoading = action.payload;
    },
  },
});

export const {
  setSuggestedUsers,
  updateSuggestedUser,
  setOnlineUsers,
  setUserLoading,
  setUpdateProfileLoading,
} = userSlice.actions;

export default userSlice.reducer;
