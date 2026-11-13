import { createSelector } from '@reduxjs/toolkit';

export const selectExploreTab = createSelector(
  [(state) => state.explore],
  (explore) => explore?.exploreTab || 'trending'
);
