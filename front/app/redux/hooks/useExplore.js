'use client';

import { useEffect, useCallback, useMemo, useRef } from 'react';
import api from '../../utils/api';
import { useAuth } from './useAuth';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectExplorePosts,
  selectSuggestedExploreUsers,
  selectTrendingHashtags,
  selectTrendingPosts,
  selectExploreLoading,
  selectExploreError,
  selectExploreTab,
  selectExplorePagination,
} from '../features/explore/exploreSelectors';
import {
  setExplorePosts,
  appendExplorePosts,
  setSuggestedUsers,
  setTrendingHashtags,
  setTrendingPosts,
  setLoading,
  setError,
  setExploreTab as setReduxExploreTab,
  setPagination,
} from '../features/explore/exploreSlice';

export const useExplore = ({ fetchContent = true } = {}) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const requestId = useRef(0);
  const controller = useRef();

  const explorePosts = useAppSelector(selectExplorePosts);
  const suggestedUsers = useAppSelector(selectSuggestedExploreUsers);
  const trendingHashtags = useAppSelector(selectTrendingHashtags);
  const trendingPosts = useAppSelector(selectTrendingPosts);
  const loading = useAppSelector(selectExploreLoading);
  const error = useAppSelector(selectExploreError);
  const exploreTab = useAppSelector(selectExploreTab);
  const pagination = useAppSelector(selectExplorePagination);

  const setExploreTab = useCallback(
    (tab) => dispatch(setReduxExploreTab(tab)),
    [dispatch]
  );

  const fetchExploreContent = useCallback(
    async (tabName = 'trending', pageNum = 1) => {
      if (!user) return;

      const currentRequestId = ++requestId.current;
      controller.current?.abort();
      const currentController = new AbortController();
      controller.current = currentController;
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const { data } = await api.get('/search/explore', {
          params: { tab: tabName, page: pageNum, limit: 12 },
          signal: currentController.signal,
        });

        if (currentRequestId !== requestId.current) return;

        if (pageNum === 1) {
          dispatch(setExplorePosts(data.posts || []));
        } else {
          dispatch(appendExplorePosts(data.posts || []));
        }

        if (data.suggestedUsers) dispatch(setSuggestedUsers(data.suggestedUsers));
        if (data.trendingHashtags) dispatch(setTrendingHashtags(data.trendingHashtags));
        dispatch(setPagination(data.pagination || { page: pageNum, hasMore: false }));
      } catch (err) {
        if (
          err.name !== 'CanceledError' &&
          err.name !== 'AbortError' &&
          currentRequestId === requestId.current
        ) {
          dispatch(setError(err.response?.data?.message || 'Could not load Explore right now.'));
          console.error('Error fetching explore content:', err);
        }
      } finally {
        if (currentRequestId === requestId.current) {
          dispatch(setLoading(false));
          controller.current = undefined;
        }
      }
    },
    [user, dispatch]
  );

  const fetchTrending = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/search/trending');
      dispatch(setTrendingPosts(data.posts || []));
      if (data.hashtags) dispatch(setTrendingHashtags(data.hashtags));
    } catch (err) {
      console.error('Error fetching trending content:', err);
    }
  }, [user, dispatch]);

  const loadMoreExplore = useCallback(async () => {
    if (loading || !pagination.hasMore) return;
    await fetchExploreContent(exploreTab, pagination.page + 1);
  }, [loading, pagination, exploreTab, fetchExploreContent]);

  useEffect(() => {
    if (fetchContent && user) fetchExploreContent(exploreTab, 1);
  }, [fetchContent, user, exploreTab, fetchExploreContent]);

  useEffect(() => {
    if (user) fetchTrending();
  }, [user, fetchTrending]);

  useEffect(
    () => () => {
      requestId.current += 1;
      controller.current?.abort();
    },
    []
  );

  return useMemo(
    () => ({
      explorePosts,
      suggestedUsers,
      trendingHashtags,
      trendingPosts,
      loading,
      error,
      exploreTab,
      setExploreTab,
      pagination,
      refreshExplore: () => fetchExploreContent(exploreTab, 1),
      refreshTrending: fetchTrending,
      loadMoreExplore,
    }),
    [
      explorePosts,
      suggestedUsers,
      trendingHashtags,
      trendingPosts,
      loading,
      error,
      exploreTab,
      setExploreTab,
      pagination,
      fetchExploreContent,
      fetchTrending,
      loadMoreExplore,
    ]
  );
};

export default useExplore;
