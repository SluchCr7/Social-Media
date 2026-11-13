'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import { baseApi } from '../api/baseApi';
import { selectShowModelAddReel } from '../features/reels/reelsSelectors';
import { setShowModelAddReel as setReduxShowModelAddReel } from '../features/reels/reelsSlice';
import {
  useCreateReelMutation,
  useDeleteReelMutation,
  useGetReelsInfiniteQuery,
  useLikeReelMutation,
  useShareReelMutation,
  useViewReelMutation,
} from '../features/reels/reelsApi';

const getErrorMessage = (error) =>
  error?.data?.message || error?.response?.data?.message || error?.message;

const patchReelLists = (dispatch, getState, update) => {
  const entries = baseApi.util.selectInvalidatedBy(getState(), [{ type: 'Reel', id: 'LIST' }]);
  return entries
    .filter(({ endpointName }) => endpointName === 'getReels')
    .map(({ endpointName, originalArgs }) =>
      dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
        const firstPage = draft.pages?.[0];
        if (firstPage && Array.isArray(firstPage.reels)) update(firstPage.reels);
      }))
    );
};

export const useReels = ({ autoFetch = true } = {}) => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { user } = useAuth();
  const { showToast } = useFeedback();
  const observer = useRef();
  const currentUserId = user?._id || 'anonymous';
  const reelsQuery = useGetReelsInfiniteQuery(
    { viewerId: currentUserId },
    { skip: !autoFetch }
  );
  const {
    currentData,
    isLoading: queryIsLoading,
    isFetchingNextPage,
    hasNextPage,
    error: queryError,
    fetchNextPage,
    refetch,
  } = reelsQuery;
  const [createReelRequest] = useCreateReelMutation();
  const [deleteReelRequest] = useDeleteReelMutation();
  const [likeReelRequest] = useLikeReelMutation();
  const [viewReelRequest] = useViewReelMutation();
  const [shareReelRequest] = useShareReelMutation();
  const showModelAddReel = useAppSelector(selectShowModelAddReel);

  const reels = useMemo(
    () => (currentData?.pages || []).flatMap((page) => page.reels || []),
    [currentData]
  );
  const page = currentData?.pages?.length || 1;
  const hasMore = Boolean(hasNextPage);
  const isLoading = queryIsLoading || isFetchingNextPage;
  const error = getErrorMessage(queryError) || null;

  const setShowModelAddReel = useCallback(
    (show) => dispatch(setReduxShowModelAddReel(show)),
    [dispatch]
  );
  const fetchReels = useCallback(async (pageNum = 1) => {
    if (!autoFetch) return;
    if (pageNum <= 1) return refetch().unwrap();
    let result;
    for (let nextPage = page + 1; nextPage <= pageNum && hasNextPage; nextPage += 1) {
      result = await fetchNextPage().unwrap();
    }
    return result;
  }, [autoFetch, fetchNextPage, hasNextPage, page, refetch]);
  const setPage = useCallback((nextPage) => fetchReels(nextPage), [fetchReels]);

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
    const patches = patchReelLists(dispatch, () => store.getState(), (list) => list.unshift(tempReel));
    setShowModelAddReel(false);
    const loadingToast = showToast('Uploading reel...', 'loading');

    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('caption', caption);
      const result = await createReelRequest(formData).unwrap();
      const realReel = result?.reel || result;
      patchReelLists(dispatch, () => store.getState(), (list) => {
        const index = list.findIndex((reel) => reel._id === tempId);
        if (index >= 0) list[index] = realReel;
        else list.unshift(realReel);
      });
      showToast('Reel uploaded successfully!', 'success', { id: loadingToast });
      return realReel;
    } catch (requestError) {
      patches.forEach((patch) => patch.undo());
      showToast(getErrorMessage(requestError) || 'Failed to upload reel.', 'error', { id: loadingToast });
      console.error('Error uploading reel:', requestError);
      return null;
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  }, [createReelRequest, dispatch, setShowModelAddReel, showToast, store, user]);

  const deleteReel = useCallback(async (id) => {
    if (!user?._id) {
      showToast('You must be logged in to delete a reel.', 'error');
      return;
    }
    try {
      const data = await deleteReelRequest(id).unwrap();
      showToast(data.message || 'Reel deleted successfully.', 'success');
    } catch (requestError) {
      showToast(getErrorMessage(requestError) || 'Failed to delete reel.', 'error');
      console.error('Error deleting reel:', requestError);
    }
  }, [deleteReelRequest, showToast, user?._id]);

  const likeReel = useCallback(async (id) => {
    if (!user?._id) {
      showToast('You must be logged in to like a reel.', 'error');
      return null;
    }
    try {
      return await likeReelRequest(id).unwrap();
    } catch (requestError) {
      showToast(getErrorMessage(requestError) || 'Failed to like reel.', 'error');
      console.error('Error updating reel like:', requestError);
      return null;
    }
  }, [likeReelRequest, showToast, user?._id]);

  const viewReel = useCallback(async (id) => {
    if (!user?._id) return null;
    try {
      return await viewReelRequest(id).unwrap();
    } catch (requestError) {
      console.error('Error recording reel view:', requestError);
      return null;
    }
  }, [user?._id, viewReelRequest]);

  const shareReel = useCallback(async (id) => {
    if (!user?._id) {
      showToast('You must be logged in to share a reel.', 'error');
      return null;
    }
    try {
      const data = await shareReelRequest(id).unwrap();
      showToast('Reel shared successfully.', 'success');
      return data;
    } catch (requestError) {
      showToast(getErrorMessage(requestError) || 'Failed to share the reel.', 'error');
      console.error('Error sharing reel:', requestError);
      return null;
    }
  }, [shareReelRequest, showToast, user?._id]);

  const lastReelRef = useCallback((node) => {
    observer.current?.disconnect();
    if (!node || !autoFetch || isLoading || error || !hasMore) return;
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { rootMargin: '200px' });
    observer.current.observe(node);
  }, [
    autoFetch,
    error,
    hasMore,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  ]);

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
