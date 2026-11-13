import { createSelector } from '@reduxjs/toolkit';

export const selectReelsState = (state) => state.reels;
export const selectShowModelAddReel = createSelector(
  [selectReelsState],
  (reels) => Boolean(reels?.showModelAddReel)
);
