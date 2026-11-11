import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reels: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null,
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
      const reel = action.payload;
      if (!reel?._id) return;
      const existingIndex = state.reels.findIndex((item) => item._id === reel._id);
      if (existingIndex < 0) state.reels.unshift(reel);
      else state.reels[existingIndex] = { ...state.reels[existingIndex], ...reel };
    },
    updateReelInState: (state, action) => {
      const updated = action.payload;
      if (!updated?._id) return;
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
    setError: (state, action) => {
      state.error = action.payload;
    },
    setShowModelAddReel: (state, action) => {
      state.showModelAddReel = action.payload;
    },
    optimisticLikeReel: (state, action) => {
      const { reelId, userId } = action.payload;
      state.reels = state.reels.map((r) => {
        if (r._id === reelId) {
          const likes = r.likes || [];
          const isLiked = likes.some((id) => (id?._id || id)?.toString() === userId?.toString());
          const newLikes = isLiked
            ? likes.filter((id) => (id?._id || id)?.toString() !== userId?.toString())
            : [...likes, userId];
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
  setError,
  setShowModelAddReel,
  optimisticLikeReel,
} = reelsSlice.actions;

export default reelsSlice.reducer;
