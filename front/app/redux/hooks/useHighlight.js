'use client';

import { useCallback, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectHighlights,
  selectHighlightsLoading,
  selectHighlightsError,
  selectHighlightsOpenModal,
  selectSelectedHighlight,
} from '../features/highlights/highlightsSelectors';
import {
  setHighlights as setReduxHighlights,
  addHighlightToState,
  updateHighlightInState,
  removeHighlightFromState,
  setLoading as setReduxLoading,
  setError as setReduxError,
  setOpenModal as setReduxOpenModal,
  setSelectedHighlight as setReduxSelectedHighlight,
} from '../features/highlights/highlightsSlice';

export const useHighlights = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showAlert } = useFeedback();

  const highlights = useAppSelector(selectHighlights);
  const loading = useAppSelector(selectHighlightsLoading);
  const error = useAppSelector(selectHighlightsError);
  const openModal = useAppSelector(selectHighlightsOpenModal);
  const selectedHighlight = useAppSelector(selectSelectedHighlight);

  const setHighlights = useCallback(
    (data) => dispatch(setReduxHighlights(data)),
    [dispatch]
  );
  const setLoading = useCallback(
    (val) => dispatch(setReduxLoading(val)),
    [dispatch]
  );
  const setError = useCallback(
    (err) => dispatch(setReduxError(err)),
    [dispatch]
  );
  const setOpenModal = useCallback(
    (val) => dispatch(setReduxOpenModal(val)),
    [dispatch]
  );
  const setSelectedHighlight = useCallback(
    (hl) => dispatch(setReduxSelectedHighlight(hl)),
    [dispatch]
  );

  const fetchHighlights = useCallback(
    async (targetUserId) => {
      const userIdToFetch = targetUserId || user?._id;
      if (!userIdToFetch) return;
      dispatch(setReduxLoading(true));
      try {
        const res = await api.get(`/highlight/user/${userIdToFetch}`);
        const sorted = (res.data || []).sort((a, b) => (a.order || 0) - (b.order || 0));
        dispatch(setReduxHighlights(sorted));
        dispatch(setReduxError(null));
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load highlights.';
        dispatch(setReduxError(message));
      } finally {
        dispatch(setReduxLoading(false));
      }
    },
    [user?._id, dispatch]
  );

  const createHighlight = useCallback(
    async ({ title, cover, storyIds }) => {
      if (!user?._id) return showAlert('You must be logged in first.');

      dispatch(setReduxLoading(true));
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('storyIds', JSON.stringify(storyIds || []));
        if (cover) formData.append('image', cover);

        const res = await api.post('/highlight', formData);

        const newHighlight = res.data;
        dispatch(addHighlightToState(newHighlight));
        showAlert('✅ Highlight created successfully!');
        return newHighlight;
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to create highlight.';
        dispatch(setReduxError(message));
        showAlert(message);
        throw err;
      } finally {
        dispatch(setReduxLoading(false));
      }
    },
    [user?._id, showAlert, dispatch]
  );

  const deleteHighlight = useCallback(
    async (id) => {
      if (!user?._id) return showAlert('You must be logged in.');

      try {
        await api.delete(`/highlight/${id}`);
        dispatch(removeHighlightFromState(id));
        showAlert('🗑️ Highlight deleted successfully.');
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete highlight.';
        dispatch(setReduxError(message));
        showAlert(message);
      }
    },
    [user?._id, showAlert, dispatch]
  );

  const addStoryToHighlight = useCallback(
    async (highlightId, storyIdOrIds) => {
      if (!user?._id) return showAlert('You must be logged in.');

      try {
        const payload = Array.isArray(storyIdOrIds) ? { storyIds: storyIdOrIds } : { storyId: storyIdOrIds };
        const res = await api.patch(`/highlight/${highlightId}/stories`, payload);

        const updated = res.data?.highlight;
        if (updated) {
          dispatch(updateHighlightInState(updated));
          showAlert(Array.isArray(storyIdOrIds) ? '📌 Stories added to highlight.' : '📌 Story added to highlight.');
        }
        return updated;
      } catch (err) {
        console.error('Error adding story to highlight:', err);
        const message = err.response?.data?.message || 'Failed to add story.';
        showAlert(`❌ ${message}`);
        throw err;
      }
    },
    [user?._id, showAlert, dispatch]
  );

  const updateHighlight = useCallback(
    async (id, updates) => {
      if (!user?._id) return showAlert('You must be logged in.');

      dispatch(setReduxLoading(true));
      try {
        const formData = new FormData();
        if (updates.title) formData.append('title', updates.title);
        if (updates.description !== undefined) formData.append('description', updates.description);
        if (updates.isPublic !== undefined) formData.append('isPublic', updates.isPublic);
        if (updates.image) formData.append('image', updates.image);

        const res = await api.patch(`/highlight/${id}`, formData);

        const updated = res.data;
        dispatch(updateHighlightInState(updated));
        showAlert('✏️ Highlight updated successfully.');
        return updated;
      } catch (err) {
        console.error('Failed to update highlight:', err);
        showAlert('❌ Could not update highlight.');
      } finally {
        dispatch(setReduxLoading(false));
      }
    },
    [user?._id, showAlert, dispatch]
  );

  const removeStoryFromHighlight = useCallback(
    async (highlightId, storyId) => {
      if (!user?._id) return showAlert('You must be logged in.');

      try {
        const res = await api.delete(`/highlight/${highlightId}/stories/${storyId}`);

        const updated = res.data?.highlight;
        if (updated) {
          dispatch(updateHighlightInState(updated));
          showAlert('🗑️ Story removed from highlight.');
        }
        return updated;
      } catch (err) {
        console.error('Error removing story from highlight:', err);
        const message = err.response?.data?.message || 'Failed to remove story.';
        showAlert(`❌ ${message}`);
        throw err;
      }
    },
    [user?._id, showAlert, dispatch]
  );

  const reorderStoriesInHighlight = useCallback(
    async (highlightId, storyIds) => {
      if (!user?._id) return;
      try {
        const res = await api.patch(`/highlight/${highlightId}/reorder-stories`, { storyIds });

        const updated = res.data?.highlight;
        if (updated) {
          dispatch(updateHighlightInState(updated));
        }
        showAlert('✅ Order saved.');
      } catch (err) {
        showAlert('❌ Failed to reorder stories.');
      }
    },
    [user?._id, showAlert, dispatch]
  );

  const reorderHighlights = useCallback(
    async (highlightIds) => {
      if (!user?._id) return;
      try {
        await api.post('/highlight/reorder', { highlightIds });
        showAlert('✅ Highlights reordered.');
      } catch (err) {
        showAlert('❌ Failed to reorder highlights.');
      }
    },
    [user?._id, showAlert]
  );

  return useMemo(
    () => ({
      highlights,
      loading,
      error,
      fetchHighlights,
      createHighlight,
      deleteHighlight,
      addStoryToHighlight,
      updateHighlight,
      removeStoryFromHighlight,
      reorderStoriesInHighlight,
      reorderHighlights,
      openModal,
      setOpenModal,
      selectedHighlight,
      setSelectedHighlight,
      setHighlights,
      setLoading,
      setError,
    }),
    [
      highlights,
      loading,
      error,
      fetchHighlights,
      createHighlight,
      deleteHighlight,
      addStoryToHighlight,
      updateHighlight,
      removeStoryFromHighlight,
      reorderStoriesInHighlight,
      reorderHighlights,
      openModal,
      setOpenModal,
      selectedHighlight,
      setSelectedHighlight,
      setHighlights,
      setLoading,
      setError,
    ]
  );
};

export default useHighlights;
