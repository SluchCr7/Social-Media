'use client';

import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectHighlightsOpenModal,
  selectSelectedHighlightId,
} from '../features/highlights/highlightsSelectors';
import {
  useAddStoryToHighlightMutation,
  useCreateHighlightMutation,
  useDeleteHighlightMutation,
  useGetHighlightByIdQuery,
  useGetUserHighlightsQuery,
  useLazyGetUserHighlightsQuery,
  useRemoveStoryFromHighlightMutation,
  useReorderHighlightsMutation,
  useReorderStoriesInHighlightMutation,
  useUpdateHighlightMutation,
} from '../features/highlights/highlightsApi';
import {
  setOpenModal as setReduxOpenModal,
  setSelectedHighlight as setReduxSelectedHighlight,
} from '../features/highlights/highlightsSlice';

const errorMessage = (error, fallback) => error?.data?.message || error?.message || fallback;

export const useHighlights = (targetUserId) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showAlert } = useFeedback();
  const userId = targetUserId || user?._id;
  const selectedHighlightId = useAppSelector(selectSelectedHighlightId);
  const openModal = useAppSelector(selectHighlightsOpenModal);
  const highlightsQuery = useGetUserHighlightsQuery(
    { userId },
    { skip: !userId }
  );
  const { currentData: currentHighlights, isFetching: isFetchingHighlights, error: highlightsError, refetch } = highlightsQuery;
  const selectedHighlightQuery = useGetHighlightByIdQuery(selectedHighlightId, {
    skip: !selectedHighlightId,
  });
  const [loadHighlights] = useLazyGetUserHighlightsQuery();
  const [createRequest, createState] = useCreateHighlightMutation();
  const [deleteRequest] = useDeleteHighlightMutation();
  const [addStoryRequest] = useAddStoryToHighlightMutation();
  const [updateRequest, updateState] = useUpdateHighlightMutation();
  const [removeStoryRequest] = useRemoveStoryFromHighlightMutation();
  const [reorderStoriesRequest] = useReorderStoriesInHighlightMutation();
  const [reorderRequest] = useReorderHighlightsMutation();

  const setOpenModal = useCallback(
    (value) => dispatch(setReduxOpenModal(value)),
    [dispatch]
  );
  const setSelectedHighlight = useCallback(
    (highlight) => dispatch(setReduxSelectedHighlight(highlight)),
    [dispatch]
  );
  const fetchHighlights = useCallback(async (requestedUserId) => {
    if (requestedUserId && String(requestedUserId) !== String(userId)) {
      return loadHighlights({ userId: requestedUserId }).unwrap();
    }
    if (!userId) return [];
    return refetch().unwrap();
  }, [loadHighlights, refetch, userId]);

  const createHighlight = useCallback(async ({ title, cover, storyIds }) => {
    if (!user?._id) {
      showAlert('You must be logged in first.');
      return null;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('storyIds', JSON.stringify(storyIds || []));
    if (cover) formData.append('image', cover);
    try {
      const highlight = await createRequest(formData).unwrap();
      showAlert('✅ Highlight created successfully!');
      return highlight;
    } catch (error) {
      const message = errorMessage(error, 'Failed to create highlight.');
      showAlert(message);
      throw error;
    }
  }, [createRequest, showAlert, user?._id]);

  const deleteHighlight = useCallback(async (id) => {
    if (!user?._id) {
      showAlert('You must be logged in.');
      return;
    }
    try {
      await deleteRequest(id).unwrap();
      showAlert('🗑️ Highlight deleted successfully.');
    } catch (error) {
      showAlert(errorMessage(error, 'Failed to delete highlight.'));
    }
  }, [deleteRequest, showAlert, user?._id]);

  const addStoryToHighlight = useCallback(async (highlightId, storyIdOrIds) => {
    if (!user?._id) {
      showAlert('You must be logged in.');
      return;
    }
    const payload = Array.isArray(storyIdOrIds)
      ? { storyIds: storyIdOrIds }
      : { storyId: storyIdOrIds };
    try {
      const data = await addStoryRequest({ id: highlightId, payload }).unwrap();
      const updated = data?.highlight;
      if (updated) {
        showAlert(Array.isArray(storyIdOrIds)
          ? '📌 Stories added to highlight.'
          : '📌 Story added to highlight.');
      }
      return updated;
    } catch (error) {
      const message = errorMessage(error, 'Failed to add story.');
      showAlert(`❌ ${message}`);
      throw error;
    }
  }, [addStoryRequest, showAlert, user?._id]);

  const updateHighlight = useCallback(async (id, updates) => {
    if (!user?._id) {
      showAlert('You must be logged in.');
      return;
    }
    const formData = new FormData();
    if (updates.title) formData.append('title', updates.title);
    if (updates.description !== undefined) formData.append('description', updates.description);
    if (updates.isPublic !== undefined) formData.append('isPublic', updates.isPublic);
    if (updates.image) formData.append('image', updates.image);
    try {
      const updated = await updateRequest({ id, formData }).unwrap();
      showAlert('✏️ Highlight updated successfully.');
      return updated;
    } catch (error) {
      showAlert(`❌ ${errorMessage(error, 'Could not update highlight.')}`);
      return null;
    }
  }, [showAlert, updateRequest, user?._id]);

  const removeStoryFromHighlight = useCallback(async (highlightId, storyId) => {
    if (!user?._id) {
      showAlert('You must be logged in.');
      return;
    }
    try {
      const data = await removeStoryRequest({ highlightId, storyId }).unwrap();
      if (data?.highlight) showAlert('🗑️ Story removed from highlight.');
      return data?.highlight;
    } catch (error) {
      const message = errorMessage(error, 'Failed to remove story.');
      showAlert(`❌ ${message}`);
      throw error;
    }
  }, [removeStoryRequest, showAlert, user?._id]);

  const reorderStoriesInHighlight = useCallback(async (highlightId, storyIds) => {
    if (!user?._id) return;
    try {
      const data = await reorderStoriesRequest({ highlightId, storyIds }).unwrap();
      showAlert('✅ Order saved.');
      return data?.highlight;
    } catch (error) {
      showAlert(`❌ ${errorMessage(error, 'Failed to reorder stories.')}`);
      throw error;
    }
  }, [reorderStoriesRequest, showAlert, user?._id]);

  const reorderHighlights = useCallback(async (highlightIds) => {
    if (!user?._id) return;
    try {
      await reorderRequest(highlightIds).unwrap();
      showAlert('✅ Highlights reordered.');
    } catch (error) {
      showAlert(`❌ ${errorMessage(error, 'Failed to reorder highlights.')}`);
      throw error;
    }
  }, [reorderRequest, showAlert, user?._id]);

  return useMemo(() => ({
    highlights: currentHighlights || [],
    loading: isFetchingHighlights || createState.isLoading || updateState.isLoading,
    error: highlightsError?.data?.message || null,
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
    selectedHighlight: selectedHighlightQuery.currentData || null,
    setSelectedHighlight,
  }), [
    currentHighlights,
    isFetchingHighlights,
    highlightsError,
    createState.isLoading,
    updateState.isLoading,
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
    selectedHighlightQuery.currentData,
    setSelectedHighlight,
  ]);
};

export default useHighlights;
