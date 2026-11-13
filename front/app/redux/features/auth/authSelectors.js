import { createSelector } from '@reduxjs/toolkit';

export const selectAuth = (state) => state.auth;
export const selectCurrentUser = createSelector([selectAuth], (auth) => auth?.user || null);
export const selectIsLogin = createSelector([selectAuth], (auth) => Boolean(auth?.isLogin));
export const selectIsAuthChecked = createSelector([selectAuth], (auth) => Boolean(auth?.isAuthChecked));
export const selectAuthLoading = createSelector([selectAuth], (auth) => Boolean(auth?.isLoading));
export const selectAuthStatus = createSelector([selectAuth], (auth) => auth?.status || 'initializing');
export const selectIsAdmin = createSelector([selectCurrentUser], (user) => Boolean(user?.isAdmin));
