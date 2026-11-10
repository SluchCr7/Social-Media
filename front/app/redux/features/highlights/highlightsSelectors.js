import { createSelector } from '@reduxjs/toolkit';

export const selectHighlightsState = (state) => state.highlights;
export const selectHighlights = createSelector([selectHighlightsState], (h) => h?.highlights || []);
export const selectHighlightsLoading = createSelector([selectHighlightsState], (h) => Boolean(h?.loading));
export const selectHighlightsError = createSelector([selectHighlightsState], (h) => h?.error);
export const selectHighlightsOpenModal = createSelector([selectHighlightsState], (h) => Boolean(h?.openModal));
export const selectSelectedHighlight = createSelector([selectHighlightsState], (h) => h?.selectedHighlight);
