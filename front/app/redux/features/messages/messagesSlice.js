import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedUser: null,
  replyingTo: null,
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setReplyingTo: (state, action) => {
      state.replyingTo = action.payload;
    },
  },
});

export const { setSelectedUser, setReplyingTo } = messagesSlice.actions;
export default messagesSlice.reducer;
