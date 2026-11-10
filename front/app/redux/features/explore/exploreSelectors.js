import { createSelector } from '@reduxjs/toolkit';

export const selectExploreState = (state) => state.explore;
export const selectExplorePosts = createSelector([selectExploreState], (e) => e?.explorePosts || []);
export const selectSuggestedExploreUsers = createSelector([selectExploreState], (e) => e?.suggestedUsers || []);
export const selectTrendingHashtags = createSelector([selectExploreState], (e) => e?.trendingHashtags || []);
export const selectTrendingPosts = createSelector([selectExploreState], (e) => e?.trendingPosts || []);
export const selectExploreLoading = createSelector([selectExploreState], (e) => Boolean(e?.loading));
export const selectExploreError = createSelector([selectExploreState], (e) => e?.error);
export const selectExploreTab = createSelector([selectExploreState], (e) => e?.exploreTab || 'trending');
export const selectExplorePagination = createSelector([selectExploreState], (e) => e?.pagination || { page: 1, hasMore: false });
