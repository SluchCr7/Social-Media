'use client';

import { useCallback, useMemo } from 'react';
import { useGetNewsQuery } from '../features/news/newsApi';

export const useNews = (params = {}) => {
  const { data = [], isLoading, isFetching, error, refetch } = useGetNewsQuery(params);
  const fetchAllNews = useCallback(() => refetch(), [refetch]);

  return useMemo(
    () => ({
      news: data,
      loading: isLoading || isFetching,
      error: error?.data?.message || null,
      fetchAllNews,
    }),
    [data, isLoading, isFetching, error, fetchAllNews]
  );
};

export default useNews;
