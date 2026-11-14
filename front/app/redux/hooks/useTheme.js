'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectAccentColor, selectTheme } from '../features/theme/themeSelectors';
import {
  setAccentColor as setReduxAccentColor,
  toggleTheme as toggleReduxTheme,
} from '../features/theme/themeSlice';



export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const accentColor = useAppSelector(selectAccentColor);

  const toggleTheme = useCallback(() => {
    dispatch(toggleReduxTheme());
  }, [dispatch]);
  const setAccentColor = useCallback((color) => {
    dispatch(setReduxAccentColor(color));
  }, [dispatch]);

  return useMemo(
    () => ({
      theme,
      toggleTheme,
      accentColor,
      setAccentColor,
    }),
    [theme, toggleTheme, accentColor, setAccentColor]
  );
};

export default useTheme;
