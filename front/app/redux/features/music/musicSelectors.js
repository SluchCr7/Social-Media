import { createSelector } from '@reduxjs/toolkit';

export const selectMusicState = (state) => state.music;
export const selectMusicList = createSelector([selectMusicState], (m) => m?.music || []);
export const selectTopCharts = createSelector([selectMusicState], (m) => m?.topCharts || { trending: [], popular: [] });
export const selectMusicPage = createSelector([selectMusicState], (m) => m?.page || 1);
export const selectMusicHasMore = createSelector([selectMusicState], (m) => Boolean(m?.hasMore));
export const selectMusicLoading = createSelector([selectMusicState], (m) => Boolean(m?.isLoading));
export const selectMusicHasLoadedOnce = createSelector([selectMusicState], (m) => Boolean(m?.hasLoadedOnce));
export const selectMusicGenre = createSelector([selectMusicState], (m) => m?.genre || 'All');
export const selectMusicSearchQuery = createSelector([selectMusicState], (m) => m?.searchQuery || '');
export const selectShowModelAddMusic = createSelector([selectMusicState], (m) => Boolean(m?.showModelAddMusic));
export const selectCurrentMusic = createSelector([selectMusicState], (m) => m?.currentMusic);
