import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocketConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setSocketConnected } = socketSlice.actions;

export default socketSlice.reducer;
