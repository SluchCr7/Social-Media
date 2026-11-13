import { createSelector } from '@reduxjs/toolkit';

export const selectSearchState = (state) => state.search;
export const selectSearchQuery = createSelector([selectSearchState], (state) => state?.searchQuery || '');
export const selectSearchSortBy = createSelector([selectSearchState], (state) => state?.sortBy || 'relevance');
export const selectSearchDateRange = createSelector([selectSearchState], (state) => state?.dateRange || 'all');
export const selectSearchHasMedia = createSelector([selectSearchState], (state) => Boolean(state?.hasMedia));
export const selectSearchVerifiedOnly = createSelector([selectSearchState], (state) => Boolean(state?.verifiedOnly));
