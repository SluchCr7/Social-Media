import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reels: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  showModelAddReel: false,
};

export const reelsSlice = createSlice({
  name: 'reels',
  initialState,
  reducers: {
    setReels: (state, action) => {
      state.reels = Array.isArray(action.payload) ? action.payload : [];
    },
    addReelToState: (state, action) => {
      state.reels = [action.payload, ...state.reels];
    },
    updateReelInState: (state, action) => {
      const updated = action.payload;
      state.reels = state.reels.map((r) => (r._id === updated._id ? { ...r, ...updated } : r));
    },
    removeReelFromState: (state, action) => {
      const id = action.payload;
      state.reels = state.reels.filter((r) => r._id !== id);
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setShowModelAddReel: (state, action) => {
      state.showModelAddReel = action.payload;
    },
    optimisticLikeReel: (state, action) => {
      const { reelId, userId } = action.payload;
      state.reels = state.reels.map((r) => {
        if (r._id === reelId) {
          const isLiked = r.likes?.includes(userId);
          const newLikes = isLiked
            ? r.likes.filter((uid) => uid !== userId)
            : [...(r.likes || []), userId];
          return { ...r, likes: newLikes };
        }
        return r;
      });
    },
  },
});

export const {
  setReels,
  addReelToState,
  updateReelInState,
  removeReelFromState,
  setPage,
  setHasMore,
  setIsLoading,
  setShowModelAddReel,
  optimisticLikeReel,
} = reelsSlice.actions;

export default reelsSlice.reducer;
