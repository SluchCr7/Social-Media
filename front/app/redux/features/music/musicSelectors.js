import { createSelector } from '@reduxjs/toolkit';

export const selectMusicState = (state) => state.music;
export const selectMusicGenre = createSelector([selectMusicState], (music) => music?.genre || 'All');
export const selectMusicSearchQuery = createSelector([selectMusicState], (music) => music?.searchQuery || '');
export const selectShowModelAddMusic = createSelector(
  [selectMusicState],
  (music) => Boolean(music?.showModelAddMusic)
);
