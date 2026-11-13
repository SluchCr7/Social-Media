import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  onlineUsers: [],
  showAllSuggestedUsers: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = Array.isArray(action.payload) ? action.payload : [];
    },
    setShowAllSuggestedUsers: (state, action) => {
      state.showAllSuggestedUsers = Boolean(action.payload);
    },
  },
});

export const { setOnlineUsers, setShowAllSuggestedUsers } = userSlice.actions;

export default userSlice.reducer;
