'use client';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

const TranslateContext = createContext();
export const useTranslate = () => useContext(TranslateContext);

export const TranslateContextProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Initialize language: User Settings > Local Storage > i18next > Default 'en'
  const [language, setLanguage] = useState('en');

  // ✅ Is current language RTL?
  const isRTL = useMemo(() => ['ar', 'fa', 'he', 'ur'].includes(language), [language]);

  // ✅ Helper to apply direction to HTML
  const applyDirection = useCallback((langCode) => {
    const isRightToLeft = ['ar', 'fa', 'he', 'ur'].includes(langCode);
    document.documentElement.dir = isRightToLeft ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  }, []);

  // ✅ Unified language setter
  const updateLanguage = useCallback((langCode) => {
    if (!langCode) return;
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    localStorage.setItem('language', langCode);
    applyDirection(langCode);
  }, [i18n, applyDirection]);

  // ✅ Effect to sync with user settings or local storage
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    const userLang = user?.preferedLanguage; // From DB
    const currentI18n = i18n.language;

    const initialLang = userLang || savedLang || currentI18n || 'en';

    updateLanguage(initialLang);
  }, [user?.preferedLanguage, i18n.language, updateLanguage]);

  // ✅ Translation function
  const translate = useCallback(
    async (text, targetLang = language || 'en') => {
      if (!text) return '';
      setLoading(true);
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/translate`, {
          text,
          targetLang,
        });
        return res.data.translatedText;
      } catch (err) {
        console.error('Translation error:', err);
        return text; // fallback to original text
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  const value = useMemo(() => ({
    translate,
    isRTL,
    loading,
    language,
    handleLanguageChange: updateLanguage,
  }), [translate, isRTL, loading, language, updateLanguage]);

  return (
    <TranslateContext.Provider value={value}>
      {children}
    </TranslateContext.Provider>
  );
};
