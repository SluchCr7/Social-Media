import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  songs: [],
  current: null,
  currentIndex: 0,
  playing: false,
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
      if (!state.current || !state.songs.some((m) => m._id === state.current._id)) {
        state.current = state.songs[0] || null;
        state.currentIndex = 0;
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
      } else {
        state.currentIndex = (state.currentIndex + 1) % state.songs.length;
      }
      state.current = state.songs[state.currentIndex];
      state.progress = 0;
    },
    prevTrack: (state) => {
      if (!state.songs.length) return;
      state.currentIndex = (state.currentIndex - 1 + state.songs.length) % state.songs.length;
      state.current = state.songs[state.currentIndex];
      state.progress = 0;
    },
  },
});

export const {
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
} = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
