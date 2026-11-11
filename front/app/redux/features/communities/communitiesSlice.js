import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  communities: [],
  isLoading: false,
  hasLoadedOnce: false,
  loadedForUserId: null,
  error: null,
};

export const communitiesSlice = createSlice({
  name: 'communities',
  initialState,
  reducers: {
    setCommunities: (state, action) => {
      state.communities = Array.isArray(action.payload) ? action.payload : [];
      state.hasLoadedOnce = true;
      state.error = null;
    },
    addCommunityToState: (state, action) => {
      const comm = action.payload;
      if (!state.communities.some((c) => c._id === comm._id)) {
        state.communities = [comm, ...state.communities];
      }
    },
    updateCommunityInState: (state, action) => {
      const updated = action.payload;
      state.communities = state.communities.map((c) => (c._id === updated._id ? { ...c, ...updated } : c));
    },
    removeCommunityFromState: (state, action) => {
      const id = action.payload;
      state.communities = state.communities.filter((c) => c._id !== id);
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCommunitiesError: (state, action) => {
      state.error = action.payload;
    },
    setCommunitiesLoadedFor: (state, action) => {
      state.loadedForUserId = action.payload;
    },
    invalidateCommunities: (state) => {
      state.hasLoadedOnce = false;
    },
  },
});

export const {
  setCommunities,
  addCommunityToState,
  updateCommunityInState,
  removeCommunityFromState,
  setIsLoading,
  setCommunitiesError,
  setCommunitiesLoadedFor,
  invalidateCommunities,
} = communitiesSlice.actions;

export default communitiesSlice.reducer;
