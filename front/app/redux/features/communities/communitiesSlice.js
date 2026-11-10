import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  communities: [],
  isLoading: false,
};

export const communitiesSlice = createSlice({
  name: 'communities',
  initialState,
  reducers: {
    setCommunities: (state, action) => {
      state.communities = Array.isArray(action.payload) ? action.payload : [];
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
  },
});

export const {
  setCommunities,
  addCommunityToState,
  updateCommunityInState,
  removeCommunityFromState,
  setIsLoading,
} = communitiesSlice.actions;

export default communitiesSlice.reducer;
