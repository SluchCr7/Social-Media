'use client';

import { useCallback, useEffect, useRef, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { checkUserStatus } from '@/app/utils/checkUserLog';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import {
  selectReels,
  selectReelsPage,
  selectReelsHasMore,
  selectReelsLoading,
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
  setShowModelAddReel as setReduxShowModelAddReel,
  optimisticLikeReel,
} from '../features/reels/reelsSlice';



export const useReels = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { user } = useAuth();
  const { showAlert } = useFeedback();

  const reels = useAppSelector(selectReels);
  const page = useAppSelector(selectReelsPage);
  const hasMore = useAppSelector(selectReelsHasMore);
  const isLoading = useAppSelector(selectReelsLoading);
  const showModelAddReel = useAppSelector(selectShowModelAddReel);

  const setShowModelAddReel = useCallback(
    (show) => {
      dispatch(setReduxShowModelAddReel(show));
    },
    [dispatch]
  );

  const fetchReels = useCallback(
    async (pageNum = 1) => {
      if (!hasMore && pageNum !== 1) return;

      dispatch(setIsLoading(true));
      try {
        const res = await api.get('/reel', { params: { page: pageNum, limit: 10 } });
        const newReels = Array.isArray(res.data.reels) ? res.data.reels : [];
        const currentReels = selectReels(store.getState());
        const nextReels =
          pageNum === 1
            ? newReels
            : [
                ...currentReels,
                ...newReels.filter(
                  (newReel) => !currentReels.some((reel) => reel._id === newReel._id)
                ),
              ];
        dispatch(setReduxReels(nextReels));
        dispatch(setHasMore(pageNum < res.data.totalPages));
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [hasMore, dispatch, store]
  );

  useEffect(() => {
    fetchReels(page);
  }, [page, fetchReels]);

  const uploadReel = useCallback(
    async (file, caption = '') => {
      if (!user?.token) return showAlert('You must be logged in to upload a reel.');

      const tempId = `temp-${Date.now()}`;
      const tempReel = {
        _id: tempId,
        videoUrl: URL.createObjectURL(file),
        thumbnailUrl: URL.createObjectURL(file),
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
      showAlert('Uploading reel...', 'loading');

      try {
        const formData = new FormData();
        formData.append('video', file);
        formData.append('caption', caption);

        const res = await api.post('/reel', formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        const realReel = res.data.reel || res.data;
        dispatch(removeReelFromState(tempId));
        dispatch(addReelToState(realReel));
        showAlert('Reel uploaded successfully!', 'success');
      } catch (err) {
        console.error(err);
        dispatch(removeReelFromState(tempId));
        showAlert(err?.response?.data?.message || 'Failed to upload reel.', 'error');
      }
    },
    [user, showAlert, dispatch]
  );

  const deleteReel = useCallback(
    async (id) => {
      if (!user?.token) return;

      dispatch(removeReelFromState(id));

      try {
        const res = await api.delete(`/reel/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        showAlert(res.data.message);
      } catch (err) {
        console.error(err);
        showAlert('Failed to delete reel.');
      }
    },
    [user, showAlert, dispatch]
  );

  const likeReel = useCallback(
    async (id) => {
      if (!user?.token) return;

      dispatch(optimisticLikeReel({ reelId: id, userId: user._id }));

      try {
        const res = await api.put(
          `/reel/like/${id}`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        dispatch(updateReelInState(res.data));
      } catch (err) {
        console.error(err);
        showAlert('Failed to like reel.');
      }
    },
    [user, showAlert, dispatch]
  );

  const viewReel = useCallback(
    async (id) => {
      if (!user?.token) return;
      try {
        const res = await api.put(
          `/reel/view/${id}`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        dispatch(updateReelInState(res.data));
      } catch (err) {
        console.error(err);
      }
    },
    [user, dispatch]
  );

  const shareReel = useCallback(
    async (id) => {
      if (!checkUserStatus('Share Reel', showAlert, user)) return;

      try {
        const res = await api.post(
          `/reel/share/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        showAlert('✅ Reel shared successfully.');
        dispatch(addReelToState(res.data));
      } catch (err) {
        console.error(err);
        showAlert('❌ Failed to share the Reel.');
      }
    },
    [user, showAlert, dispatch]
  );

  const observer = useRef();
  const lastReelRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          dispatch(setReduxPage(nextPage));
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, dispatch]
  );

  return useMemo(
    () => ({
      reels,
      fetchReels,
      uploadReel,
      deleteReel,
      likeReel,
      viewReel,
      isLoading,
      hasMore,
      lastReelRef,
      shareReel,
      showModelAddReel,
      setShowModelAddReel,
    }),
    [
      reels,
      fetchReels,
      uploadReel,
      deleteReel,
      likeReel,
      viewReel,
      isLoading,
      hasMore,
      lastReelRef,
      shareReel,
      showModelAddReel,
      setShowModelAddReel,
    ]
  );
};

export default useReels;
