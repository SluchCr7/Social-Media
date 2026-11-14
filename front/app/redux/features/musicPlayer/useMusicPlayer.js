'use client';

import { useCallback, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { audioEngine } from '../../services/audioEngine';
import { selectCurrentUser } from '../auth/authSelectors';
import { useViewMusicMutation } from '../music/musicApi';
import {
  selectSongs,
  selectCurrentTrack,
  selectCurrentTrackIndex,
  selectIsPlaying,
  selectIsReady,
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
  setDuration,
  setVolume,
  setMuted,
  setShuffle,
  setRepeatMode,
  setExpanded,
  setViewMusicPlayer,
  nextTrack,
  prevTrack,
  updateQueueTrack,
} from './musicPlayerSlice';

export const useMusicPlayer = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const viewedTracks = useRef(new Set());
  const [recordMusicView] = useViewMusicMutation();

  const songs = useAppSelector(selectSongs);
  const current = useAppSelector(selectCurrentTrack);
  const currentIndex = useAppSelector(selectCurrentTrackIndex);
  const playing = useAppSelector(selectIsPlaying);
  const isReady = useAppSelector(selectIsReady);
  const progress = useAppSelector(selectTrackProgress);
  const duration = useAppSelector(selectTrackDuration);
  const volume = useAppSelector(selectTrackVolume);
  const muted = useAppSelector(selectIsMuted);
  const shuffle = useAppSelector(selectIsShuffle);
  const repeatMode = useAppSelector(selectRepeatMode);
  const expanded = useAppSelector(selectIsPlayerExpanded);
  const viewMusicPlayer = useAppSelector(selectViewMusicPlayer);

  const selectTrack = useCallback((track) => {
    if (!track?._id || !track.url) return;
    dispatch(setCurrentTrack(track));
    let index = songs.findIndex((song) => song._id === track._id);
    if (index < 0) {
      index = songs.length;
      dispatch(setSongs([...songs, track]));
    }
    dispatch(setCurrentIndex(index));
    dispatch(setViewMusicPlayer(true));
    audioEngine.load(track.url, true, track._id);
    if (user?._id && !viewedTracks.current.has(track._id)) {
      viewedTracks.current.add(track._id);
      recordMusicView(track._id)
        .unwrap()
        .then((updated) => dispatch(updateQueueTrack(updated)))
        .catch((error) => console.error('Could not record music view:', error));
    }
  }, [songs, user?._id, dispatch, recordMusicView]);

  const play = useCallback((track) => {
    if (track) selectTrack(track);
    else audioEngine.play();
  }, [selectTrack]);

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

  const setTrack = selectTrack;

  const setSongsList = useCallback(
    (nextSongs) => dispatch(setSongs(nextSongs)),
    [dispatch]
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
      setSongs: setSongsList,
      current,
      setCurrentTrack: (t) => dispatch(setCurrentTrack(t)),
      currentIndex,
      setCurrentIndex: (idx) => dispatch(setCurrentIndex(idx)),
      playing,
      setPlaying: (p) => dispatch(setPlaying(p)),
      progress,
      setProgress: seek,
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
      setProgress: seek,
      next,
      prev,
      setTrack,
      selectTrack,
      toggleMute,
      toggleShuffle,
      toggleRepeat,
      isReady,
    }),
    [
      songs,
      current,
      currentIndex,
      playing,
      isReady,
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
      selectTrack,
      toggleMute,
      toggleShuffle,
      toggleRepeat,
      setSongsList,
      dispatch,
    ]
  );
};

export default useMusicPlayer;
