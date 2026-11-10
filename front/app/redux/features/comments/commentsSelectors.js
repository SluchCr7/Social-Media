import { createSelector } from '@reduxjs/toolkit';

const EMPTY_ARRAY = [];

export const selectCommentsState = (state) => state.comments;
export const selectComments = createSelector([selectCommentsState], (comments) => comments?.comments || EMPTY_ARRAY);
export const selectCommentsLoading = createSelector([selectCommentsState], (comments) => Boolean(comments?.isLoading));
