import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  userPosts: [],
  memories: [],
  memoriesLoading: false,
  imageView: null,
  showPostModelEdit: false,
  postIsEdit: null,
  page: 1,
  hasMore: true,
  loadedPage: 0,
  userHasMore: true,
  userIsLoading: false,
  isLoading: false,
  isLoadingPostCreated: false,
  error: null,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = Array.isArray(action.payload) ? action.payload : [];
    },
    appendPosts: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.posts.push(...items.filter((item) => !state.posts.some((post) => post._id === item?._id)));
    },
    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    updatePostInState: (state, action) => {
      const updated = action.payload;
      if (!updated?._id) return;
      state.posts = state.posts.map((p) => (p._id === updated._id ? { ...p, ...updated } : p));
      state.userPosts = state.userPosts.map((p) => (p._id === updated._id ? { ...p, ...updated } : p));
      state.memories = state.memories.map((p) => (p._id === updated._id ? { ...p, ...updated } : p));
    },
    removePostFromState: (state, action) => {
      const id = action.payload;
      state.posts = state.posts.filter((p) => p._id !== id);
      state.userPosts = state.userPosts.filter((p) => p._id !== id);
      state.memories = state.memories.filter((p) => p._id !== id);
    },
    setUserPosts: (state, action) => {
      state.userPosts = Array.isArray(action.payload) ? action.payload : [];
    },
    appendUserPosts: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.userPosts.push(...items.filter((item) => !state.userPosts.some((post) => post._id === item?._id)));
    },
    setMemories: (state, action) => {
      state.memories = Array.isArray(action.payload) ? action.payload : [];
    },
    setMemoriesLoading: (state, action) => {
      state.memoriesLoading = action.payload;
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
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setLoadedPage: (state, action) => {
      state.loadedPage = Math.max(state.loadedPage, action.payload);
    },
    setUserHasMore: (state, action) => {
      state.userHasMore = action.payload;
    },
    setUserIsLoading: (state, action) => {
      state.userIsLoading = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsLoadingPostCreated: (state, action) => {
      state.isLoadingPostCreated = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    optimisticLikePost: (state, action) => {
      const { postId, userId } = action.payload;
      const updateList = (list) =>
        list.map((p) => {
          if (p._id === postId) {
            if (p.hahas?.includes(userId)) return p;
            const isLiked = p.likes?.includes(userId);
            const newLikes = isLiked ? p.likes.filter((id) => id !== userId) : [...(p.likes || []), userId];
            return { ...p, likes: newLikes };
          }
          return p;
        });
      state.posts = updateList(state.posts);
      state.userPosts = updateList(state.userPosts);
    },
    optimisticHahaPost: (state, action) => {
      const { postId, userId } = action.payload;
      const updateList = (list) =>
        list.map((p) => {
          if (p._id === postId) {
            if (p.likes?.includes(userId)) return p;
            const isHahed = p.hahas?.includes(userId);
            const newHahas = isHahed ? p.hahas.filter((id) => id !== userId) : [...(p.hahas || []), userId];
            return { ...p, hahas: newHahas };
          }
          return p;
        });
      state.posts = updateList(state.posts);
      state.userPosts = updateList(state.userPosts);
    },
    optimisticSavePost: (state, action) => {
      const { postId, userId } = action.payload;
      const updateList = (list) =>
        list.map((p) => {
          if (p._id === postId) {
            const isSaved = p.saved?.includes(userId);
            const newSaved = isSaved ? p.saved.filter((id) => id !== userId) : [...(p.saved || []), userId];
            return { ...p, saved: newSaved };
          }
          return p;
        });
      state.posts = updateList(state.posts);
      state.userPosts = updateList(state.userPosts);
    },
  },
});

export const {
  setPosts,
  appendPosts,
  addPost,
  updatePostInState,
  removePostFromState,
  setUserPosts,
  appendUserPosts,
  setMemories,
  setMemoriesLoading,
  setImageView,
  setShowPostModelEdit,
  setPostIsEdit,
  setPage,
  setHasMore,
  setLoadedPage,
  setUserHasMore,
  setUserIsLoading,
  setIsLoading,
  setIsLoadingPostCreated,
  setError,
  optimisticLikePost,
  optimisticHahaPost,
  optimisticSavePost,
} = postsSlice.actions;

export default postsSlice.reducer;
