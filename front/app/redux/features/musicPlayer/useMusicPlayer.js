'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { audioEngine } from '../../services/audioEngine';
import {
  selectSongs,
  selectCurrentTrack,
  selectCurrentTrackIndex,
  selectIsPlaying,
  selectTrackProgress,
  selectTrackDuration,
  selectTrackVolume,
  selectIsMuted,
  selectIsShuffle,
  selectRepeatMode,
  selectIsPlayerExpanded,
  selectViewMusicPlayer,
} from './musicPlayerSelectors';
import {
  setSongs,
  setCurrentTrack,
  setCurrentIndex,
  setPlaying,
  setProgress,
  setDuration,
  setVolume,
  setMuted,
  setShuffle,
  setRepeatMode,
  setExpanded,
  setViewMusicPlayer,
  nextTrack,
  prevTrack,
} from './musicPlayerSlice';

export const useMusicPlayer = () => {
  const dispatch = useAppDispatch();

  const songs = useAppSelector(selectSongs);
  const current = useAppSelector(selectCurrentTrack);
  const currentIndex = useAppSelector(selectCurrentTrackIndex);
  const playing = useAppSelector(selectIsPlaying);
  const progress = useAppSelector(selectTrackProgress);
  const duration = useAppSelector(selectTrackDuration);
  const volume = useAppSelector(selectTrackVolume);
  const muted = useAppSelector(selectIsMuted);
  const shuffle = useAppSelector(selectIsShuffle);
  const repeatMode = useAppSelector(selectRepeatMode);
  const expanded = useAppSelector(selectIsPlayerExpanded);
  const viewMusicPlayer = useAppSelector(selectViewMusicPlayer);

  const play = useCallback(
    (track) => {
      if (track) {
        dispatch(setCurrentTrack(track));
        const idx = songs.findIndex((s) => s._id === track._id);
        if (idx !== -1) dispatch(setCurrentIndex(idx));
        audioEngine.load(track.url, true);
      } else {
        audioEngine.play();
      }
    },
    [songs, dispatch]
  );

  const pause = useCallback(() => {
    audioEngine.pause();
  }, []);

  const togglePlay = useCallback(() => {
    audioEngine.togglePlay();
  }, []);

  const seek = useCallback(
    (seconds) => {
      audioEngine.seek(seconds);
    },
    []
  );

  const next = useCallback(() => {
    dispatch(nextTrack());
  }, [dispatch]);

  const prev = useCallback(() => {
    dispatch(prevTrack());
  }, [dispatch]);

  const setTrack = useCallback(
    (track) => {
      dispatch(setCurrentTrack(track));
      const idx = songs.findIndex((s) => s._id === track._id);
      if (idx !== -1) dispatch(setCurrentIndex(idx));
      audioEngine.load(track.url, playing);
    },
    [songs, playing, dispatch]
  );

  const toggleMute = useCallback(() => {
    dispatch(setMuted(!muted));
  }, [muted, dispatch]);

  const toggleShuffle = useCallback(() => {
    dispatch(setShuffle(!shuffle));
  }, [shuffle, dispatch]);

  const toggleRepeat = useCallback(() => {
    const nextMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
    dispatch(setRepeatMode(nextMode));
  }, [repeatMode, dispatch]);

  return useMemo(
    () => ({
      songs,
      setSongs: (s) => dispatch(setSongs(s)),
      current,
      setCurrentTrack: (t) => dispatch(setCurrentTrack(t)),
      currentIndex,
      setCurrentIndex: (idx) => dispatch(setCurrentIndex(idx)),
      playing,
      setPlaying: (p) => dispatch(setPlaying(p)),
      progress,
      setProgress: (pr) => dispatch(setProgress(pr)),
      duration,
      setDuration: (d) => dispatch(setDuration(d)),
      volume,
      setVolume: (v) => dispatch(setVolume(v)),
      muted,
      setMuted: (m) => dispatch(setMuted(m)),
      shuffle,
      setShuffle: (sh) => dispatch(setShuffle(sh)),
      repeatMode,
      setRepeatMode: (rm) => dispatch(setRepeatMode(rm)),
      expanded,
      setExpanded: (ex) => dispatch(setExpanded(ex)),
      viewMusicPlayer,
      setViewMusicPlayer: (vmp) => dispatch(setViewMusicPlayer(vmp)),
      play,
      pause,
      togglePlay,
      seek,
      next,
      prev,
      setTrack,
      toggleMute,
      toggleShuffle,
      toggleRepeat,
      isReady: true,
    }),
    [
      songs,
      current,
      currentIndex,
      playing,
      progress,
      duration,
      volume,
      muted,
      shuffle,
      repeatMode,
      expanded,
      viewMusicPlayer,
      play,
      pause,
      togglePlay,
      seek,
      next,
      prev,
      setTrack,
      toggleMute,
      toggleShuffle,
      toggleRepeat,
      dispatch,
    ]
  );
};

export default useMusicPlayer;
