'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/backendUrl';
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



export const useExplore = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const explorePosts = useAppSelector(selectExplorePosts);
  const suggestedUsers = useAppSelector(selectSuggestedExploreUsers);
  const trendingHashtags = useAppSelector(selectTrendingHashtags);
  const trendingPosts = useAppSelector(selectTrendingPosts);
  const loading = useAppSelector(selectExploreLoading);
  const error = useAppSelector(selectExploreError);
  const exploreTab = useAppSelector(selectExploreTab);
  const pagination = useAppSelector(selectExplorePagination);

  const setExploreTab = useCallback(
    (tab) => {
      dispatch(setReduxExploreTab(tab));
    },
    [dispatch]
  );

  const config = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${user?.token}` },
    }),
    [user?.token]
  );

  const fetchExploreContent = useCallback(
    async (tabName = 'trending', pageNum = 1) => {
      if (!user?.token) return;
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/search/explore?tab=${tabName}&page=${pageNum}&limit=12`,
          config
        );

        if (pageNum === 1) {
          dispatch(setExplorePosts(data.posts || []));
        } else {
          dispatch(appendExplorePosts(data.posts));
        }

        if (data.suggestedUsers) dispatch(setSuggestedUsers(data.suggestedUsers));
        if (data.trendingHashtags) dispatch(setTrendingHashtags(data.trendingHashtags));

        dispatch(
          setPagination({
            page: pageNum,
            hasMore: data.pagination?.hasMore || false,
          })
        );
      } catch (err) {
        console.error('Error fetching explore content:', err);
        dispatch(setError(err.response?.data?.message || 'Failed to load explore content'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [user?.token, config, dispatch]
  );

  const fetchTrending = useCallback(async () => {
    if (!user?.token) return;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/search/trending`, config);
      dispatch(setTrendingPosts(data.posts || []));
      if (data.hashtags) dispatch(setTrendingHashtags(data.hashtags));
    } catch (err) {
      console.error('Error fetching trending content:', err);
    }
  }, [user?.token, config, dispatch]);

  const loadMoreExplore = useCallback(async () => {
    if (loading || !pagination.hasMore) return;
    const nextPage = pagination.page + 1;
    await fetchExploreContent(exploreTab, nextPage);
  }, [loading, pagination, exploreTab, fetchExploreContent]);

  useEffect(() => {
    if (user?.token) {
      fetchExploreContent(exploreTab, 1);
    }
  }, [user?.token, exploreTab, fetchExploreContent]);

  useEffect(() => {
    if (user?.token) {
      fetchTrending();
    }
  }, [user?.token, fetchTrending]);

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
