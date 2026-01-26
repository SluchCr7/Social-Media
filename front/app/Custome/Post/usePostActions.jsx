'use client';

import axios from "axios";
import { useCallback } from "react";
import { useFeedback } from "@/app/Context/FeedbackContext";
import { MESSAGES } from "@/app/utils/messages";

export const usePostActions = ({ user, setPosts, setIsLoading }) => {
  const { showToast } = useFeedback();

  const getHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${user?.token}` }
  }), [user?.token]);

  const updatePostInState = useCallback((updatedPost) =>
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))),
    [setPosts]);

  const deletePost = useCallback(async (id) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/${id}`, getHeaders());
      showToast(res.data.message || MESSAGES.POST.DELETE_SUCCESS, 'success');
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      showToast(MESSAGES.POST.DELETE_ERROR, 'error');
    }
  }, [getHeaders, setPosts, showToast]);

  const likePost = useCallback(async (postId) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/like/${postId}`, {}, getHeaders());
      updatePostInState(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [user, getHeaders, updatePostInState, showToast]);

  const hahaPost = useCallback(async (postId) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/haha/${postId}`, {}, getHeaders());
      updatePostInState(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [user, getHeaders, updatePostInState, showToast]);

  const savePost = useCallback(async (id) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/save/${id}`, {}, getHeaders());
      updatePostInState(res.data);
      showToast(MESSAGES.COMMON.SAVED, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save post.', 'error');
    }
  }, [user, getHeaders, updatePostInState, showToast]);

  const sharePost = useCallback(async (id, customText = "") => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
    setIsLoading(true);
    const loadingToast = showToast(MESSAGES.COMMON.LOADING, 'loading');
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/share/${id}`,
        { customText },
        getHeaders()
      );
      showToast('Success! Post shared to your profile.', 'success', { id: loadingToast });
      setPosts((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      showToast("Failed to share the post.", 'error', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  }, [user, getHeaders, setIsLoading, setPosts, showToast]);

  const displayOrHideComments = useCallback(async (postId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/commentsOff/${postId}`,
        {},
        getHeaders()
      );
      if (res.data?.message) showToast(res.data.message, 'success');
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, isCommentOff: !p.isCommentOff } : p))
      );
    } catch (err) {
      console.error("Failed to toggle comments:", err);
    }
  }, [getHeaders, setPosts, showToast]);

  const copyPostLink = useCallback((postId) => {
    const link = `${window.location.origin}/Pages/Post/${postId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => showToast("Link copied to clipboard.", 'success'))
      .catch(() => showToast("Failed to copy link.", 'error'));
  }, [showToast]);

  const viewPost = useCallback(async (postId) => {
    if (!user?.token) return;
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/view/${postId}`, {}, getHeaders());
      updatePostInState(res.data.post);
      return res.data.post;
    } catch (err) {
      console.error("Failed to register post view:", err);
    }
  }, [user?.token, getHeaders, updatePostInState]);

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
