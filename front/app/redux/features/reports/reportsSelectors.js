import { createSelector } from '@reduxjs/toolkit';

const selectReportsState = (state) => state.reports;

export const selectShowMenuReport = createSelector(
  [selectReportsState],
  (reports) => Boolean(reports?.showMenuReport)
);
export const selectIsTargetId = createSelector([selectReportsState], (reports) => reports?.isTargetId);
export const selectReportedOnType = createSelector([selectReportsState], (reports) => reports?.reportedOnType);
export const selectCurrentReportPage = createSelector([selectReportsState], (reports) => reports?.currentPage || 1);
export const selectReportLimit = createSelector([selectReportsState], (reports) => reports?.limit || 20);
export const selectFilterStatus = createSelector([selectReportsState], (reports) => reports?.filterStatus);
export const selectFilterType = createSelector([selectReportsState], (reports) => reports?.filterType);
export const selectFilterSeverity = createSelector([selectReportsState], (reports) => reports?.filterSeverity);
