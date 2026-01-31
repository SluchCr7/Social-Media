'use client';

import { useCallback } from "react";
import api from "@/app/utils/api";
import { useFeedback } from "@/app/Context/FeedbackContext";
import { MESSAGES } from "@/app/utils/messages";

export const usePostActions = ({ user, setPosts, setUserPosts, setIsLoading }) => {
  const { showToast } = useFeedback();

  const updatePostInState = useCallback((updatedPost) => {
    if (!updatedPost?._id) return;
    const updater = (prev) => (prev || []).map((p) => (p._id === updatedPost._id ? updatedPost : p));
    setPosts(updater);
    if (setUserPosts) {
      setUserPosts(updater);
    }
  }, [setPosts, setUserPosts]);

  const deletePost = useCallback(async (id) => {
    try {
      const res = await api.delete(`/post/${id}`);
      showToast(res.data.message || MESSAGES.POST.DELETE_SUCCESS, 'success');
      const filterer = (prev) => (prev || []).filter((p) => p._id !== id);
      setPosts(filterer);
      if (setUserPosts) {
        setUserPosts(filterer);
      }
    } catch (err) {
      console.error(err);
      showToast(MESSAGES.POST.DELETE_ERROR, 'error');
    }
  }, [setPosts, setUserPosts, showToast]);

  const likePost = useCallback(async (postId) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
    try {
      const res = await api.put(`/post/like/${postId}`, {});
      updatePostInState(res.data);
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || 'Failed to update like status.', 'error');
    }
  }, [user, updatePostInState, showToast]);

  const hahaPost = useCallback(async (postId) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
    try {
      const res = await api.put(`/post/haha/${postId}`, {});
      updatePostInState(res.data);
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || 'Failed to update haha status.', 'error');
    }
  }, [user, updatePostInState, showToast]);

  const savePost = useCallback(async (id) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
    try {
      const res = await api.put(`/post/save/${id}`, {});
      updatePostInState(res.data);
      showToast(MESSAGES.COMMON.SAVED, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save post.', 'error');
    }
  }, [user, updatePostInState, showToast]);

  const sharePost = useCallback(async (id, ownerId, customText = "") => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
    setIsLoading(true);
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
    try {
      const res = await api.post(`/post/share/${id}`, { customText });
      showToast('Success! Post shared to your profile.', 'success', { id: loadingToast });
      setPosts((prev) => [res.data, ...(prev || [])]);
      if (setUserPosts && user?._id === ownerId) {
        setUserPosts((prev) => [res.data, ...(prev || [])]);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to share the post.", 'error', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  }, [user, setIsLoading, setPosts, setUserPosts, showToast]);

  const displayOrHideComments = useCallback(async (postId) => {
    try {
      const res = await api.put(`/post/commentsOff/${postId}`, {});
      if (res.data?.message) showToast(res.data.message, 'success');
      if (res.data?.post) {
        updatePostInState(res.data.post);
      }
    } catch (err) {
      console.error("Failed to toggle comments:", err);
    }
  }, [updatePostInState, showToast]);

  const copyPostLink = useCallback((postId) => {
    if (typeof window === 'undefined') return;
    const link = `${window.location.origin}/Pages/Post/${postId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => showToast("Link copied to clipboard.", 'success'))
      .catch(() => showToast("Failed to copy link.", 'error'));
  }, [showToast]);

  const viewPost = useCallback(async (postId) => {
    if (!user?.token) return;
    try {
      const res = await api.put(`/post/view/${postId}`, {});
      const post = res.data.post || res.data;
      updatePostInState(post);
      return post;
    } catch (err) {
      console.error("Failed to register post view:", err);
    }
  }, [user?.token, updatePostInState]);

  return {
    likePost,
    hahaPost,
    savePost,
    deletePost,
    sharePost,
    displayOrHideComments,
    viewPost,
    copyPostLink,
  };
};
