import { createSlice } from '@reduxjs/toolkit';

const initialState = { exploreTab: 'trending' };

export const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    setExploreTab: (state, action) => {
      state.exploreTab = action.payload;
    },
  },
});

export const { setExploreTab } = exploreSlice.actions;
export default exploreSlice.reducer;
