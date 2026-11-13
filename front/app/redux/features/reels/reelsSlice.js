import { createSlice } from '@reduxjs/toolkit';

const initialState = { showModelAddReel: false };

export const reelsSlice = createSlice({
  name: 'reels',
  initialState,
  reducers: {
    setShowModelAddReel: (state, action) => {
      state.showModelAddReel = action.payload;
    },
  },
});

export const { setShowModelAddReel } = reelsSlice.actions;
export default reelsSlice.reducer;
