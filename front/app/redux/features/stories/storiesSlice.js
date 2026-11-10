import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stories: [],
  isLoading: false,
  isStory: false,
};

export const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setStories: (state, action) => {
      state.stories = Array.isArray(action.payload) ? action.payload : [];
    },
    addStoryToState: (state, action) => {
      const story = action.payload;
      if (!state.stories.some((s) => s._id === story._id)) {
        state.stories = [story, ...state.stories];
      }
    },
    updateStoryInState: (state, action) => {
      const updated = action.payload;
      state.stories = state.stories.map((s) => (s._id === updated._id ? { ...s, ...updated } : s));
    },
    removeStoryFromState: (state, action) => {
      const id = action.payload;
      state.stories = state.stories.filter((s) => s._id !== id);
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsStory: (state, action) => {
      state.isStory = action.payload;
    },
    optimisticLoveStory: (state, action) => {
      const { storyId, userId } = action.payload;
      state.stories = state.stories.map((s) => {
        if (s._id === storyId) {
          const isLoved = s.loves?.includes(userId);
          const newLoves = isLoved ? s.loves.filter((id) => id !== userId) : [...(s.loves || []), userId];
          return { ...s, loves: newLoves };
        }
        return s;
      });
    },
    optimisticReactStory: (state, action) => {
      const { storyId, userId, emoji } = action.payload;
      state.stories = state.stories.map((s) => {
        if (s._id === storyId) {
          const reactions = s.reactions || [];
          const idx = reactions.findIndex((r) => r.user === userId || r.user?._id === userId);
          let newReactions = [...reactions];
          if (idx > -1) {
            newReactions[idx] = { ...newReactions[idx], emoji, createdAt: new Date().toISOString() };
          } else {
            newReactions.push({ user: userId, emoji, createdAt: new Date().toISOString() });
          }
          return { ...s, reactions: newReactions };
        }
        return s;
      });
    },
  },
});

export const {
  setStories,
  addStoryToState,
  updateStoryInState,
  removeStoryFromState,
  setIsLoading,
  setIsStory,
  optimisticLoveStory,
  optimisticReactStory,
} = storiesSlice.actions;

export default storiesSlice.reducer;
