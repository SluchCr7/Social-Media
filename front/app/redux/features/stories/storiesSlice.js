import { createSlice } from '@reduxjs/toolkit';

const initialState = { isStory: false };

export const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setIsStory: (state, action) => {
      state.isStory = action.payload;
    },
  },
});

export const { setIsStory } = storiesSlice.actions;
export default storiesSlice.reducer;
