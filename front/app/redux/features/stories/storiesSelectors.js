import { createSelector } from '@reduxjs/toolkit';

export const selectStoriesState = (state) => state.stories;
export const selectIsStoryModalOpen = createSelector(
  [selectStoriesState],
  (stories) => Boolean(stories?.isStory)
);
