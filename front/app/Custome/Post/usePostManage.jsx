'use client';

import { useCallback } from "react";
import api from "@/app/utils/api";
import { useFeedback } from "@/app/Context/FeedbackContext";
import { MESSAGES } from "@/app/utils/messages";

export const usePostManagement = ({ user, setPosts, setUserPosts, setIsLoadingPostCreated, setIsLoading }) => {
  const { showToast } = useFeedback();

  /**
   * Add a new post
   */
  const AddPost = useCallback(async (
    content,
    mediaFiles = [],
    Hashtags = [],
    communityId = null,
    mentions = [],
    scheduledAt = null,
    links = [],
    privacy = "public",
    music = null
  ) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

    const formData = new FormData();
    formData.append("text", content);
    mediaFiles.forEach(item => formData.append("media", item.file));
    Hashtags.forEach(tag => formData.append("Hashtags", tag));
    if (communityId) formData.append("community", communityId);
    if (mentions.length > 0) formData.append("mentions", JSON.stringify(mentions));
    if (scheduledAt) formData.append("scheduledAt", scheduledAt);
    if (privacy) formData.append("privacy", privacy);
    if (links.length > 0) formData.append("links", JSON.stringify(links));
    if (music) formData.append("music", music);

    const optimisticId = `temp-${Date.now()}`;
    let optimisticPost = null;

    // Create Optimistic Post
    if (!scheduledAt) {
      optimisticPost = {
        _id: optimisticId,
        text: content,
        media: mediaFiles.map(item => ({
          url: URL.createObjectURL(item.file),
          type: item.type || (item.file.type.startsWith('video') ? 'video' : 'image'),
          // dummy properties to prevent crash
          publicId: `temp-media-${Date.now()}`,
        })),
        owner: user,
        createdAt: new Date().toISOString(),
        likes: [],
        hahas: [],
        comments: [],
        saved: [],
        views: [],
        Hashtags,
        mentions,
        isOptimistic: true, // Marker for UI if we want to show spinner
        status: "published",
        community: communityId,
        links,
        music,
        privacy,
        userLevelPoints: 0 // dummy
      };

      // Add to state immediately
      const updater = prev => [optimisticPost, ...(prev || [])];
      setPosts(updater);
      if (setUserPosts) setUserPosts(updater);
    }

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

        // Replace optimistic post with real post
        const replacer = (prev) => (prev || []).map(p => p._id === optimisticId ? newPost : p);
        const adder = (prev) => [newPost, ...(prev || [])]; // Fallback if optimistic ID not found (unlikely)

        // Check if optimistic post is in list (it should be)
        setPosts(prev => {
          const exists = prev.some(p => p._id === optimisticId);
          return exists ? prev.map(p => p._id === optimisticId ? newPost : p) : [newPost, ...prev];
        });

        if (setUserPosts) {
          setUserPosts(prev => {
            const exists = prev.some(p => p._id === optimisticId);
            return exists ? prev.map(p => p._id === optimisticId ? newPost : p) : [newPost, ...prev];
          });
        }
      }
      return newPost;
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || MESSAGES.POST.CREATE_ERROR, 'error', { id: loadingToast });

      // Revert optimistic add
      if (optimisticPost) {
        const reverter = prev => prev.filter(p => p._id !== optimisticId);
        setPosts(reverter);
        if (setUserPosts) setUserPosts(reverter);
      }
    } finally {
      setIsLoadingPostCreated(false);
    }
  }, [user, setIsLoadingPostCreated, setPosts, setUserPosts, showToast]);

  /**
   * Edit an existing post
   */
  const editPost = useCallback(async (
    id,
    { text, community, Hashtags, existingMedia, newMedia, mentions = [], links = [], music = null }
  ) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
    setIsLoading(true);
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');

    // Optimistic Update for Edit
    const previousPosts = []; // We can't easily capture previous state here without ref, so we rely on re-fetching or just assume success. 
    // Actually we can do optimistic update
    const optimisticUpdater = (prev) => (prev || []).map(p => {
      if (p._id === id) {
        // Apply changes shallowly for immediate feedback
        return {
          ...p,
          text: text !== undefined ? text : p.text,
          Hashtags: Hashtags || p.Hashtags,
          links: links || p.links,
          music: music || p.music,
          // Media is hard to optimistically update mixed with existing, but we can try if needed
          // For now, text updates are critical to show instantly
        };
      }
      return p;
    });
    setPosts(optimisticUpdater);
    if (setUserPosts) setUserPosts(optimisticUpdater);


    try {
      const formData = new FormData();
      formData.append('text', text);
      if (community) formData.append('community', community);
      if (Hashtags?.length > 0) formData.append('Hashtags', JSON.stringify(Hashtags));

      formData.append('existingMedia', JSON.stringify(existingMedia || []));

      if (mentions.length > 0) formData.append('mentions', JSON.stringify(mentions));

      if (newMedia?.length > 0) {
        newMedia.forEach(item => formData.append('newMedia', item.file || item));
      }

      if (links?.length > 0) formData.append('links', JSON.stringify(links));
      if (music) formData.append('music', music);

      const res = await api.put(`/post/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const updatedPost = res.data?.post || res.data;
      showToast(MESSAGES.POST.UPDATE_SUCCESS, 'success', { id: loadingToast });

      const updater = (prev) => (prev || []).map(p => p._id === id ? updatedPost : p);
      setPosts(updater);
      if (setUserPosts) {
        setUserPosts(updater);
      }
      return updatedPost;
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to update your post.", 'error', { id: loadingToast });
      // Revert logic is complex, user might just see old data on refresh
    } finally {
      setIsLoading(false);
    }
  }, [user, setIsLoading, setPosts, setUserPosts, showToast]);

  return { AddPost, editPost };
};
