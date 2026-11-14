import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_ACCENT_COLOR, normalizeAccentColor } from '../../../utils/accentColor';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

const initialState = {
  theme: getInitialTheme(),
  accentColor: (() => {
    if (typeof window === 'undefined') return DEFAULT_ACCENT_COLOR;
    try {
      return normalizeAccentColor(localStorage.getItem('accentColor')) || DEFAULT_ACCENT_COLOR;
    } catch {
      return DEFAULT_ACCENT_COLOR;
    }
  })(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        const root = document.documentElement;
        root.classList.toggle('dark', action.payload === 'dark');
        root.classList.toggle('light', action.payload === 'light');
        root.style.colorScheme = action.payload;
        root.setAttribute('data-theme', action.payload);
      }
    },
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', nextTheme);
        const root = document.documentElement;
        root.classList.toggle('dark', nextTheme === 'dark');
        root.classList.toggle('light', nextTheme === 'light');
        root.style.colorScheme = nextTheme;
        root.setAttribute('data-theme', nextTheme);
      }
    },
    setAccentColor: (state, action) => {
      const accentColor = normalizeAccentColor(action.payload);
      if (!accentColor) return;
      state.accentColor = accentColor;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('accentColor', accentColor);
        } catch (error) {
          console.warn('Unable to persist the selected accent color:', error);
        }
      }
    },
  },
});

export const { setTheme, toggleTheme, setAccentColor } = themeSlice.actions;

export default themeSlice.reducer;
