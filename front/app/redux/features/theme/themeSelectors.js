import { createSelector } from '@reduxjs/toolkit';

export const selectThemeState = (state) => state.theme;
export const selectTheme = createSelector([selectThemeState], (t) => t?.theme || 'light');
export const selectIsDarkMode = createSelector([selectTheme], (theme) => theme === 'dark');
export const selectAccentColor = createSelector(
  [selectThemeState],
  (theme) => theme?.accentColor || '#06b6d4'
);
