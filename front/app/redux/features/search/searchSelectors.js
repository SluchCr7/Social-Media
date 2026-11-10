import { createSelector } from '@reduxjs/toolkit';

export const selectSearchState = (state) => state.search;
export const selectSearchQuery = createSelector([selectSearchState], (s) => s?.searchQuery || '');
export const selectSearchResults = createSelector([selectSearchState], (s) => s?.searchResults || { users: [], posts: [], communities: [], hashtags: [] });
export const selectSearchHistory = createSelector([selectSearchState], (s) => s?.searchHistory || []);
export const selectSearchLoading = createSelector([selectSearchState], (s) => Boolean(s?.loading));
export const selectSearchError = createSelector([selectSearchState], (s) => s?.error);
export const selectSearchSortBy = createSelector([selectSearchState], (s) => s?.sortBy || 'relevance');
export const selectSearchDateRange = createSelector([selectSearchState], (s) => s?.dateRange || 'all');
export const selectSearchHasMedia = createSelector([selectSearchState], (s) => Boolean(s?.hasMedia));
export const selectSearchVerifiedOnly = createSelector([selectSearchState], (s) => Boolean(s?.verifiedOnly));
export const selectSearchPagination = createSelector([selectSearchState], (s) => s?.pagination);
