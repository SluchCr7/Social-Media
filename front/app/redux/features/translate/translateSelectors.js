import { createSelector } from '@reduxjs/toolkit';

export const selectTranslateState = (state) => state.translate;
export const selectCurrentLanguage = createSelector([selectTranslateState], (t) => t?.language || 'en');
export const selectIsRTL = createSelector([selectTranslateState], (t) => Boolean(t?.isRTL));
export const selectTranslateLoading = createSelector([selectTranslateState], (t) => Boolean(t?.loading));
