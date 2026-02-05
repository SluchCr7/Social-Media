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
  const updateLanguageLocal = useCallback((langCode) => {
    if (!langCode) return;
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    localStorage.setItem('language', langCode);
    applyDirection(langCode);
  }, [i18n, applyDirection]);

  // ✅ Persist change to Backend
  const handleLanguageChange = useCallback(async (langCode) => {
    if (!langCode) return;

    // 1. Update UI immediately
    updateLanguageLocal(langCode);

    // 2. Persist to Backend if user is logged in
    if (user?._id) {
      // Find the name (e.g., "English") for the code (e.g., "en")
      const langName = Object.keys(languageMap).find(key => languageMap[key] === langCode) || langCode;
      try {
        await updateProfile({ preferedLanguage: langName });
      } catch (err) {
        console.error("Failed to update language on server:", err);
      }
    }
  }, [updateLanguageLocal, user?._id, updateProfile]);

  // ✅ Effect to sync with user settings or local storage
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    const userLangName = user?.preferedLanguage; // From DB (e.g., "English")
    const currentI18n = i18n.language;

    // Convert "English" -> "en"
    const userLangCode = userLangName ? (languageMap[userLangName] || userLangName) : null;

    // Priority: User DB Settings > Local Storage > current i18n > default 'en'
    const initialLang = userLangCode || savedLang || currentI18n || 'en';

    // Only update if different to avoid infinite loops
    if (initialLang !== language) {
      updateLanguageLocal(initialLang);
    }
  }, [user?.preferedLanguage, i18n.language, language, updateLanguageLocal]);

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

