import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  loading: false,
  activeTab: 'Dashboard',
  usersPage: 1,
  usersSearch: '',
  usersStatusFilter: 'all',
  usersRoleFilter: 'all',
  usersSort: 'newest',
  contentTab: 'posts',
  contentSearch: '',
  contentPage: 1,
  logsPage: 1,
  selectedUser: null,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminStats: (state, action) => {
      state.stats = action.payload;
    },
    setAdminLoading: (state, action) => {
      state.loading = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setUsersPage: (state, action) => {
      state.usersPage = action.payload;
    },
    setUsersSearch: (state, action) => {
      state.usersSearch = action.payload;
      state.usersPage = 1;
    },
    setUsersStatusFilter: (state, action) => {
      state.usersStatusFilter = action.payload;
      state.usersPage = 1;
    },
    setUsersRoleFilter: (state, action) => {
      state.usersRoleFilter = action.payload;
      state.usersPage = 1;
    },
    setUsersSort: (state, action) => {
      state.usersSort = action.payload;
      state.usersPage = 1;
    },
    setContentTab: (state, action) => {
      state.contentTab = action.payload;
      state.contentPage = 1;
    },
    setContentSearch: (state, action) => {
      state.contentSearch = action.payload;
      state.contentPage = 1;
    },
    setContentPage: (state, action) => {
      state.contentPage = action.payload;
    },
    setLogsPage: (state, action) => {
      state.logsPage = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const {
  setAdminStats,
  setAdminLoading,
  setActiveTab,
  setUsersPage,
  setUsersSearch,
  setUsersStatusFilter,
  setUsersRoleFilter,
  setUsersSort,
  setContentTab,
  setContentSearch,
  setContentPage,
  setLogsPage,
  setSelectedUser,
} = adminSlice.actions;

export default adminSlice.reducer;
