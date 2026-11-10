'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectIsMobile, selectIsMobileMenuOpen } from '../features/aside/asideSelectors';
import {
  setIsMobile as setReduxIsMobile,
  setIsMobileMenuOpen as setReduxIsMobileMenuOpen,
} from '../features/aside/asideSlice';



export const useAside = () => {
  const dispatch = useAppDispatch();
  const isMobile = useAppSelector(selectIsMobile);
  const isMobileMenuOpen = useAppSelector(selectIsMobileMenuOpen);

  const setIsMobile = useCallback(
    (val) => {
      dispatch(setReduxIsMobile(val));
    },
    [dispatch]
  );

  const setIsMobileMenuOpen = useCallback(
    (val) => {
      dispatch(setReduxIsMobileMenuOpen(val));
    },
    [dispatch]
  );

  return useMemo(
    () => ({
      isMobile,
      setIsMobile,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
    }),
    [isMobile, setIsMobile, isMobileMenuOpen, setIsMobileMenuOpen]
  );
};

export default useAside;
