'use client';

import { useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/backendUrl';
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
    dispatch(setIsLoading(true));
    try {
      const res = await axios.get(`${API_BASE_URL}/story`);
      dispatch(setReduxStories(Array.isArray(res.data) ? res.data : []));
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

      dispatch(addStoryToState(tempStory));
      dispatch(setReduxIsStory(false));
      showAlert('Posting story...', 'loading');

      try {
        const res = await axios.post(`${API_BASE_URL}/story/add`, formData, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        const newStory = res.data?.story || res.data;
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
        await axios.delete(`${API_BASE_URL}/story/delete/${storyId}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        dispatch(removeStoryFromState(storyId));
        showAlert('Story deleted successfully.');
      } catch (err) {
        showAlert('Failed to delete story.');
      }
    },
    [user, showAlert, dispatch]
  );

  const viewStory = useCallback(
    async (storyId) => {
      if (!user) return;
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/story/view/${storyId}`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
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
        const { data } = await axios.post(
          `${API_BASE_URL}/story/love/${storyId}`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
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
        const { data } = await axios.post(
          `${API_BASE_URL}/story/react/${storyId}`,
          { emoji },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
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
        const { data } = await axios.get(
          `${API_BASE_URL}/story/viewers/${storyId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
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
      if (!user?.token) return showAlert('You must be logged in.');
      try {
        const res = await axios.post(
          `${API_BASE_URL}/story/share/${id}`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
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
        const { data } = await axios.get(
          `${API_BASE_URL}/story/user/${userId}`,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        return data;
      } catch (err) {
        return [];
      }
    },
    [user]
  );

  const getArchivedStories = useCallback(
    async (userId) => {
      if (!userId) return [];
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/story/user/${userId}/archive`,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        return data;
      } catch (err) {
        console.error('Error fetching archived stories:', err);
        return [];
      }
    },
    [user?.token]
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
