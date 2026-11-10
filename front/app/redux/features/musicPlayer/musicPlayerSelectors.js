import { createSelector } from '@reduxjs/toolkit';

export const selectMusicPlayerState = (state) => state.musicPlayer;
export const selectSongs = createSelector([selectMusicPlayerState], (p) => p?.songs || []);
export const selectCurrentTrack = createSelector([selectMusicPlayerState], (p) => p?.current);
export const selectCurrentTrackIndex = createSelector([selectMusicPlayerState], (p) => p?.currentIndex || 0);
export const selectIsPlaying = createSelector([selectMusicPlayerState], (p) => Boolean(p?.playing));
export const selectTrackProgress = createSelector([selectMusicPlayerState], (p) => p?.progress || 0);
export const selectTrackDuration = createSelector([selectMusicPlayerState], (p) => p?.duration || 0);
export const selectTrackVolume = createSelector([selectMusicPlayerState], (p) => p?.volume ?? 0.9);
export const selectIsMuted = createSelector([selectMusicPlayerState], (p) => Boolean(p?.muted));
export const selectIsShuffle = createSelector([selectMusicPlayerState], (p) => Boolean(p?.shuffle));
export const selectRepeatMode = createSelector([selectMusicPlayerState], (p) => p?.repeatMode || 'off');
export const selectIsPlayerExpanded = createSelector([selectMusicPlayerState], (p) => Boolean(p?.expanded));
export const selectViewMusicPlayer = createSelector([selectMusicPlayerState], (p) => Boolean(p?.viewMusicPlayer));
