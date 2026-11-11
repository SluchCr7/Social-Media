'use client';

import { useEffect, useCallback, useRef, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { usePost } from './usePost';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectMusicList,
  selectTopCharts,
  selectMusicPage,
  selectMusicHasMore,
  selectMusicLoading,
  selectMusicHasLoadedOnce,
  selectMusicError,
  selectMusicGenre,
  selectMusicSearchQuery,
  selectShowModelAddMusic,
  selectCurrentMusic,
} from '../features/music/musicSelectors';
import {
  setMusic as setReduxMusic,
  appendMusic,
  addMusicToState,
  updateMusicInState,
  removeMusicFromState,
  setTopCharts as setReduxTopCharts,
  setPage as setReduxPage,
  setHasMore,
  setIsLoading,
  setHasLoadedOnce,
  setMusicError,
  setGenre as setReduxGenre,
  setSearchQuery as setReduxSearchQuery,
  setShowModelAddMusic as setReduxShowModelAddMusic,
  setCurrentMusic as setReduxCurrentMusic,
  normalizeMusicItem,
  normalizeMusicList,
} from '../features/music/musicSlice';



export const useMusic = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showAlert } = useFeedback();
  const { setPosts } = usePost();

  const music = useAppSelector(selectMusicList);
  const topCharts = useAppSelector(selectTopCharts);
  const page = useAppSelector(selectMusicPage);
  const hasMore = useAppSelector(selectMusicHasMore);
  const isLoading = useAppSelector(selectMusicLoading);
  const hasLoadedOnce = useAppSelector(selectMusicHasLoadedOnce);
  const error = useAppSelector(selectMusicError);
  const genre = useAppSelector(selectMusicGenre);
  const searchQuery = useAppSelector(selectMusicSearchQuery);
  const showModelAddMusic = useAppSelector(selectShowModelAddMusic);
  const currentMusic = useAppSelector(selectCurrentMusic);
  const observer = useRef();
  const requestId = useRef(0);
  const loadingMore = useRef(false);
  const controller = useRef(null);

  const setGenre = useCallback(
    (newGenre) => {
      dispatch(setReduxGenre(newGenre));
    },
    [dispatch]
  );

  const setSearchQuery = useCallback(
    (query) => {
      dispatch(setReduxSearchQuery(query));
    },
    [dispatch]
  );

  const setShowModelAddMusic = useCallback(
    (show) => {
      dispatch(setReduxShowModelAddMusic(show));
    },
    [dispatch]
  );

  const setCurrentMusic = useCallback(
    (song) => {
      dispatch(setReduxCurrentMusic(song));
    },
    [dispatch]
  );

  const fetchMusic = useCallback(
    async (pageNum = 1, currentGenre = 'All') => {
      controller.current?.abort();
      const requestController = new AbortController();
      controller.current = requestController;
      const currentRequestId = ++requestId.current;
      dispatch(setIsLoading(true));
      dispatch(setMusicError(null));

      try {
        const res = await api.get('/music', {
          params: { page: pageNum, limit: 12, genre: currentGenre },
          signal: requestController.signal,
        });
        if (currentRequestId !== requestId.current) return;
        const nextMusic = normalizeMusicList(Array.isArray(res?.data?.music) ? res.data.music : []);

        dispatch(pageNum === 1 ? setReduxMusic(nextMusic) : appendMusic(nextMusic));
        dispatch(setHasMore(pageNum < (Number(res?.data?.totalPages) || 0)));
      } catch (err) {
        if (currentRequestId === requestId.current) {
          console.error('Music library request failed:', err);
          dispatch(setMusicError(err.response?.data?.message || 'Could not load music right now.'));
        }
      } finally {
        if (currentRequestId === requestId.current) {
          loadingMore.current = false;
          controller.current = null;
          dispatch(setIsLoading(false));
          dispatch(setHasLoadedOnce(true));
        }
      }
    },
    [dispatch]
  );

  const fetchTopCharts = useCallback(async () => {
    try {
      const { data } = await api.get('/music/top-charts');
      dispatch(
        setReduxTopCharts({
          trending: normalizeMusicList(Array.isArray(data?.trending) ? data.trending : []),
          popular: normalizeMusicList(Array.isArray(data?.popular) ? data.popular : []),
        })
      );
    } catch (err) {
      console.error('Top Charts Error:', err);
      dispatch(setReduxTopCharts({ trending: [], popular: [] }));
    }
  }, [dispatch]);

  const searchMusic = useCallback(
    async (query) => {
      const trimmedQuery = query?.trim() || '';

      if (!trimmedQuery) {
        dispatch(setReduxSearchQuery(''));
        dispatch(setReduxPage(1));
        fetchMusic(1, genre);
        return;
      }

      const currentRequestId = ++requestId.current;
      controller.current?.abort();
      const requestController = new AbortController();
      controller.current = requestController;
      dispatch(setIsLoading(true));
      dispatch(setMusicError(null));
      try {
        const { data } = await api.get(`/music/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: requestController.signal,
        });
        if (currentRequestId !== requestId.current) return;
        const nextMusic = normalizeMusicList(Array.isArray(data) ? data : []);
        dispatch(setReduxMusic(nextMusic));
        dispatch(setHasMore(false));
        dispatch(setHasLoadedOnce(true));
      } catch (err) {
        if (currentRequestId === requestId.current) {
          console.error('Music search failed:', err);
          dispatch(setMusicError(err.response?.data?.message || 'Music search failed. Try again.'));
        }
      } finally {
        if (currentRequestId === requestId.current) {
          loadingMore.current = false;
          controller.current = null;
          dispatch(setIsLoading(false));
        }
      }
    },
    [genre, fetchMusic, dispatch]
  );

  const retryMusic = useCallback(() => {
    if (searchQuery.trim()) return searchMusic(searchQuery);
    return fetchMusic(1, genre);
  }, [searchQuery, searchMusic, fetchMusic, genre]);

  useEffect(() => {
    dispatch(setReduxPage(1));
    dispatch(setReduxSearchQuery(''));
    fetchMusic(1, genre);
  }, [genre, fetchMusic, dispatch]);

  useEffect(() => {
    fetchTopCharts();
  }, [fetchTopCharts]);

  useEffect(() => () => {
    requestId.current += 1;
    controller.current?.abort();
    observer.current?.disconnect();
  }, []);

  const uploadMusic = useCallback(
    async (formData) => {
      try {
        const res = await api.post('/music', formData);
        const normalized = normalizeMusicItem(res?.data);
        if (normalized) {
          dispatch(addMusicToState(normalized));
        }
        showAlert('Music uploaded successfully!');
        dispatch(setReduxShowModelAddMusic(false));
      } catch (err) {
        console.error(err);
        const message = err?.response?.data?.message || err?.message || 'Failed to upload Music.';
        showAlert(message);
        throw err;
      }
    },
    [showAlert, dispatch]
  );

  const deleteMusic = useCallback(
    async (id) => {
      if (!user) return;
      try {
        const res = await api.delete(`/music/${id}`);
        dispatch(removeMusicFromState(id));
        showAlert(res.data.message);
      } catch (err) {
        console.error(err);
        showAlert('Failed to delete Music.');
      }
    },
    [user, showAlert, dispatch]
  );

  const likeMusic = useCallback(
    async (id) => {
      if (!user) return showAlert('Please login to like music');
      try {
        const res = await api.put(`/music/like/${id}`);
        const updatedMusic = normalizeMusicItem(res?.data?.music);
        if (!updatedMusic) return;

        dispatch(updateMusicInState(updatedMusic));
      } catch (err) {
        console.error(err);
        showAlert('Failed to like music.');
      }
    },
    [user, showAlert, dispatch]
  );

  const viewMusic = useCallback(
    async (id) => {
      try {
        const res = await api.put(`/music/view/${id}`);
        const updated = normalizeMusicItem(res?.data);
        if (!updated) return;
        dispatch(updateMusicInState(updated));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch]
  );

  const addListen = useCallback(
    async (musicId) => {
      if (!user) return;
      try {
        const { data } = await api.post(`/music/listen/${musicId}`);
        const updated = normalizeMusicItem(data);
        if (!updated) return data;
        dispatch(updateMusicInState(updated));
        return updated;
      } catch (error) {
        console.error('Error adding listen:', error);
      }
    },
    [user, dispatch]
  );

  const shareMusicAsPost = useCallback(
    async (musicId, customText = '') => {
      if (!user) return showAlert('You must be logged in to share music.');
      try {
        const { data } = await api.post(`/music/share/${musicId}`, { customText });
        setPosts((prev) => [data.post, ...prev]);
        showAlert('Shared successfully as a post!');
        return data.post;
      } catch (error) {
        console.error('Error sharing music:', error);
        showAlert('Failed to share music.');
      }
    },
    [user, setPosts, showAlert]
  );

  const lastMusicRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      if (!node || isLoading || !hasMore || typeof IntersectionObserver === 'undefined') return;
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && !loadingMore.current) {
          loadingMore.current = true;
          const nextPage = page + 1;
          dispatch(setReduxPage(nextPage));
          fetchMusic(nextPage, genre);
        }
      }, { rootMargin: '240px' });
      observer.current.observe(node);
    },
    [isLoading, hasMore, page, fetchMusic, genre, dispatch]
  );

  return useMemo(
    () => ({
      music,
      topCharts,
      isLoading,
      hasMore,
      hasLoadedOnce,
      error,
      genre,
      setGenre,
      searchQuery,
      setSearchQuery,
      searchMusic,
      retryMusic,
      uploadMusic,
      deleteMusic,
      likeMusic,
      viewMusic,
      addListen,
      shareMusicAsPost,
      lastMusicRef,
      showModelAddMusic,
      setShowModelAddMusic,
      currentMusic,
      setCurrentMusic,
    }),
    [
      music,
      topCharts,
      isLoading,
      hasMore,
      hasLoadedOnce,
      error,
      genre,
      setGenre,
      searchQuery,
      setSearchQuery,
      searchMusic,
      retryMusic,
      uploadMusic,
      deleteMusic,
      likeMusic,
      viewMusic,
      addListen,
      shareMusicAsPost,
      lastMusicRef,
      showModelAddMusic,
      setShowModelAddMusic,
      currentMusic,
      setCurrentMusic,
    ]
  );
};

export default useMusic;
