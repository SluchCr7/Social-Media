import { createSelector } from '@reduxjs/toolkit';

export const selectVerifyState = (state) => state.verify;
export const selectVerifyStatus = createSelector([selectVerifyState], (v) => Boolean(v?.verifyStatus));
