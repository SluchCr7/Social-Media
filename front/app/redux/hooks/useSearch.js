'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/backendUrl';
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



export const useSearch = () => {
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

  const setSearchQuery = useCallback((q) => dispatch(setReduxSearchQuery(q)), [dispatch]);
  const setSortBy = useCallback((s) => dispatch(setReduxSortBy(s)), [dispatch]);
  const setDateRange = useCallback((d) => dispatch(setReduxDateRange(d)), [dispatch]);
  const setHasMedia = useCallback((m) => dispatch(setReduxHasMedia(m)), [dispatch]);
  const setVerifiedOnly = useCallback((v) => dispatch(setReduxVerifiedOnly(v)), [dispatch]);

  const config = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${user?.token}` },
    }),
    [user?.token]
  );

  const fetchSearchHistory = useCallback(async () => {
    if (!user?.token) return;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/search/history`, config);
      dispatch(setReduxSearchHistory(data));
    } catch (err) {
      console.error('Error fetching search history:', err);
    }
  }, [user?.token, config, dispatch]);

  const addToHistory = useCallback(
    async (query, searchType = 'text', refId = null) => {
      if (!user?.token || !query.trim()) return;
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/search/history`,
          { query, searchType, refId },
          config
        );
        dispatch(setReduxSearchHistory(data));
      } catch (err) {
        console.error('Error adding to history:', err);
      }
    },
    [user?.token, config, dispatch]
  );

  const removeFromHistory = useCallback(
    async (id) => {
      if (!user?.token) return;
      try {
        const { data } = await axios.delete(
          `${API_BASE_URL}/search/history?id=${id}`,
          config
        );
        dispatch(setReduxSearchHistory(data.searchHistory));
      } catch (err) {
        console.error('Error removing from history:', err);
      }
    },
    [user?.token, config, dispatch]
  );

  const clearAllHistory = useCallback(async () => {
    if (!user?.token) return;
    try {
      await axios.delete(`${API_BASE_URL}/search/history`, config);
      dispatch(setReduxSearchHistory([]));
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  }, [user?.token, config, dispatch]);

  const performSearch = useCallback(
    async (query, type = 'all', pageNum = 1) => {
      const trimmed = query.trim();
      if (!trimmed) {
        dispatch(resetSearch());
        return;
      }

      dispatch(setReduxLoading(true));
      dispatch(setReduxError(null));
      try {
        const url = `${API_BASE_URL}/search?q=${encodeURIComponent(
          trimmed
        )}&type=${type}&sortBy=${sortBy}&dateRange=${dateRange}&hasMedia=${hasMedia}&verifiedOnly=${verifiedOnly}&page=${pageNum}&limit=12`;
        const { data } = await axios.get(url, config);

        const currentResults = selectSearchResults(store.getState());
        dispatch(
          setReduxSearchResults(((prev) => {
            if (pageNum === 1) {
              if (type === 'all') {
                return {
                  users: data.users || [],
                  posts: data.posts || [],
                  communities: data.communities || [],
                  hashtags: data.hashtags || [],
                };
              } else {
                return {
                  ...prev,
                  [type]: data[type] || [],
                };
              }
            } else {
              return {
                ...prev,
                [type]: [...(prev[type] || []), ...(data[type] || [])],
              };
            }
          })(currentResults))
        );

        const currentPagination = selectSearchPagination(store.getState());
        dispatch(
          setReduxPagination(((prev) => {
            const newPag = { ...prev };
            if (type === 'all') {
              if (data.pagination) {
                Object.keys(data.pagination).forEach((key) => {
                  newPag[key] = data.pagination[key];
                });
              }
            } else if (data.pagination && data.pagination[type]) {
              newPag[type] = data.pagination[type];
            }
            return newPag;
          })(currentPagination))
        );
      } catch (err) {
        dispatch(setReduxError(err.response?.data?.message || 'Something went wrong during search'));
        console.error('Search API Error:', err);
      } finally {
        dispatch(setReduxLoading(false));
      }
    },
    [config, sortBy, dateRange, hasMedia, verifiedOnly, dispatch, store]
  );

  const loadMore = useCallback(
    async (type) => {
      if (loading) return;
      const currentPagination = pagination[type];
      if (currentPagination && currentPagination.hasMore) {
        const nextPage = currentPagination.page + 1;
        await performSearch(searchQuery, type, nextPage);
      }
    },
    [pagination, loading, performSearch, searchQuery]
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      dispatch(resetSearch());
      return;
    }

    const handler = setTimeout(() => {
      performSearch(searchQuery, 'all', 1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, sortBy, dateRange, hasMedia, verifiedOnly, performSearch, dispatch]);

  useEffect(() => {
    if (user?.token) {
      fetchSearchHistory();
    }
  }, [user?.token, fetchSearchHistory]);

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
