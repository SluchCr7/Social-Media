'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const TranslateContext = createContext();
export const useTranslate = () => useContext(TranslateContext);

export const TranslateContextProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(i18n.language || 'en');

  // ✅ هل اللغة الحالية تكتب من اليمين إلى اليسار؟
  const isRTL = ['ar', 'fa', 'he', 'ur'].includes(language);

  // ✅ دالة مساعدة لضبط الاتجاه في <html>
  const applyDirection = useCallback((langCode) => {
    const isRightToLeft = ['ar', 'fa', 'he', 'ur'].includes(langCode);
    document.documentElement.dir = isRightToLeft ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  }, []);

  // ✅ عند تغيير اللغة يدويًا
  const handleLanguageChange = useCallback(
    (langCode) => {
      if (!langCode) return;
      i18n.changeLanguage(langCode);
      setLanguage(langCode);
      localStorage.setItem('language', langCode);
      applyDirection(langCode);
    },
    [i18n, applyDirection]
  );

  // ✅ تحميل اللغة المخزّنة مسبقًا مرة واحدة فقط
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || i18n.language || 'en';
    i18n.changeLanguage(savedLang);
    setLanguage(savedLang);
    applyDirection(savedLang);
  }, [i18n, applyDirection]);

  // ✅ دالة الترجمة
  const translate = useCallback(
    async (text, targetLang = language || 'ar') => {
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
        return text; // fallback
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  return (
    <TranslateContext.Provider
      value={{
        translate,
        isRTL,
        loading,
        language,
        handleLanguageChange,
      }}
    >
      {children}
    </TranslateContext.Provider>
  );
};
