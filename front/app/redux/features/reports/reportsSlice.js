import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reports: [],
  loading: false,
  actionLoading: false,
  showMenuReport: false,
  isTargetId: null,
  reportedOnType: null,
  currentPage: 1,
  limit: 20,
  totalReports: 0,
  filterStatus: null,
  filterType: null,
  filterSeverity: null,
};

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReports: (state, action) => {
      state.reports = Array.isArray(action.payload) ? action.payload : [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setActionLoading: (state, action) => {
      state.actionLoading = action.payload;
    },
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
    setTotalReports: (state, action) => {
      state.totalReports = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    setFilterSeverity: (state, action) => {
      state.filterSeverity = action.payload;
    },
    updateReportInState: (state, action) => {
      const updated = action.payload;
      state.reports = state.reports.map((r) => (r._id === updated._id ? { ...r, ...updated } : r));
    },
    removeReportFromState: (state, action) => {
      const id = action.payload;
      state.reports = state.reports.filter((r) => r._id !== id);
      state.totalReports = Math.max(0, state.totalReports - 1);
    },
  },
});

export const {
  setReports,
  setLoading,
  setActionLoading,
  setShowMenuReport,
  setIsTargetId,
  setReportedOnType,
  setCurrentPage,
  setLimit,
  setTotalReports,
  setFilterStatus,
  setFilterType,
  setFilterSeverity,
  updateReportInState,
  removeReportFromState,
} = reportsSlice.actions;

export default reportsSlice.reducer;
