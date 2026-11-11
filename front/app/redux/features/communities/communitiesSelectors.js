import { createSelector } from '@reduxjs/toolkit';

const EMPTY_ARRAY = [];

export const selectCommunitiesState = (state) => state.communities;
export const selectCommunities = createSelector([selectCommunitiesState], (c) => c?.communities || EMPTY_ARRAY);
export const selectCommunitiesLoading = createSelector([selectCommunitiesState], (c) => Boolean(c?.isLoading));
export const selectCommunitiesLoadedOnce = createSelector([selectCommunitiesState], (c) => Boolean(c?.hasLoadedOnce));
export const selectCommunitiesError = createSelector([selectCommunitiesState], (c) => c?.error || null);
