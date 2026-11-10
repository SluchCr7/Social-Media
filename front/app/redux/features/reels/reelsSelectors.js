import { createSelector } from '@reduxjs/toolkit';

export const selectReelsState = (state) => state.reels;
export const selectReels = createSelector([selectReelsState], (r) => r?.reels || []);
export const selectReelsPage = createSelector([selectReelsState], (r) => r?.page || 1);
export const selectReelsHasMore = createSelector([selectReelsState], (r) => Boolean(r?.hasMore));
export const selectReelsLoading = createSelector([selectReelsState], (r) => Boolean(r?.isLoading));
export const selectShowModelAddReel = createSelector([selectReelsState], (r) => Boolean(r?.showModelAddReel));
