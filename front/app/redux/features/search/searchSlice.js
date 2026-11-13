import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  sortBy: 'relevance',
  dateRange: 'all',
  hasMedia: false,
  verifiedOnly: false,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setHasMedia: (state, action) => {
      state.hasMedia = action.payload;
    },
    setVerifiedOnly: (state, action) => {
      state.verifiedOnly = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setSortBy,
  setDateRange,
  setHasMedia,
  setVerifiedOnly,
} = searchSlice.actions;

export default searchSlice.reducer;
