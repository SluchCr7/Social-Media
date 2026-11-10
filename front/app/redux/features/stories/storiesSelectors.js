import { createSelector } from '@reduxjs/toolkit';

const EMPTY_ARRAY = [];

export const selectStoriesState = (state) => state.stories;
export const selectStories = createSelector([selectStoriesState], (s) => s?.stories || EMPTY_ARRAY);
export const selectStoriesLoading = createSelector([selectStoriesState], (s) => Boolean(s?.isLoading));
export const selectIsStoryModalOpen = createSelector([selectStoriesState], (s) => Boolean(s?.isStory));
