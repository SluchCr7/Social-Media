import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  explorePosts: [],
  suggestedUsers: [],
  trendingHashtags: [],
  trendingPosts: [],
  loading: false,
  error: null,
  exploreTab: 'trending',
  pagination: { page: 1, hasMore: false },
};

export const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    setExplorePosts: (state, action) => {
      state.explorePosts = Array.isArray(action.payload) ? action.payload : [];
    },
    appendExplorePosts: (state, action) => {
      const currentIds = new Set(state.explorePosts.map((post) => post._id));
      const newPosts = [];
      if (Array.isArray(action.payload)) {
        action.payload.forEach((post) => {
          if (!currentIds.has(post._id)) {
            currentIds.add(post._id);
            newPosts.push(post);
          }
        });
      }
      state.explorePosts.push(...newPosts);
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = Array.isArray(action.payload) ? action.payload : [];
    },
    setTrendingHashtags: (state, action) => {
      state.trendingHashtags = Array.isArray(action.payload) ? action.payload : [];
    },
    setTrendingPosts: (state, action) => {
      state.trendingPosts = Array.isArray(action.payload) ? action.payload : [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setExploreTab: (state, action) => {
      state.exploreTab = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
  },
});

export const {
  setExplorePosts,
  appendExplorePosts,
  setSuggestedUsers,
  setTrendingHashtags,
  setTrendingPosts,
  setLoading,
  setError,
  setExploreTab,
  setPagination,
} = exploreSlice.actions;

export default exploreSlice.reducer;
