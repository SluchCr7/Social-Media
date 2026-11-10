'use client';

import { useEffect, useCallback, useMemo } from 'react';
import api from '@/app/utils/api';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import { languageMap } from '@/app/utils/Data';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectCurrentLanguage,
  selectIsRTL,
  selectTranslateLoading,
} from '../features/translate/translateSelectors';
import {
  setLanguage as setReduxLanguage,
  setTranslateLoading,
} from '../features/translate/translateSlice';



export const useTranslate = () => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const language = useAppSelector(selectCurrentLanguage);
  const isRTL = useAppSelector(selectIsRTL);
  const loading = useAppSelector(selectTranslateLoading);

  const applyDirection = useCallback((langCode) => {
    const isRightToLeft = ['ar', 'fa', 'he', 'ur'].includes(langCode);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRightToLeft ? 'rtl' : 'ltr';
      document.documentElement.lang = langCode;
      if (document.body) {
        document.body.dir = isRightToLeft ? 'rtl' : 'ltr';
      }
    }
  }, []);

  const handleLanguageChange = useCallback(
    (langCode) => {
      if (!langCode) return;
      i18n.changeLanguage(langCode);
      dispatch(setReduxLanguage(langCode));
      applyDirection(langCode);
    },
    [i18n, applyDirection, dispatch]
  );

  useEffect(() => {
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    const userLangName = user?.preferedLanguage;
    const userLangCode = userLangName ? languageMap[userLangName] || userLangName : null;
    const currentI18n = i18n.language;

    const initialLang = savedLang || userLangCode || currentI18n || 'en';

    if (initialLang !== language) {
      i18n.changeLanguage(initialLang);
      dispatch(setReduxLanguage(initialLang));
      applyDirection(initialLang);
    }
  }, [user?.preferedLanguage, i18n.language, language, applyDirection, i18n, dispatch]);

  const translate = useCallback(
    async (text, targetLang = language || 'en') => {
      if (!text) return '';
      dispatch(setTranslateLoading(true));
      try {
        const res = await api.post('/translate', {
          text,
          targetLang,
        });
        return res.data.translatedText;
      } catch (err) {
        console.error('Translation error:', err);
        return text;
      } finally {
        dispatch(setTranslateLoading(false));
      }
    },
    [language, dispatch]
  );

  return useMemo(
    () => ({
      translate,
      isRTL,
      loading,
      language,
      handleLanguageChange,
    }),
    [translate, isRTL, loading, language, handleLanguageChange]
  );
};

export default useTranslate;
