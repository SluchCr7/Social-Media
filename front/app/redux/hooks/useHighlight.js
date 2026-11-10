'use client';

import { useCallback, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/backendUrl';
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

  const setOpenModal = useCallback(
    (open) => {
      dispatch(setReduxOpenModal(open));
    },
    [dispatch]
  );

  const setSelectedHighlight = useCallback(
    (h) => {
      dispatch(setReduxSelectedHighlight(h));
    },
    [dispatch]
  );

  const setHighlights = useCallback(
    (list) => {
      dispatch(setReduxHighlights(list));
    },
    [dispatch]
  );

  const fetchHighlights = useCallback(
    async (targetUserId) => {
      const userIdToFetch = targetUserId || user?._id;
      if (!userIdToFetch) return;
      dispatch(setReduxLoading(true));
      try {
        const res = await axios.get(
          `${API_BASE_URL}/highlight/user/${userIdToFetch}`,
          {
            headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
          }
        );
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
    [user, dispatch]
  );

  const createHighlight = useCallback(
    async ({ title, cover, storyIds }) => {
      if (!user?.token) return showAlert('You must be logged in first.');

      dispatch(setReduxLoading(true));
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('storyIds', JSON.stringify(storyIds || []));
        if (cover) formData.append('image', cover);

        const res = await axios.post(`${API_BASE_URL}/highlight`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

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
    [user, showAlert, dispatch]
  );

  const deleteHighlight = useCallback(
    async (id) => {
      if (!user?.token) return showAlert('You must be logged in.');

      try {
        await axios.delete(`${API_BASE_URL}/highlight/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        dispatch(removeHighlightFromState(id));
        showAlert('🗑️ Highlight deleted successfully.');
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete highlight.';
        dispatch(setReduxError(message));
        showAlert(message);
      }
    },
    [user, showAlert, dispatch]
  );

  const addStoryToHighlight = useCallback(
    async (highlightId, storyIdOrIds) => {
      if (!user?.token) return showAlert('You must be logged in.');

      try {
        const payload = Array.isArray(storyIdOrIds) ? { storyIds: storyIdOrIds } : { storyId: storyIdOrIds };

        const res = await axios.patch(
          `${API_BASE_URL}/highlight/${highlightId}/stories`,
          payload,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

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
    [user, showAlert, dispatch]
  );

  const updateHighlight = useCallback(
    async (id, updates) => {
      if (!user?.token) return showAlert('You must be logged in.');

      dispatch(setReduxLoading(true));
      try {
        const formData = new FormData();
        if (updates.title) formData.append('title', updates.title);
        if (updates.description !== undefined) formData.append('description', updates.description);
        if (updates.isPublic !== undefined) formData.append('isPublic', updates.isPublic);
        if (updates.image) formData.append('image', updates.image);

        const res = await axios.patch(`${API_BASE_URL}/highlight/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

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
    [user, showAlert, dispatch]
  );

  const removeStoryFromHighlight = useCallback(
    async (highlightId, storyId) => {
      if (!user?.token) return showAlert('You must be logged in.');

      try {
        const res = await axios.delete(
          `${API_BASE_URL}/highlight/${highlightId}/stories/${storyId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

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
    [user, showAlert, dispatch]
  );

  const reorderStoriesInHighlight = useCallback(
    async (highlightId, storyIds) => {
      if (!user?.token) return;
      try {
        const res = await axios.patch(
          `${API_BASE_URL}/highlight/${highlightId}/reorder-stories`,
          { storyIds },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        const updated = res.data?.highlight;
        if (updated) {
          dispatch(updateHighlightInState(updated));
        }
        showAlert('✅ Order saved.');
      } catch (err) {
        showAlert('❌ Failed to reorder stories.');
      }
    },
    [user, showAlert, dispatch]
  );

  const reorderHighlights = useCallback(
    async (highlightIds) => {
      if (!user?.token) return;
      try {
        await axios.post(
          `${API_BASE_URL}/highlight/reorder`,
          { highlightIds },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        showAlert('✅ Highlights reordered.');
      } catch (err) {
        showAlert('❌ Failed to reorder highlights.');
      }
    },
    [user, showAlert]
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
      reorderHighlights,
      reorderStoriesInHighlight,
      openModal,
      setOpenModal,
      selectedHighlight,
      setSelectedHighlight,
      setHighlights,
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
      reorderHighlights,
      reorderStoriesInHighlight,
      openModal,
      setOpenModal,
      selectedHighlight,
      setSelectedHighlight,
      setHighlights,
    ]
  );
};

export default useHighlights;
