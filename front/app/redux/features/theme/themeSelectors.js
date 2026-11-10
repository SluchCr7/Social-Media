import { createSelector } from '@reduxjs/toolkit';

export const selectThemeState = (state) => state.theme;
export const selectTheme = createSelector([selectThemeState], (t) => t?.theme || 'light');
export const selectIsDarkMode = createSelector([selectTheme], (theme) => theme === 'dark');
