import { createSelector } from '@reduxjs/toolkit';

export const selectReportsState = (state) => state.reports;
export const selectReports = createSelector([selectReportsState], (r) => r?.reports || []);
export const selectReportsLoading = createSelector([selectReportsState], (r) => Boolean(r?.loading));
export const selectActionLoading = createSelector([selectReportsState], (r) => Boolean(r?.actionLoading));
export const selectShowMenuReport = createSelector([selectReportsState], (r) => Boolean(r?.showMenuReport));
export const selectIsTargetId = createSelector([selectReportsState], (r) => r?.isTargetId);
export const selectReportedOnType = createSelector([selectReportsState], (r) => r?.reportedOnType);
export const selectCurrentReportPage = createSelector([selectReportsState], (r) => r?.currentPage || 1);
export const selectReportLimit = createSelector([selectReportsState], (r) => r?.limit || 20);
export const selectTotalReports = createSelector([selectReportsState], (r) => r?.totalReports || 0);
export const selectFilterStatus = createSelector([selectReportsState], (r) => r?.filterStatus);
export const selectFilterType = createSelector([selectReportsState], (r) => r?.filterType);
export const selectFilterSeverity = createSelector([selectReportsState], (r) => r?.filterSeverity);
