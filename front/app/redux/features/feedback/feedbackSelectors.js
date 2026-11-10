import { createSelector } from '@reduxjs/toolkit';

export const selectFeedbackState = (state) => state.feedback;
export const selectModalConfig = createSelector([selectFeedbackState], (f) => f?.modalConfig || { isOpen: false });
