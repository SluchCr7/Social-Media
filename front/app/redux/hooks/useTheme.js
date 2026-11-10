'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectTheme } from '../features/theme/themeSelectors';
import { toggleTheme as toggleReduxTheme } from '../features/theme/themeSlice';



export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  const toggleTheme = useCallback(() => {
    dispatch(toggleReduxTheme());
  }, [dispatch]);

  return useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );
};

export default useTheme;
