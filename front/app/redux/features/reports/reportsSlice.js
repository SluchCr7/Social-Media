import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showMenuReport: false,
  isTargetId: null,
  reportedOnType: null,
  currentPage: 1,
  limit: 20,
  filterStatus: null,
  filterType: null,
  filterSeverity: null,
};

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setShowMenuReport: (state, action) => {
      state.showMenuReport = action.payload;
    },
    setIsTargetId: (state, action) => {
      state.isTargetId = action.payload;
    },
    setReportedOnType: (state, action) => {
      state.reportedOnType = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
      state.currentPage = 1;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
      state.currentPage = 1;
    },
    setFilterSeverity: (state, action) => {
      state.filterSeverity = action.payload;
      state.currentPage = 1;
    },
  },
});

export const {
  setShowMenuReport,
  setIsTargetId,
  setReportedOnType,
  setCurrentPage,
  setLimit,
  setFilterStatus,
  setFilterType,
  setFilterSeverity,
} = reportsSlice.actions;

export default reportsSlice.reducer;
