import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  optimisticPosts: [],
  imageView: null,
  showPostModelEdit: false,
  postIsEdit: null,
  isLoadingPostCreated: false,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addOptimisticPost: (state, action) => {
      if (!state.optimisticPosts.some((post) => post._id === action.payload?._id)) {
        state.optimisticPosts.unshift(action.payload);
      }
    },
    removeOptimisticPost: (state, action) => {
      state.optimisticPosts = state.optimisticPosts.filter((post) => post._id !== action.payload);
    },
    setImageView: (state, action) => {
      state.imageView = action.payload;
    },
    setShowPostModelEdit: (state, action) => {
      state.showPostModelEdit = action.payload;
    },
    setPostIsEdit: (state, action) => {
      state.postIsEdit = action.payload;
    },
    setIsLoadingPostCreated: (state, action) => {
      state.isLoadingPostCreated = action.payload;
    },
  },
});

export const {
  addOptimisticPost,
  removeOptimisticPost,
  setImageView,
  setShowPostModelEdit,
  setPostIsEdit,
  setIsLoadingPostCreated,
} = postsSlice.actions;

export default postsSlice.reducer;
