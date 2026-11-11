'use client';

import { useCallback, useEffect, useRef, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import {
  selectReels,
  selectReelsPage,
  selectReelsHasMore,
  selectReelsLoading,
  selectReelsError,
  selectShowModelAddReel,
} from '../features/reels/reelsSelectors';
import {
  setReels as setReduxReels,
  addReelToState,
  updateReelInState,
  removeReelFromState,
  setPage as setReduxPage,
  setHasMore,
  setIsLoading,
  setError,
  setShowModelAddReel as setReduxShowModelAddReel,
  optimisticLikeReel,
} from '../features/reels/reelsSlice';

export const useReels = ({ autoFetch = true } = {}) => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { user } = useAuth();
  const { showToast } = useFeedback();
  const requestId = useRef(0);
  const controller = useRef();
  const fetchingPage = useRef(false);
  const loadingMore = useRef(false);
  const observer = useRef();

  const reels = useAppSelector(selectReels);
  const page = useAppSelector(selectReelsPage);
  const hasMore = useAppSelector(selectReelsHasMore);
  const isLoading = useAppSelector(selectReelsLoading);
  const error = useAppSelector(selectReelsError);
  const showModelAddReel = useAppSelector(selectShowModelAddReel);

  const setShowModelAddReel = useCallback(
    (show) => dispatch(setReduxShowModelAddReel(show)),
    [dispatch]
  );
  const setPage = useCallback((nextPage) => dispatch(setReduxPage(nextPage)), [dispatch]);

  const fetchReels = useCallback(async (pageNum = 1) => {
    if (fetchingPage.current || (!selectReelsHasMore(store.getState()) && pageNum !== 1)) return;

    if (pageNum === 1 && selectReelsPage(store.getState()) !== 1) {
      dispatch(setReduxPage(1));
    }
    fetchingPage.current = true;
    const currentRequestId = ++requestId.current;
    const currentController = new AbortController();
    controller.current = currentController;
    dispatch(setIsLoading(true));
    dispatch(setError(null));

    try {
      const { data } = await api.get('/reel', {
        params: { page: pageNum, limit: 10 },
        signal: currentController.signal,
      });
      if (currentRequestId !== requestId.current) return;

      const newReels = Array.isArray(data.reels) ? data.reels : [];
      const currentReels = selectReels(store.getState());
      const currentIds = new Set(currentReels.map((reel) => reel._id));
      const nextReels = pageNum === 1
        ? newReels
        : [...currentReels, ...newReels.filter((reel) => !currentIds.has(reel._id))];

      dispatch(setReduxReels(nextReels));
      dispatch(setHasMore(pageNum < (Number(data.totalPages) || 0)));
    } catch (err) {
      if (
        err.name !== 'CanceledError' &&
        err.name !== 'AbortError' &&
        currentRequestId === requestId.current
      ) {
        dispatch(setError(err.response?.data?.message || 'Could not load reels right now.'));
        console.error('Error fetching reels:', err);
      }
    } finally {
      if (currentRequestId === requestId.current) {
        fetchingPage.current = false;
        loadingMore.current = false;
        controller.current = undefined;
        dispatch(setIsLoading(false));
      }
    }
  }, [dispatch, store]);

  useEffect(() => {
    if (autoFetch) fetchReels(page);
  }, [autoFetch, page, fetchReels]);

  useEffect(() => () => {
    requestId.current += 1;
    if (controller.current) {
      controller.current.abort();
      dispatch(setIsLoading(false));
    }
  }, [dispatch]);

  const uploadReel = useCallback(async (file, caption = '') => {
    if (!user?._id) {
      showToast('You must be logged in to upload a reel.', 'error');
      return null;
    }
    if (!file || !file.type?.startsWith('video/')) {
      showToast('Choose a valid video file.', 'error');
      return null;
    }
    if (file.size > 100 * 1024 * 1024) {
      showToast('Video files must be 100 MB or smaller.', 'error');
      return null;
    }
    if (typeof caption !== 'string' || caption.length > 2200) {
      showToast('Caption must be 2200 characters or fewer.', 'error');
      return null;
    }

    const tempId = `temp-${Date.now()}`;
    const previewUrl = URL.createObjectURL(file);
    const tempReel = {
      _id: tempId,
      videoUrl: previewUrl,
      thumbnailUrl: previewUrl,
      caption,
      owner: user,
      likes: [],
      views: [],
      comments: [],
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    dispatch(addReelToState(tempReel));
    dispatch(setReduxShowModelAddReel(false));
    const loadingToast = showToast('Uploading reel...', 'loading');

    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('caption', caption);

      const { data } = await api.post('/reel', formData);
      const realReel = data.reel || data;
      dispatch(removeReelFromState(tempId));
      dispatch(addReelToState(realReel));
      showToast('Reel uploaded successfully!', 'success', { id: loadingToast });
      return realReel;
    } catch (err) {
      dispatch(removeReelFromState(tempId));
      showToast(err.response?.data?.message || 'Failed to upload reel.', 'error', { id: loadingToast });
      console.error('Error uploading reel:', err);
      return null;
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  }, [user, showToast, dispatch]);

  const deleteReel = useCallback(async (id) => {
    if (!user?._id) return showToast('You must be logged in to delete a reel.', 'error');
    try {
      const { data } = await api.delete(`/reel/${id}`);
      dispatch(removeReelFromState(id));
      showToast(data.message || 'Reel deleted successfully.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete reel.', 'error');
      console.error('Error deleting reel:', err);
    }
  }, [user, showToast, dispatch]);

  const likeReel = useCallback(async (id) => {
    if (!user?._id) return showToast('You must be logged in to like a reel.', 'error');
    dispatch(optimisticLikeReel({ reelId: id, userId: user._id }));
    try {
      const { data } = await api.put(`/reel/like/${id}`);
      dispatch(updateReelInState(data));
      return data;
    } catch (err) {
      dispatch(optimisticLikeReel({ reelId: id, userId: user._id }));
      showToast(err.response?.data?.message || 'Failed to like reel.', 'error');
      console.error('Error updating reel like:', err);
      return null;
    }
  }, [user, showToast, dispatch]);

  const viewReel = useCallback(async (id) => {
    if (!user?._id) return null;
    try {
      const { data } = await api.put(`/reel/view/${id}`);
      dispatch(updateReelInState(data));
      return data;
    } catch (err) {
      console.error('Error recording reel view:', err);
      return null;
    }
  }, [user, dispatch]);

  const shareReel = useCallback(async (id) => {
    if (!user?._id) return showToast('You must be logged in to share a reel.', 'error');
    try {
      const { data } = await api.post(`/reel/share/${id}`);
      dispatch(addReelToState(data));
      showToast('Reel shared successfully.', 'success');
      return data;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to share the reel.', 'error');
      console.error('Error sharing reel:', err);
      return null;
    }
  }, [user, showToast, dispatch]);

  const lastReelRef = useCallback((node) => {
    observer.current?.disconnect();
    if (!node || !autoFetch || isLoading || error || !hasMore) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !loadingMore.current && !fetchingPage.current) {
        loadingMore.current = true;
        dispatch(setReduxPage(page + 1));
      }
    }, { rootMargin: '200px' });
    observer.current.observe(node);
  }, [autoFetch, dispatch, error, hasMore, isLoading, page]);

  useEffect(() => () => observer.current?.disconnect(), []);

  return useMemo(() => ({
    reels,
    page,
    fetchReels,
    setPage,
    uploadReel,
    deleteReel,
    likeReel,
    viewReel,
    isLoading,
    error,
    hasMore,
    lastReelRef,
    shareReel,
    showModelAddReel,
    setShowModelAddReel,
  }), [
    reels, page, fetchReels, setPage, uploadReel, deleteReel, likeReel, viewReel,
    isLoading, error, hasMore, lastReelRef, shareReel, showModelAddReel, setShowModelAddReel,
  ]);
};

export default useReels;
