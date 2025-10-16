'use client'
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import i18n from '@/app/i18n';
import { useTranslation } from "react-i18next";

const TranslateContext = createContext();

export const TranslateContextProvider = ({ children }) => {
  const {i18n} = useTranslation()
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(i18n.language || 'en');
  // ✅ تحديث اللغة في i18next عند تغيير المستخدم
  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    localStorage.setItem('language', langCode);

    // ✅ ضبط الاتجاه تلقائيًا حسب اللغة
    if (['ar', 'fa', 'he', 'ur'].includes(langCode)) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = langCode;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = langCode;
    }
  };

  // ✅ تحميل اللغة المخزنة مسبقًا (لو المستخدم اختارها قبل كده)
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || i18n.language || 'en';
    i18n.changeLanguage(savedLang);
    setLanguage(savedLang);

    if (['ar', 'fa', 'he', 'ur'].includes(savedLang)) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = savedLang;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = savedLang;
    }
  }, []);
  const translate = async (text, targetLang = "ar") => {
    if (!text) return "";
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/translate`, {
        text,
        targetLang,
      });
      return res.data.translatedText;
    } catch (err) {
      console.error(err);
      return text;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TranslateContext.Provider value={{ translate, loading , language, handleLanguageChange }}>
      {children}
    </TranslateContext.Provider>
  );
};

export const useTranslate = () => useContext(TranslateContext);
