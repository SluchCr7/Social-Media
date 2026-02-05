'use client';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';
import { languageMap } from '../utils/Data';

const TranslateContext = createContext();
export const useTranslate = () => useContext(TranslateContext);

export const TranslateContextProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const { updateProfile } = useUser();
  const [loading, setLoading] = useState(false);

  // Initialize language: User Settings > Local Storage > i18next > Default 'en'
  const [language, setLanguage] = useState('en');

  // ✅ Is current language RTL?
  const isRTL = useMemo(() => ['ar', 'fa', 'he', 'ur'].includes(language), [language]);

  // ✅ Helper to apply direction to HTML
  const applyDirection = useCallback((langCode) => {
    const isRightToLeft = ['ar', 'fa', 'he', 'ur'].includes(langCode);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRightToLeft ? 'rtl' : 'ltr';
      document.documentElement.lang = langCode;
      // Also update body direction for some CSS frameworks/styles
      document.body.dir = isRightToLeft ? 'rtl' : 'ltr';
    }
  }, []);

  // ✅ Unified language setter (Local Only)
  const handleLanguageChange = useCallback((langCode) => {
    if (!langCode) return;
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    localStorage.setItem('language', langCode);
    applyDirection(langCode);
  }, [i18n, applyDirection]);

  // ✅ Effect to sync with local storage or user settings
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    const userLangName = user?.preferedLanguage; // From DB (e.g., "English")
    const currentI18n = i18n.language;

    // Convert DB name to code
    const userLangCode = userLangName ? (languageMap[userLangName] || userLangName) : null;

    // Priority: Local Storage (User's device choice) > User DB Settings > current i18n > default 'en'
    const initialLang = savedLang || userLangCode || currentI18n || 'en';

    if (initialLang !== language) {
      i18n.changeLanguage(initialLang);
      setLanguage(initialLang);
      applyDirection(initialLang);
    }
  }, [user?.preferedLanguage, i18n.language, language, applyDirection, i18n]);

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
    handleLanguageChange,
  }), [translate, isRTL, loading, language, handleLanguageChange]);

  return (
    <TranslateContext.Provider value={value}>
      {children}
    </TranslateContext.Provider>
  );
};

