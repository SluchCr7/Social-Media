import { createSelector } from '@reduxjs/toolkit';

export const selectAsideState = (state) => state.aside;
export const selectIsMobile = createSelector([selectAsideState], (a) => Boolean(a?.isMobile));
export const selectIsMobileMenuOpen = createSelector([selectAsideState], (a) => Boolean(a?.isMobileMenuOpen));
