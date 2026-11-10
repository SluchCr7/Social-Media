import { createSelector } from '@reduxjs/toolkit';

export const selectUserState = (state) => state.user;
export const selectSuggestedUsers = createSelector([selectUserState], (user) => user?.suggestedUsers || []);
export const selectOnlineUsers = createSelector([selectUserState], (user) => user?.onlineUsers || []);
export const selectUserLoading = createSelector([selectUserState], (user) => Boolean(user?.loading));
export const selectUpdateProfileLoading = createSelector([selectUserState], (user) => Boolean(user?.updateProfileLoading));
