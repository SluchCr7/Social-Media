'use client';

import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import { baseApi } from '../api/baseApi';
import { selectIsStoryModalOpen } from '../features/stories/storiesSelectors';
import { setIsStory as setReduxIsStory } from '../features/stories/storiesSlice';
import {
  useAddStoryMutation,
  useDeleteStoryMutation,
  useGetStoriesQuery,
  useReactToStoryMutation,
  useShareStoryMutation,
  useToggleLoveStoryMutation,
  useViewStoryMutation,
} from '../features/stories/storiesApi';

const patchStoryLists = (dispatch, getState, userId, update) => {
  const entries = baseApi.util.selectInvalidatedBy(getState(), [{ type: 'Story', id: 'LIST' }]);
  return entries
    .filter(({ endpointName, originalArgs }) =>
      endpointName !== 'getArchivedStories' &&
      (endpointName !== 'getUserStories' || String(originalArgs?.userId) === String(userId))
    )
    .map(({ endpointName, originalArgs }) =>
    dispatch(baseApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
      if (Array.isArray(draft)) update(draft);
    }))
  );
};

const getErrorMessage = (error) =>
  error?.data?.message || error?.response?.data?.message || error?.message;

export const useStory = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { user } = useAuth();
  const { showAlert } = useFeedback();
  const isStory = useAppSelector(selectIsStoryModalOpen);
  const storiesQuery = useGetStoriesQuery({ viewerId: user?._id || 'anonymous' });
  const { currentData, isLoading, refetch } = storiesQuery;
  const [addStoryRequest] = useAddStoryMutation();
  const [deleteStoryRequest] = useDeleteStoryMutation();
  const [viewStoryRequest] = useViewStoryMutation();
  const [toggleLoveRequest] = useToggleLoveStoryMutation();
  const [reactToStoryRequest] = useReactToStoryMutation();
  const [shareStoryRequest] = useShareStoryMutation();

  const setIsStory = useCallback(
    (value) => dispatch(setReduxIsStory(value)),
    [dispatch]
  );
  const fetchStories = useCallback(
    () => refetch().unwrap(),
    [refetch]
  );

  const addNewStory = useCallback(async (storyData) => {
    const formData = new FormData();
    if (storyData.text) formData.append('text', storyData.text);
    if (storyData.file) formData.append('image', storyData.file);
    if (!storyData.text && !storyData.file) {
      showAlert('You must provide either text or an image.');
      return null;
    }
    if (storyData.collaborators) formData.append('collaborators', JSON.stringify(storyData.collaborators));
    if (storyData.mentions) formData.append('mentions', JSON.stringify(storyData.mentions));
    if (storyData.music) formData.append('music', JSON.stringify(storyData.music));
    if (storyData.link) formData.append('link', JSON.stringify(storyData.link));
    if (storyData.isCloseFriends !== undefined) formData.append('isCloseFriends', storyData.isCloseFriends);

    const tempId = `temp-${Date.now()}`;
    const tempStory = {
      _id: tempId,
      text: storyData.text || '',
      Photo: storyData.file ? [URL.createObjectURL(storyData.file)] : [],
      owner: user,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      loves: [],
      views: [],
      reactions: [],
      isOptimistic: true,
    };
    const previewUrl = tempStory.Photo[0];
    const patches = patchStoryLists(dispatch, () => store.getState(), user?._id, (list) => list.unshift(tempStory));
    setIsStory(false);
    showAlert('Posting story...', 'loading');

    try {
      const data = await addStoryRequest(formData).unwrap();
      const newStory = data?.story || data;
      patchStoryLists(dispatch, () => store.getState(), user?._id, (list) => {
        const index = list.findIndex((story) => story._id === tempId);
        if (index !== -1) list[index] = newStory;
        else list.unshift(newStory);
      });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      showAlert('✅ Story published successfully.', 'success');
      return newStory;
    } catch (error) {
      patches.forEach((patch) => patch.undo());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      console.error(error);
      showAlert(getErrorMessage(error) || '❌ Failed to add story.', 'error');
      return null;
    }
  }, [addStoryRequest, dispatch, setIsStory, showAlert, store, user]);

  const deleteStory = useCallback(async (storyId) => {
    try {
      await deleteStoryRequest(storyId).unwrap();
      showAlert('Story deleted successfully.');
    } catch (error) {
      console.error(error);
      showAlert(getErrorMessage(error) || 'Failed to delete story.', 'error');
    }
  }, [deleteStoryRequest, showAlert]);

  const viewStory = useCallback(async (storyId) => {
    if (!user?._id) return;
    try {
      return await viewStoryRequest(storyId).unwrap();
    } catch (error) {
      console.error('View story error:', error);
    }
  }, [user?._id, viewStoryRequest]);

  const toggleLove = useCallback(async (storyId) => {
    if (!user?._id) return;
    try {
      return await toggleLoveRequest(storyId).unwrap();
    } catch (error) {
      console.error(error);
      showAlert('❌ Failed to toggle love.');
    }
  }, [showAlert, toggleLoveRequest, user?._id]);

  const reactToStory = useCallback(async (storyId, emoji) => {
    if (!user?._id) return;
    try {
      return await reactToStoryRequest({ storyId, emoji }).unwrap();
    } catch (error) {
      console.error(error);
      showAlert('❌ Failed to react.');
    }
  }, [reactToStoryRequest, showAlert, user?._id]);

  const shareStory = useCallback(async (id) => {
    if (!user?._id) {
      showAlert('You must be logged in.');
      return null;
    }
    try {
      const data = await shareStoryRequest(id).unwrap();
      const sharedStory = data?.story || data;
      showAlert('✅ Story shared successfully!');
      return sharedStory;
    } catch (error) {
      showAlert(getErrorMessage(error) || '❌ Failed to share story.');
      return null;
    }
  }, [shareStoryRequest, showAlert, user?._id]);

  return useMemo(() => ({
    stories: currentData || [],
    isLoading,
    isStory,
    setIsStory,
    fetchStories,
    addNewStory,
    deleteStory,
    viewStory,
    toggleLove,
    reactToStory,
    shareStory,
  }), [
    currentData,
    isLoading,
    isStory,
    setIsStory,
    fetchStories,
    addNewStory,
    deleteStory,
    viewStory,
    toggleLove,
    reactToStory,
    shareStory,
  ]);
};

export default useStory;
