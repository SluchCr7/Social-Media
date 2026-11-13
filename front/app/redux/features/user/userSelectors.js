import { createSelector } from '@reduxjs/toolkit';

export const selectUserState = (state) => state.user;
export const selectOnlineUsers = createSelector([selectUserState], (user) => user?.onlineUsers || []);
export const selectShowAllSuggestedUsers = createSelector(
  [selectUserState],
  (user) => Boolean(user?.showAllSuggestedUsers)
);
