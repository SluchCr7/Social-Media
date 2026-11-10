import { createSlice } from '@reduxjs/toolkit';

export const normalizeMusicItem = (item) => {
  if (!item || typeof item !== 'object') return null;
  const title = typeof item.title === 'string' ? item.title.trim() : '';
  const artist = typeof item.artist === 'string' ? item.artist.trim() : '';
  const url = typeof item.url === 'string' ? item.url.trim() : '';
  if (!title || !artist || !url) return null;

  return {
    ...item,
    title,
    artist,
    album: typeof item.album === 'string' && item.album.trim() ? item.album.trim() : 'Single',
    genre: typeof item.genre === 'string' && item.genre.trim() ? item.genre : 'Other',
    cover: typeof item.cover === 'string' && item.cover.trim() ? item.cover : '/default-music.jpg',
    duration: Number(item.duration) || 0,
  };
};

export const normalizeMusicList = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeMusicItem).filter(Boolean);
};

const initialState = {
  music: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  hasLoadedOnce: false,
  genre: 'All',
  searchQuery: '',
  topCharts: { trending: [], popular: [] },
  showModelAddMusic: false,
  currentMusic: null,
};

export const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setMusic: (state, action) => {
      const list = action.payload;
      state.music = normalizeMusicList(list);
    },
    appendMusic: (state, action) => {
      const normalized = normalizeMusicList(action.payload);
      const currentIds = new Set(state.music.map((item) => item._id));
      state.music.push(...normalized.filter((item) => !currentIds.has(item._id)));
    },
    addMusicToState: (state, action) => {
      const normalized = normalizeMusicItem(action.payload);
      if (normalized) {
        state.music = [normalized, ...state.music.filter((m) => m._id !== normalized._id)];
      }
    },
    updateMusicInState: (state, action) => {
      const normalized = normalizeMusicItem(action.payload);
      if (!normalized) return;
      state.music = state.music.map((m) => (m._id === normalized._id ? normalized : m));
      state.topCharts = {
        trending: state.topCharts.trending.map((m) => (m._id === normalized._id ? normalized : m)),
        popular: state.topCharts.popular.map((m) => (m._id === normalized._id ? normalized : m)),
      };
    },
    removeMusicFromState: (state, action) => {
      const id = action.payload;
      state.music = state.music.filter((m) => m._id !== id);
      state.topCharts = {
        trending: state.topCharts.trending.filter((m) => m._id !== id),
        popular: state.topCharts.popular.filter((m) => m._id !== id),
      };
    },
    setTopCharts: (state, action) => {
      const payload = action.payload || {};
      state.topCharts = {
        trending: normalizeMusicList(payload.trending),
        popular: normalizeMusicList(payload.popular),
      };
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setHasLoadedOnce: (state, action) => {
      state.hasLoadedOnce = action.payload;
    },
    setGenre: (state, action) => {
      state.genre = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setShowModelAddMusic: (state, action) => {
      state.showModelAddMusic = action.payload;
    },
    setCurrentMusic: (state, action) => {
      state.currentMusic = action.payload;
    },
  },
});

export const {
  setMusic,
  appendMusic,
  addMusicToState,
  updateMusicInState,
  removeMusicFromState,
  setTopCharts,
  setPage,
  setHasMore,
  setIsLoading,
  setHasLoadedOnce,
  setGenre,
  setSearchQuery,
  setShowModelAddMusic,
  setCurrentMusic,
} = musicSlice.actions;

export default musicSlice.reducer;
