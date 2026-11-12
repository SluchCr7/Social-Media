'use client';

import { useEffect, useCallback, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectNews, selectNewsLoading, selectNewsError } from '../features/news/newsSelectors';
import { setNews, setLoading, setError } from '../features/news/newsSlice';



export const useNews = () => {
  const dispatch = useAppDispatch();
  const news = useAppSelector(selectNews);
  const loading = useAppSelector(selectNewsLoading);
  const error = useAppSelector(selectNewsError);

  const fetchAllNews = useCallback(
    async (params = {}) => {
      try {
        dispatch(setLoading(true));
        const response = await api.get('/news', { params });
        dispatch(setNews(response.data.articles || []));
        dispatch(setError(null));
      } catch (err) {
        console.error('Error fetching news:', err);
        dispatch(setError('Failed to load news'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchAllNews();
  }, [fetchAllNews]);

  return useMemo(
    () => ({
      news,
      loading,
      error,
      fetchAllNews,
    }),
    [news, loading, error, fetchAllNews]
  );
};

export default useNews;
