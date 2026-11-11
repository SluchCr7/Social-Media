import { createSlice } from '@reduxjs/toolkit';

const initialPagination = {
  users: { page: 1, totalPages: 0, totalCount: 0, hasMore: false },
  posts: { page: 1, totalPages: 0, totalCount: 0, hasMore: false },
  communities: { page: 1, totalPages: 0, totalCount: 0, hasMore: false },
  hashtags: { page: 1, totalPages: 0, totalCount: 0, hasMore: false },
};

const initialState = {
  searchQuery: '',
  searchResults: {
    users: [],
    posts: [],
    communities: [],
    hashtags: [],
  },
  searchHistory: [],
  loading: false,
  error: null,
  sortBy: 'relevance',
  dateRange: 'all',
  hasMedia: false,
  verifiedOnly: false,
  pagination: initialPagination,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchHistory: (state, action) => {
      state.searchHistory = Array.isArray(action.payload) ? action.payload : [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
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
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    resetSearch: (state) => {
      state.searchResults = { users: [], posts: [], communities: [], hashtags: [] };
      state.pagination = initialPagination;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setSearchQuery,
  setSearchResults,
  setSearchHistory,
  setLoading,
  setError,
  setSortBy,
  setDateRange,
  setHasMedia,
  setVerifiedOnly,
  setPagination,
  resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
