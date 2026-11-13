import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openModal: false,
  selectedHighlightId: null,
};

export const highlightsSlice = createSlice({
  name: 'highlights',
  initialState,
  reducers: {
    setOpenModal: (state, action) => {
      state.openModal = action.payload;
    },
    setSelectedHighlight: (state, action) => {
      const selected = action.payload;
      state.selectedHighlightId = typeof selected === 'string' ? selected : selected?._id || null;
    },
  },
});

export const { setOpenModal, setSelectedHighlight } = highlightsSlice.actions;
export default highlightsSlice.reducer;
