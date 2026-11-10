import { createSelector } from '@reduxjs/toolkit';

export const selectNewsState = (state) => state.news;
export const selectNews = createSelector([selectNewsState], (n) => n?.news || []);
export const selectNewsLoading = createSelector([selectNewsState], (n) => Boolean(n?.loading));
export const selectNewsError = createSelector([selectNewsState], (n) => n?.error);
