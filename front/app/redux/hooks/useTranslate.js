'use client';

import { useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import { languageMap } from '@/app/utils/Data';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectCurrentLanguage,
  selectIsRTL,
} from '../features/translate/translateSelectors';
import {
  setLanguage as setReduxLanguage,
} from '../features/translate/translateSlice';
import { useTranslateTextMutation } from '../features/translate/translateApi';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
const normalizeLanguageCode = (code) => {
  if (!code) return 'en';
  const languageName = code[0].toUpperCase() + code.slice(1).toLowerCase();
  return languageMap[code] || languageMap[languageName] || code.split('-')[0].toLowerCase();
};

export const useTranslate = () => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [translateText, { isLoading: loading }] = useTranslateTextMutation();

  const language = useAppSelector(selectCurrentLanguage);
  const isRTL = useAppSelector(selectIsRTL);

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
      const normalizedLang = normalizeLanguageCode(langCode);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', normalizedLang);
      }
      i18n.changeLanguage(normalizedLang);
      dispatch(setReduxLanguage(normalizedLang));
      applyDirection(normalizedLang);
    },
    [i18n, applyDirection, dispatch]
  );

  useIsomorphicLayoutEffect(() => {
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    const userLangName = user?.preferedLanguage;
    const userLangCode = userLangName ? normalizeLanguageCode(userLangName) : null;
    const currentI18n = i18n.language;

    const detectedLang = currentI18n ? normalizeLanguageCode(currentI18n) : null;
    const initialLang = normalizeLanguageCode(savedLang || userLangCode || detectedLang || 'en');

    applyDirection(initialLang);
    if (initialLang !== language || initialLang !== detectedLang) {
      i18n.changeLanguage(initialLang);
      dispatch(setReduxLanguage(initialLang));
    }
  }, [user?.preferedLanguage, i18n.language, language, applyDirection, i18n, dispatch]);

  const translate = useCallback(
    async (text, targetLang = language || 'en') => {
      if (!text) return '';
      try {
        const res = await translateText({
          text,
          targetLang,
        }).unwrap();
        return res.translatedText;
      } catch (err) {
        console.error('Translation error:', err);
        return text;
      }
    },
    [language, translateText]
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
