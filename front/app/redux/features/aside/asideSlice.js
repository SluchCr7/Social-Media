import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMobile: false,
  isMobileMenuOpen: false,
};

export const asideSlice = createSlice({
  name: 'aside',
  initialState,
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsMobileMenuOpen: (state, action) => {
      state.isMobileMenuOpen = action.payload;
    },
  },
});

export const { setIsMobile, setIsMobileMenuOpen } = asideSlice.actions;

export default asideSlice.reducer;
