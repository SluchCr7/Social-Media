'use client';

import { useEffect, useCallback, useMemo } from 'react';
import api from '../../utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectStories,
  selectStoriesLoading,
  selectIsStoryModalOpen,
} from '../features/stories/storiesSelectors';
import {
  setStories as setReduxStories,
  addStoryToState,
  updateStoryInState,
  removeStoryFromState,
  setIsLoading,
  setIsStory as setReduxIsStory,
  optimisticLoveStory,
  optimisticReactStory,
} from '../features/stories/storiesSlice';

let storiesFetchGeneration = 0;

export const useStory = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showAlert } = useFeedback();

  const stories = useAppSelector(selectStories);
  const isLoading = useAppSelector(selectStoriesLoading);
  const isStory = useAppSelector(selectIsStoryModalOpen);

  const setIsStory = useCallback(
    (val) => {
      dispatch(setReduxIsStory(val));
    },
    [dispatch]
  );

  const fetchStories = useCallback(async () => {
    const fetchGeneration = ++storiesFetchGeneration;
    dispatch(setIsLoading(true));
    try {
      const { data } = await api.get('/story');
      if (fetchGeneration === storiesFetchGeneration) {
        dispatch(setReduxStories(Array.isArray(data) ? data : []));
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const addNewStory = useCallback(
    async (storyData) => {
      const formData = new FormData();
      if (storyData.text) formData.append('text', storyData.text);
      if (storyData.file) formData.append('image', storyData.file);

      if (!storyData.text && !storyData.file) {
        showAlert('You must provide either text or an image.');
        return;
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

      storiesFetchGeneration += 1;
      dispatch(addStoryToState(tempStory));
      dispatch(setReduxIsStory(false));
      showAlert('Posting story...', 'loading');

      try {
        const res = await api.post('/story/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const newStory = res.data?.story || res.data;
        storiesFetchGeneration += 1;
        dispatch(removeStoryFromState(tempId));
        dispatch(addStoryToState(newStory));
        showAlert('✅ Story published successfully.', 'success');
        return newStory;
      } catch (err) {
        console.error(err);
        dispatch(removeStoryFromState(tempId));
        showAlert('❌ Failed to add story.', 'error');
        return null;
      }
    },
    [user, showAlert, dispatch]
  );

  const deleteStory = useCallback(
    async (storyId) => {
      try {
        await api.delete(`/story/delete/${storyId}`);
        dispatch(removeStoryFromState(storyId));
        showAlert('Story deleted successfully.');
      } catch (err) {
        showAlert('Failed to delete story.');
      }
    },
    [showAlert, dispatch]
  );

  const viewStory = useCallback(
    async (storyId) => {
      if (!user) return;
      try {
        const { data } = await api.post(`/story/view/${storyId}`, {});
        const updatedStory = data?.story || data;
        dispatch(updateStoryInState(updatedStory));
      } catch (err) {
        console.error('View story error:', err);
      }
    },
    [user, dispatch]
  );

  const toggleLove = useCallback(
    async (storyId) => {
      if (!user) return;

      dispatch(optimisticLoveStory({ storyId, userId: user._id }));

      try {
        const { data } = await api.post(`/story/love/${storyId}`, {});
        dispatch(updateStoryInState(data));
      } catch (err) {
        console.error(err);
        showAlert('❌ Failed to toggle love.');
      }
    },
    [user, showAlert, dispatch]
  );

  const reactToStory = useCallback(
    async (storyId, emoji) => {
      if (!user) return;

      dispatch(optimisticReactStory({ storyId, userId: user._id, emoji }));

      try {
        const { data } = await api.post(`/story/react/${storyId}`, { emoji });
        dispatch(updateStoryInState(data));
      } catch (err) {
        console.error(err);
        showAlert('❌ Failed to react.');
      }
    },
    [user, showAlert, dispatch]
  );

  const getStoryViewers = useCallback(
    async (storyId) => {
      if (!user) return [];
      try {
        const { data } = await api.get(`/story/viewers/${storyId}`);
        return data;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    [user]
  );

  const shareStory = useCallback(
    async (id) => {
      if (!user) return showAlert('You must be logged in.');
      try {
        const res = await api.post(`/story/share/${id}`, {});
        dispatch(addStoryToState(res.data));
        showAlert('✅ Story shared successfully!');
      } catch (err) {
        showAlert('❌ Failed to share story.');
      }
    },
    [user, showAlert, dispatch]
  );

  const getUserStories = useCallback(
    async (userId) => {
      if (!userId) return [];
      try {
        const { data } = await api.get(`/story/user/${userId}`);
        return data;
      } catch (err) {
        return [];
      }
    },
    []
  );

  const getArchivedStories = useCallback(
    async (userId) => {
      if (!userId) return [];
      try {
        const { data } = await api.get(`/story/user/${userId}/archive`);
        return data;
      } catch (err) {
        console.error('Error fetching archived stories:', err);
        return [];
      }
    },
    []
  );

  return useMemo(
    () => ({
      stories,
      isLoading,
      isStory,
      setIsStory,
      addNewStory,
      deleteStory,
      viewStory,
      toggleLove,
      reactToStory,
      getStoryViewers,
      getUserStories,
      getArchivedStories,
      shareStory,
    }),
    [
      stories,
      isLoading,
      isStory,
      setIsStory,
      addNewStory,
      deleteStory,
      viewStory,
      toggleLove,
      reactToStory,
      getStoryViewers,
      getUserStories,
      getArchivedStories,
      shareStory,
    ]
  );
};

export default useStory;
