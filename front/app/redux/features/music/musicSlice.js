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

export const normalizeMusicList = (items) =>
  Array.isArray(items) ? items.map(normalizeMusicItem).filter(Boolean) : [];

const initialState = {
  genre: 'All',
  searchQuery: '',
  showModelAddMusic: false,
};

export const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setGenre: (state, action) => {
      state.genre = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setShowModelAddMusic: (state, action) => {
      state.showModelAddMusic = action.payload;
    },
  },
});

export const { setGenre, setSearchQuery, setShowModelAddMusic } = musicSlice.actions;
export default musicSlice.reducer;
