'use client';

import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectExploreTab } from '../features/explore/exploreSelectors';
import { setExploreTab as setReduxExploreTab } from '../features/explore/exploreSlice';
import {
  useGetExploreContentInfiniteQuery,
  useGetTrendingQuery,
} from '../features/search/searchApi';

const getErrorMessage = (error) =>
  error?.data?.message || error?.response?.data?.message || error?.message;

const EMPTY_LIST = [];
const EMPTY_PAGINATION = { page: 1, hasMore: false };

export const useExplore = ({ fetchContent = true } = {}) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const exploreTab = useAppSelector(selectExploreTab);
  const exploreQuery = useGetExploreContentInfiniteQuery({
    tab: exploreTab,
    viewerId: user?._id || 'anonymous',
    limit: 12,
  }, {
    skip: !fetchContent || !user?._id,
  });
  const trendingQuery = useGetTrendingQuery({
    viewerId: user?._id || 'anonymous',
  }, { skip: !user?._id });

  const {
    fetchNextPage: fetchNextExplorePage,
    hasNextPage: hasMoreExplore,
    isFetchingNextPage: isFetchingMoreExplore,
    refetch: refetchExploreQuery,
  } = exploreQuery;
  const refetchTrendingQuery = trendingQuery.refetch;
  const pages = exploreQuery.data?.pages || EMPTY_LIST;
  const explorePosts = useMemo(
    () => pages.flatMap((page) => page?.posts || []),
    [pages]
  );
  const suggestedUsers = useMemo(
    () => pages.flatMap((page) => page?.suggestedUsers || []),
    [pages]
  );
  const trendingHashtags = useMemo(() => {
    const exploreTags = pages.flatMap((page) => page?.trendingHashtags || []);
    return exploreTags.length ? exploreTags : trendingQuery.currentData?.hashtags || EMPTY_LIST;
  }, [pages, trendingQuery.currentData?.hashtags]);
  const trendingPosts = trendingQuery.currentData?.posts || EMPTY_LIST;
  const lastPage = pages[pages.length - 1];
  const pagination = lastPage?.pagination || EMPTY_PAGINATION;
  const loading = exploreQuery.isLoading || exploreQuery.isFetchingNextPage;
  const error = getErrorMessage(exploreQuery.error) || null;

  const setExploreTab = useCallback(
    (tab) => dispatch(setReduxExploreTab(tab)),
    [dispatch]
  );
  const loadMoreExplore = useCallback(async () => {
    if (!hasMoreExplore || isFetchingMoreExplore) return;
    return fetchNextExplorePage();
  }, [fetchNextExplorePage, hasMoreExplore, isFetchingMoreExplore]);
  const refreshExplore = useCallback(
    () => refetchExploreQuery(),
    [refetchExploreQuery]
  );
  const refreshTrending = useCallback(
    () => refetchTrendingQuery(),
    [refetchTrendingQuery]
  );

  return useMemo(() => ({
    explorePosts,
    suggestedUsers,
    trendingHashtags,
    trendingPosts,
    loading,
    error,
    exploreTab,
    setExploreTab,
    pagination,
    refreshExplore,
    refreshTrending,
    loadMoreExplore,
  }), [
    explorePosts,
    suggestedUsers,
    trendingHashtags,
    trendingPosts,
    loading,
    error,
    exploreTab,
    setExploreTab,
    pagination,
    refreshExplore,
    refreshTrending,
    loadMoreExplore,
  ]);
};

export default useExplore;
