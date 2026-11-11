import { createSlice } from '@reduxjs/toolkit';
import { removeMusicFromState, updateMusicInState } from '../music/musicSlice';

const initialState = {
  songs: [],
  current: null,
  currentIndex: 0,
  playing: false,
  isReady: false,
  progress: 0,
  duration: 0,
  volume: 0.9,
  muted: false,
  shuffle: false,
  repeatMode: 'off', // 'off' | 'one' | 'all'
  expanded: false,
  viewMusicPlayer: false,
};

export const musicPlayerSlice = createSlice({
  name: 'musicPlayer',
  initialState,
  reducers: {
    setSongs: (state, action) => {
      state.songs = Array.isArray(action.payload) ? action.payload : [];
      const currentIndex = state.current
        ? state.songs.findIndex((song) => song._id === state.current._id)
        : -1;
      if (currentIndex >= 0) {
        state.current = state.songs[currentIndex];
        state.currentIndex = currentIndex;
      } else if (!state.current) {
        state.current = state.songs[0] || null;
        state.currentIndex = 0;
      } else {
        state.currentIndex = -1;
      }
    },
    setCurrentTrack: (state, action) => {
      state.current = action.payload;
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    setPlaying: (state, action) => {
      state.playing = action.payload;
    },
    setReady: (state, action) => {
      state.isReady = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setMuted: (state, action) => {
      state.muted = action.payload;
    },
    setShuffle: (state, action) => {
      state.shuffle = action.payload;
    },
    setRepeatMode: (state, action) => {
      state.repeatMode = action.payload;
    },
    setExpanded: (state, action) => {
      state.expanded = action.payload;
    },
    setViewMusicPlayer: (state, action) => {
      state.viewMusicPlayer = action.payload;
    },
    nextTrack: (state) => {
      if (!state.songs.length) return;
      if (state.shuffle) {
        state.currentIndex = Math.floor(Math.random() * state.songs.length);
      } else if (state.currentIndex < 0) {
        state.currentIndex = 0;
      } else {
        state.currentIndex = (state.currentIndex + 1) % state.songs.length;
      }
      state.current = state.songs[state.currentIndex];
      state.progress = 0;
      state.isReady = false;
    },
    prevTrack: (state) => {
      if (!state.songs.length) return;
      state.currentIndex = state.currentIndex < 0
        ? state.songs.length - 1
        : (state.currentIndex - 1 + state.songs.length) % state.songs.length;
      state.current = state.songs[state.currentIndex];
      state.progress = 0;
      state.isReady = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateMusicInState, (state, action) => {
        if (state.current?._id === action.payload?._id) state.current = action.payload;
        state.songs = state.songs.map((song) =>
          song._id === action.payload?._id ? action.payload : song
        );
      })
      .addCase(removeMusicFromState, (state, action) => {
        state.songs = state.songs.filter((song) => song._id !== action.payload);
        if (state.current?._id === action.payload) {
          state.current = null;
          state.currentIndex = 0;
          state.playing = false;
        } else if (state.current) {
          state.currentIndex = state.songs.findIndex((song) => song._id === state.current._id);
        }
      });
  },
});

export const {
  setSongs,
  setCurrentTrack,
  setCurrentIndex,
  setPlaying,
  setReady,
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
} = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
