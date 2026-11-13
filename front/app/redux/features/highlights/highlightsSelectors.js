import { createSelector } from '@reduxjs/toolkit';

const selectHighlightsState = (state) => state.highlights;

export const selectHighlightsOpenModal = createSelector(
  [selectHighlightsState],
  (highlights) => Boolean(highlights?.openModal)
);
export const selectSelectedHighlightId = createSelector(
  [selectHighlightsState],
  (highlights) => highlights?.selectedHighlightId || null
);
