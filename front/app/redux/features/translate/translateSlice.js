import { createSlice } from '@reduxjs/toolkit';

const normalizeLanguageCode = (code) => {
  const normalized = code?.split('-')[0].toLowerCase();
  const languageNames = { arabic: 'ar', persian: 'fa', urdu: 'ur' };
  return languageNames[normalized] || normalized || 'en';
};
const isRTLCode = (code) => ['ar', 'fa', 'he', 'ur'].includes(normalizeLanguageCode(code));

const getInitialLang = () => {
  if (typeof window !== 'undefined') {
    return normalizeLanguageCode(
      localStorage.getItem('language') ||
      localStorage.getItem('i18nextLng') ||
      'en'
    );
  }
  return 'en';
};

const initialLang = getInitialLang();

const initialState = {
  language: initialLang,
  isRTL: isRTLCode(initialLang),
};

export const translateSlice = createSlice({
  name: 'translate',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const lang = normalizeLanguageCode(action.payload);
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
  },
});

export const { setLanguage } = translateSlice.actions;

export default translateSlice.reducer;
