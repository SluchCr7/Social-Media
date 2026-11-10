import { createSlice } from '@reduxjs/toolkit';

const isRTLCode = (code) => ['ar', 'fa', 'he', 'ur'].includes(code);

const getInitialLang = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
};

const initialLang = getInitialLang();

const initialState = {
  language: initialLang,
  isRTL: isRTLCode(initialLang),
  loading: false,
};

export const translateSlice = createSlice({
  name: 'translate',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const lang = action.payload;
      state.language = lang;
      state.isRTL = isRTLCode(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
        if (typeof document !== 'undefined') {
          document.documentElement.dir = state.isRTL ? 'rtl' : 'ltr';
          document.documentElement.lang = lang;
          if (document.body) {
            document.body.dir = state.isRTL ? 'rtl' : 'ltr';
          }
        }
      }
    },
    setTranslateLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLanguage, setTranslateLoading } = translateSlice.actions;

export default translateSlice.reducer;
