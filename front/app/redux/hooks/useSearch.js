'use client';

import { useEffect, useCallback, useMemo } from 'react';
import api from '../../utils/api';
import { useAuth } from './useAuth';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import {
  selectSearchQuery,
  selectSearchResults,
  selectSearchHistory,
  selectSearchLoading,
  selectSearchError,
  selectSearchSortBy,
  selectSearchDateRange,
  selectSearchHasMedia,
  selectSearchVerifiedOnly,
  selectSearchPagination,
} from '../features/search/searchSelectors';
import {
  setSearchQuery as setReduxSearchQuery,
  setSearchResults as setReduxSearchResults,
  setSearchHistory as setReduxSearchHistory,
  setLoading as setReduxLoading,
  setError as setReduxError,
  setSortBy as setReduxSortBy,
  setDateRange as setReduxDateRange,
  setHasMedia as setReduxHasMedia,
  setVerifiedOnly as setReduxVerifiedOnly,
  setPagination as setReduxPagination,
  resetSearch,
} from '../features/search/searchSlice';

let latestSearchRequest = 0;
let activeSearchController;

export const useSearch = ({ autoSearch = true } = {}) => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { user } = useAuth();

  const searchQuery = useAppSelector(selectSearchQuery);
  const searchResults = useAppSelector(selectSearchResults);
  const searchHistory = useAppSelector(selectSearchHistory);
  const loading = useAppSelector(selectSearchLoading);
  const error = useAppSelector(selectSearchError);
  const sortBy = useAppSelector(selectSearchSortBy);
  const dateRange = useAppSelector(selectSearchDateRange);
  const hasMedia = useAppSelector(selectSearchHasMedia);
  const verifiedOnly = useAppSelector(selectSearchVerifiedOnly);
  const pagination = useAppSelector(selectSearchPagination);

  const setSearchQuery = useCallback((query) => dispatch(setReduxSearchQuery(query)), [dispatch]);
  const setSortBy = useCallback((value) => dispatch(setReduxSortBy(value)), [dispatch]);
  const setDateRange = useCallback((value) => dispatch(setReduxDateRange(value)), [dispatch]);
  const setHasMedia = useCallback((value) => dispatch(setReduxHasMedia(value)), [dispatch]);
  const setVerifiedOnly = useCallback((value) => dispatch(setReduxVerifiedOnly(value)), [dispatch]);

  const fetchSearchHistory = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/search/history');
      dispatch(setReduxSearchHistory(data));
    } catch (err) {
      console.error('Error fetching search history:', err);
    }
  }, [user, dispatch]);

  const addToHistory = useCallback(
    async (query, searchType = 'text', refId = null) => {
      if (!user || !query?.trim()) return;
      try {
        const { data } = await api.post('/search/history', {
          query: query.trim(),
          searchType,
          refId,
        });
        dispatch(setReduxSearchHistory(data));
      } catch (err) {
        console.error('Error adding to search history:', err);
      }
    },
    [user, dispatch]
  );

  const removeFromHistory = useCallback(
    async (id) => {
      if (!user || !id) return;
      try {
        const { data } = await api.delete('/search/history', { params: { id } });
        dispatch(setReduxSearchHistory(data.searchHistory));
      } catch (err) {
        console.error('Error removing search history item:', err);
      }
    },
    [user, dispatch]
  );

  const clearAllHistory = useCallback(async () => {
    if (!user) return;
    try {
      await api.delete('/search/history');
      dispatch(setReduxSearchHistory([]));
    } catch (err) {
      console.error('Error clearing search history:', err);
    }
  }, [user, dispatch]);

  const performSearch = useCallback(
    async (query, type = 'all', pageNum = 1) => {
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        latestSearchRequest += 1;
        activeSearchController?.abort();
        dispatch(resetSearch());
        dispatch(setReduxLoading(false));
        return;
      }

      const requestId = ++latestSearchRequest;
      activeSearchController?.abort();
      const controller = new AbortController();
      activeSearchController = controller;
      dispatch(setReduxLoading(true));
      dispatch(setReduxError(null));

      try {
        const { data } = await api.get('/search', {
          params: {
            q: trimmed,
            type,
            sortBy,
            dateRange,
            hasMedia,
            verifiedOnly,
            page: pageNum,
            limit: 12,
          },
          signal: controller.signal,
        });

        if (requestId !== latestSearchRequest) return;

        const currentResults = selectSearchResults(store.getState());
        const nextResults = { ...currentResults };
        const resultTypes = type === 'all' ? ['users', 'posts', 'communities', 'hashtags'] : [type];

        for (const resultType of resultTypes) {
          const incoming = Array.isArray(data[resultType]) ? data[resultType] : [];
          nextResults[resultType] =
            pageNum === 1 ? incoming : [...(currentResults[resultType] || []), ...incoming];
        }

        dispatch(setReduxSearchResults(nextResults));

        const currentPagination = selectSearchPagination(store.getState());
        dispatch(
          setReduxPagination({
            ...currentPagination,
            ...Object.fromEntries(
              resultTypes
                .filter((resultType) => data.pagination?.[resultType])
                .map((resultType) => [resultType, data.pagination[resultType]])
            ),
          })
        );
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError' && requestId === latestSearchRequest) {
          dispatch(setReduxError(err.response?.data?.message || 'Search is temporarily unavailable.'));
          console.error('Search API Error:', err);
        }
      } finally {
        if (requestId === latestSearchRequest) {
          dispatch(setReduxLoading(false));
          activeSearchController = undefined;
        }
      }
    },
    [sortBy, dateRange, hasMedia, verifiedOnly, dispatch, store]
  );

  const loadMore = useCallback(
    async (type) => {
      if (loading) return;
      const currentPagination = pagination[type];
      if (currentPagination?.hasMore) {
        await performSearch(searchQuery, type, currentPagination.page + 1);
      }
    },
    [pagination, loading, performSearch, searchQuery]
  );

  useEffect(() => {
    if (autoSearch) {
      if (searchQuery.trim().length < 2) {
        latestSearchRequest += 1;
        activeSearchController?.abort();
        activeSearchController = undefined;
        dispatch(resetSearch());
        dispatch(setReduxLoading(false));
        return undefined;
      }

      const handler = setTimeout(() => performSearch(searchQuery, 'all', 1), 300);
      return () => clearTimeout(handler);
    }
    return undefined;
  }, [autoSearch, searchQuery, sortBy, dateRange, hasMedia, verifiedOnly, performSearch, dispatch]);

  useEffect(() => {
    if (autoSearch && user) fetchSearchHistory();
  }, [autoSearch, user, fetchSearchHistory]);

  return useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      searchResults,
      searchHistory,
      loading,
      error,
      sortBy,
      setSortBy,
      dateRange,
      setDateRange,
      hasMedia,
      setHasMedia,
      verifiedOnly,
      setVerifiedOnly,
      pagination,
      addToHistory,
      removeFromHistory,
      clearAllHistory,
      performSearch,
      loadMore,
    }),
    [
      searchQuery,
      setSearchQuery,
      searchResults,
      searchHistory,
      loading,
      error,
      sortBy,
      setSortBy,
      dateRange,
      setDateRange,
      hasMedia,
      setHasMedia,
      verifiedOnly,
      setVerifiedOnly,
      pagination,
      addToHistory,
      removeFromHistory,
      clearAllHistory,
      performSearch,
      loadMore,
    ]
  );
};

export default useSearch;
