'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectMusicGenre, selectMusicSearchQuery, selectShowModelAddMusic } from '../features/music/musicSelectors';
import {
  setGenre as setReduxGenre,
  setSearchQuery as setReduxSearchQuery,
  setShowModelAddMusic as setReduxShowModelAddMusic,
} from '../features/music/musicSlice';
import { removeQueueTrack, updateQueueTrack } from '../features/musicPlayer/musicPlayerSlice';
import {
  useAddMusicListenMutation,
  useDeleteMusicMutation,
  useGetMusicInfiniteQuery,
  useSearchMusicQuery,
  useGetTopMusicChartsQuery,
  useLikeMusicMutation,
  useShareMusicAsPostMutation,
  useUploadMusicMutation,
  useViewMusicMutation,
} from '../features/music/musicApi';

const errorMessage = (error) => error?.data?.message || error?.message || null;

export const useMusic = ({ autoFetch = true } = {}) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showAlert } = useFeedback();
  const observer = useRef();
  const [activeSearch, setActiveSearch] = useState('');
  const genre = useAppSelector(selectMusicGenre);
  const searchQuery = useAppSelector(selectMusicSearchQuery);
  const showModelAddMusic = useAppSelector(selectShowModelAddMusic);
  const musicQuery = useGetMusicInfiniteQuery({ genre }, {
    skip: !autoFetch || Boolean(activeSearch),
  });
  const {
    currentData: musicData,
    isLoading: musicIsLoading,
    isFetchingNextPage: isFetchingNextMusicPage,
    hasNextPage: hasNextMusicPage,
    fetchNextPage: fetchNextMusicPage,
    refetch: refetchMusic,
  } = musicQuery;
  const searchMusicQuery = useSearchMusicQuery({ query: activeSearch }, {
    skip: !autoFetch || !activeSearch,
  });
  const {
    currentData: searchedMusic,
    isLoading: searchIsLoading,
    isFetching: isFetchingSearch,
    error: searchError,
    refetch: refetchSearch,
  } = searchMusicQuery;
  const topChartsQuery = useGetTopMusicChartsQuery(undefined, { skip: !autoFetch });
  const [uploadRequest] = useUploadMusicMutation();
  const [deleteRequest] = useDeleteMusicMutation();
  const [likeRequest] = useLikeMusicMutation();
  const [viewRequest] = useViewMusicMutation();
  const [listenRequest] = useAddMusicListenMutation();
  const [shareRequest] = useShareMusicAsPostMutation();

  const music = useMemo(() => (
    activeSearch
      ? searchedMusic || []
      : (musicData?.pages || []).flatMap((page) => page.music || [])
  ), [activeSearch, musicData, searchedMusic]);
  const isSearching = Boolean(activeSearch);
  const isLoading = isSearching
    ? searchIsLoading || isFetchingSearch
    : musicIsLoading || isFetchingNextMusicPage;
  const hasLoadedOnce = isSearching ? searchMusicQuery.isSuccess : musicQuery.isSuccess;
  const error = errorMessage(isSearching ? searchError : musicQuery.error);
  const hasMore = !isSearching && Boolean(hasNextMusicPage);
  const page = musicData?.pages?.length || 1;
  const topCharts = useMemo(
    () => topChartsQuery.currentData || { trending: [], popular: [] },
    [topChartsQuery.currentData]
  );

  const setGenre = useCallback((value) => {
    dispatch(setReduxGenre(value));
    dispatch(setReduxSearchQuery(''));
    setActiveSearch('');
  }, [dispatch]);
  const setSearchQuery = useCallback(
    (value) => dispatch(setReduxSearchQuery(value)),
    [dispatch]
  );
  const setShowModelAddMusic = useCallback(
    (value) => dispatch(setReduxShowModelAddMusic(value)),
    [dispatch]
  );

  const fetchMusic = useCallback(async (pageNum = 1, currentGenre = genre) => {
    if (!autoFetch) return;
    if (currentGenre !== genre) {
      dispatch(setReduxGenre(currentGenre));
      return;
    }
    if (activeSearch) return refetchSearch().unwrap();
    if (pageNum <= 1) return refetchMusic().unwrap();
    let result;
    for (let nextPage = page + 1; nextPage <= pageNum && hasNextMusicPage; nextPage += 1) {
      result = await fetchNextMusicPage().unwrap();
    }
    return result;
  }, [
    activeSearch,
    autoFetch,
    dispatch,
    fetchNextMusicPage,
    genre,
    hasNextMusicPage,
    page,
    refetchMusic,
    refetchSearch,
  ]);
  const searchMusic = useCallback((query) => {
    const trimmed = query?.trim() || '';
    dispatch(setReduxSearchQuery(trimmed));
    setActiveSearch(trimmed);
    return undefined;
  }, [dispatch]);
  const retryMusic = useCallback(
    () => activeSearch ? refetchSearch() : refetchMusic(),
    [activeSearch, refetchMusic, refetchSearch]
  );

  const uploadMusic = useCallback(async (formData) => {
    try {
      const musicItem = await uploadRequest(formData).unwrap();
      showAlert('Music uploaded successfully!');
      setShowModelAddMusic(false);
      return musicItem;
    } catch (requestError) {
      console.error(requestError);
      showAlert(errorMessage(requestError) || 'Failed to upload Music.');
      throw requestError;
    }
  }, [setShowModelAddMusic, showAlert, uploadRequest]);

  const deleteMusic = useCallback(async (id) => {
    if (!user) return;
    try {
      const data = await deleteRequest(id).unwrap();
      dispatch(removeQueueTrack(id));
      showAlert(data.message || 'Music deleted successfully.');
    } catch (requestError) {
      console.error(requestError);
      showAlert(errorMessage(requestError) || 'Failed to delete Music.');
    }
  }, [deleteRequest, dispatch, showAlert, user]);

  const likeMusic = useCallback(async (id) => {
    if (!user) {
      showAlert('Please login to like music');
      return;
    }
    try {
      const updated = await likeRequest(id).unwrap();
      if (updated) dispatch(updateQueueTrack(updated));
      return updated;
    } catch (requestError) {
      console.error(requestError);
      showAlert(errorMessage(requestError) || 'Failed to like music.');
    }
  }, [dispatch, likeRequest, showAlert, user]);

  const viewMusic = useCallback(async (id) => {
    try {
      const updated = await viewRequest(id).unwrap();
      if (updated) dispatch(updateQueueTrack(updated));
      return updated;
    } catch (requestError) {
      console.error(requestError);
    }
  }, [dispatch, viewRequest]);

  const addListen = useCallback(async (musicId) => {
    if (!user) return;
    try {
      const updated = await listenRequest(musicId).unwrap();
      if (updated) dispatch(updateQueueTrack(updated));
      return updated;
    } catch (requestError) {
      console.error('Error adding listen:', requestError);
    }
  }, [dispatch, listenRequest, user]);

  const shareMusicAsPost = useCallback(async (musicId, customText = '') => {
    if (!user) {
      showAlert('You must be logged in to share music.');
      return;
    }
    try {
      const data = await shareRequest({ musicId, customText }).unwrap();
      showAlert('Shared successfully as a post!');
      return data.post;
    } catch (requestError) {
      console.error('Error sharing music:', requestError);
      showAlert(errorMessage(requestError) || 'Failed to share music.');
    }
  }, [shareRequest, showAlert, user]);

  const lastMusicRef = useCallback((node) => {
    observer.current?.disconnect();
    if (!node || !autoFetch || isSearching || isLoading || !hasMore ||
      typeof IntersectionObserver === 'undefined') return;
    observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextMusicPage) {
          fetchNextMusicPage();
      }
    }, { rootMargin: '240px' });
    observer.current.observe(node);
  }, [
    autoFetch,
    hasMore,
    isLoading,
    isSearching,
    fetchNextMusicPage,
    isFetchingNextMusicPage,
  ]);

  useEffect(() => () => observer.current?.disconnect(), []);

  return useMemo(() => ({
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
    fetchMusic,
    uploadMusic,
    deleteMusic,
    likeMusic,
    viewMusic,
    addListen,
    shareMusicAsPost,
    lastMusicRef,
    showModelAddMusic,
    setShowModelAddMusic,
  }), [
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
    fetchMusic,
    uploadMusic,
    deleteMusic,
    likeMusic,
    viewMusic,
    addListen,
    shareMusicAsPost,
    lastMusicRef,
    showModelAddMusic,
    setShowModelAddMusic,
  ]);
};

export default useMusic;
