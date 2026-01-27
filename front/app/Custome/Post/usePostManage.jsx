'use client';

import { useCallback } from "react";
import api from "@/app/utils/api";
import { useFeedback } from "@/app/Context/FeedbackContext";
import { MESSAGES } from "@/app/utils/messages";

export const usePostManagement = ({ user, setPosts, setIsLoadingPostCreated, setIsLoading }) => {
  const { showToast } = useFeedback();

  /**
   * Add a new post
   */
  const AddPost = useCallback(async (
    content,
    images = [],
    Hashtags = [],
    communityId = null,
    mentions = [],
    scheduledAt = null,
    links = [],
    privacy = "public"
  ) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

    const formData = new FormData();
    formData.append("text", content);
    images.forEach(img => formData.append("image", img.file));
    Hashtags.forEach(tag => formData.append("Hashtags", tag));
    if (communityId) formData.append("community", communityId);
    if (mentions.length > 0) formData.append("mentions", JSON.stringify(mentions));
    if (scheduledAt) formData.append("scheduledAt", scheduledAt);
    if (privacy) formData.append("privacy", privacy);
    if (links.length > 0) formData.append("links", JSON.stringify(links));

    setIsLoadingPostCreated(true);
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

    try {
      const res = await api.post('/post/add', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const newPost = res.data?.post || res.data;

      if (scheduledAt) {
        showToast("Great! Your post has been scheduled.", 'success', { id: loadingToast });
      } else {
        showToast(MESSAGES.POST.CREATE_SUCCESS, 'success', { id: loadingToast });
        setPosts(prev => [newPost, ...prev]);
      }
      return newPost;
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || MESSAGES.POST.CREATE_ERROR, 'error', { id: loadingToast });
    } finally {
      setIsLoadingPostCreated(false);
    }
  }, [user, setIsLoadingPostCreated, setPosts, showToast]);

  /**
   * Edit an existing post
   */
  const editPost = useCallback(async (
    id,
    { text, community, Hashtags, existingPhotos, newPhotos, mentions = [], links = [] }
  ) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
    setIsLoading(true);
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

    try {
      const formData = new FormData();
      formData.append('text', text);
      if (community) formData.append('community', community);
      if (Hashtags?.length > 0) formData.append('Hashtags', JSON.stringify(Hashtags));
      formData.append('existingPhotos', JSON.stringify(existingPhotos || []));
      if (mentions.length > 0) formData.append('mentions', JSON.stringify(mentions));
      if (newPhotos?.length > 0) {
        newPhotos.forEach(photo => formData.append('newPhotos', photo));
      }
      if (links?.length > 0) formData.append('links', JSON.stringify(links));

      const res = await api.put(`/post/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const updatedPost = res.data?.post || res.data;
      showToast(MESSAGES.POST.UPDATE_SUCCESS, 'success', { id: loadingToast });

      setPosts(prev => prev.map(p => p._id === id ? updatedPost : p));
      return updatedPost;
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to update your post.", 'error', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  }, [user, setIsLoading, setPosts, showToast]);

  return { AddPost, editPost };
};
