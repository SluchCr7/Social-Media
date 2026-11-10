import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  highlights: [],
  loading: false,
  error: null,
  openModal: false,
  selectedHighlight: null,
};

export const highlightsSlice = createSlice({
  name: 'highlights',
  initialState,
  reducers: {
    setHighlights: (state, action) => {
      state.highlights = Array.isArray(action.payload) ? action.payload : [];
    },
    addHighlightToState: (state, action) => {
      state.highlights = [action.payload, ...state.highlights];
    },
    updateHighlightInState: (state, action) => {
      const updated = action.payload;
      state.highlights = state.highlights.map((h) => (h._id === updated._id ? { ...h, ...updated } : h));
      if (state.selectedHighlight?._id === updated._id) {
        state.selectedHighlight = { ...state.selectedHighlight, ...updated };
      }
    },
    removeHighlightFromState: (state, action) => {
      const id = action.payload;
      state.highlights = state.highlights.filter((h) => h._id !== id);
      if (state.selectedHighlight?._id === id) {
        state.selectedHighlight = null;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setOpenModal: (state, action) => {
      state.openModal = action.payload;
    },
    setSelectedHighlight: (state, action) => {
      state.selectedHighlight = action.payload;
    },
    removeStoryFromAllHighlights: (state, action) => {
      const storyId = action.payload;
      state.highlights = state.highlights.map((h) => ({
        ...h,
        stories: h.stories?.filter((s) => (s._id || s) !== storyId),
      }));
      if (state.selectedHighlight) {
        state.selectedHighlight = {
          ...state.selectedHighlight,
          stories: state.selectedHighlight.stories?.filter((s) => (s._id || s) !== storyId),
        };
      }
    },
  },
});

export const {
  setHighlights,
  addHighlightToState,
  updateHighlightInState,
  removeHighlightFromState,
  setLoading,
  setError,
  setOpenModal,
  setSelectedHighlight,
  removeStoryFromAllHighlights,
} = highlightsSlice.actions;

export default highlightsSlice.reducer;
