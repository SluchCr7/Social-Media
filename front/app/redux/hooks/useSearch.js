'use client';

import { useCallback, useMemo } from 'react';
import { useDebounce } from '@/app/hooks/useDebounce';
import { useAuth } from './useAuth';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  EMPTY_RESULTS,
  useAddSearchHistoryMutation,
  useClearSearchHistoryMutation,
  useGetSearchHistoryQuery,
  useGetSearchResultsQuery,
  useLazyGetSearchResultsQuery,
} from '../features/search/searchApi';
import {
  selectSearchDateRange,
  selectSearchHasMedia,
  selectSearchQuery,
  selectSearchSortBy,
  selectSearchVerifiedOnly,
} from '../features/search/searchSelectors';
import {
  setSearchQuery as setReduxSearchQuery,
  setSortBy as setReduxSortBy,
  setDateRange as setReduxDateRange,
  setHasMedia as setReduxHasMedia,
  setVerifiedOnly as setReduxVerifiedOnly,
} from '../features/search/searchSlice';

const getErrorMessage = (error) =>
  error?.data?.message || error?.response?.data?.message || error?.message;
const EMPTY_PAGINATION = {};

export const useSearch = ({ autoSearch = true } = {}) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const searchQuery = useAppSelector(selectSearchQuery);
  const sortBy = useAppSelector(selectSearchSortBy);
  const dateRange = useAppSelector(selectSearchDateRange);
  const hasMedia = useAppSelector(selectSearchHasMedia);
  const verifiedOnly = useAppSelector(selectSearchVerifiedOnly);
  const debouncedQuery = useDebounce(searchQuery.trim(), 300);
  const queryArgs = {
    q: debouncedQuery,
    type: 'all',
    page: 1,
    sortBy,
    dateRange,
    hasMedia,
    verifiedOnly,
    viewerId: user?._id || 'anonymous',
  };
  const resultsQuery = useGetSearchResultsQuery(queryArgs, {
    skip: debouncedQuery.length < 2,
  });
  const historyQuery = useGetSearchHistoryQuery(
    { userId: user?._id },
    { skip: !autoSearch || !user?._id }
  );
  const [triggerSearch, searchRequest] = useLazyGetSearchResultsQuery();
  const [addHistoryRequest] = useAddSearchHistoryMutation();
  const [clearHistoryRequest] = useClearSearchHistoryMutation();

  const setSearchQuery = useCallback(
    (query) => dispatch(setReduxSearchQuery(query)),
    [dispatch]
  );
  const setSortBy = useCallback((value) => dispatch(setReduxSortBy(value)), [dispatch]);
  const setDateRange = useCallback((value) => dispatch(setReduxDateRange(value)), [dispatch]);
  const setHasMedia = useCallback((value) => dispatch(setReduxHasMedia(value)), [dispatch]);
  const setVerifiedOnly = useCallback(
    (value) => dispatch(setReduxVerifiedOnly(value)),
    [dispatch]
  );

  const performSearch = useCallback(async (query, type = 'all', pageNum = 1) => {
    const trimmed = query?.trim() || '';
    if (trimmed.length < 2) return null;
    try {
      return await triggerSearch({
        q: trimmed,
        type,
        page: pageNum,
        sortBy,
        dateRange,
        hasMedia,
        verifiedOnly,
        viewerId: user?._id || 'anonymous',
      }).unwrap();
    } catch (error) {
      console.error('Search API Error:', error);
      return null;
    }
  }, [
    dateRange,
    hasMedia,
    sortBy,
    triggerSearch,
    verifiedOnly,
    user?._id,
  ]);

  const addToHistory = useCallback(async (query, searchType = 'text', refId = null) => {
    const trimmedQuery = query?.trim();
    if (!user?._id || !trimmedQuery) return;
    try {
      await addHistoryRequest({
        query: trimmedQuery,
        searchType,
        refId,
        userId: user._id,
      }).unwrap();
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  }, [addHistoryRequest, user?._id]);

  const removeFromHistory = useCallback(async (id) => {
    if (!user?._id || !id) return;
    try {
      await clearHistoryRequest({ id, userId: user._id }).unwrap();
    } catch (error) {
      console.error('Error removing search history item:', error);
    }
  }, [clearHistoryRequest, user?._id]);

  const clearAllHistory = useCallback(async () => {
    if (!user?._id) return;
    try {
      await clearHistoryRequest({ userId: user._id }).unwrap();
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }, [clearHistoryRequest, user?._id]);

  const searchResults = resultsQuery.currentData || EMPTY_RESULTS;
  const pagination = searchResults.pagination || EMPTY_PAGINATION;
  const loading = resultsQuery.isFetching || searchRequest.isFetching;
  const error = getErrorMessage(resultsQuery.error || searchRequest.error) || null;

  const loadMore = useCallback(async (type) => {
    if (loading || !pagination[type]?.hasMore) return;
    await performSearch(searchQuery, type, (Number(pagination[type].page) || 1) + 1);
  }, [loading, pagination, performSearch, searchQuery]);

  return useMemo(() => ({
    searchQuery,
    setSearchQuery,
    searchResults,
    searchHistory: historyQuery.currentData || [],
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
  }), [
    searchQuery,
    setSearchQuery,
    searchResults,
    historyQuery.currentData,
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
  ]);
};

export default useSearch;
