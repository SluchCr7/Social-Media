'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";
import { usePostActions } from "../Custome/Post/usePostActions";
import { usePostManagement } from "../Custome/Post/usePostManage";

const PostContext = createContext();

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostContextProvider');
  }
  return context;
};

export const PostContextProvider = ({ children }) => {
  const { user } = useAuth();

  // --- State ---
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPostCreated, setIsLoadingPostCreated] = useState(false);

  // UI State
  const [imageView, setImageView] = useState(null);
  const [showPostModelEdit, setShowPostModelEdit] = useState(false);
  const [postIsEdit, setPostIsEdit] = useState(null);

  // Pagination State (Feed)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // User Profile Posts State
  const [userPosts, setUserPosts] = useState([]);
  const [userHasMore, setUserHasMore] = useState(true);
  const [userIsLoading, setUserIsLoading] = useState(false);

  // --- Actions ---

  /**
   * Fetch home feed posts with pagination
   */
  const fetchPosts = useCallback(async (pageNum = 1) => {
    // If it's not the first page and we know there's no more, return
    if (pageNum !== 1 && !hasMore) return;

    setIsLoading(true);
    try {
      const res = await api.get(`/post?page=${pageNum}&limit=10`);
      const fetchedPosts = Array.isArray(res.data.posts) ? res.data.posts : [];

      setPosts(prev => (pageNum === 1 ? fetchedPosts : [...prev, ...fetchedPosts]));
      setHasMore(pageNum < res.data.pages);
    } catch (err) {
      console.error("Error fetching feed posts:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore]);

  /**
   * Fetch posts for a specific user profile
   */
  const fetchUserPosts = useCallback(async (userId, pageNum = 1, limit = 5) => {
    if (!userId) return;

    setUserIsLoading(true);
    try {
      const res = await api.get(`/post/user/${userId}?page=${pageNum}&limit=${limit}`);
      const fetchedPosts = Array.isArray(res.data.posts) ? res.data.posts : [];

      setUserPosts(prev => (pageNum === 1 ? fetchedPosts : [...prev, ...fetchedPosts]));
      setUserHasMore(pageNum < res.data.pages);
    } catch (err) {
      console.error("Error fetching profile posts:", err.message);
    } finally {
      setUserIsLoading(false);
    }
  }, []);

  /**
   * Get post by ID
   */
  const getPostById = useCallback(async (id) => {
    if (!id) return null;
    try {
      const res = await api.get(`/post/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching post by ID:", err);
      return null;
    }
  }, []);

  // --- External Hooks (passed state setters) ---
  const postManagement = usePostManagement({
    user,
    setPosts,
    setIsLoadingPostCreated,
    setIsLoading
  });

  const postActions = usePostActions({
    user,
    setPosts,
    setIsLoading
  });

  // --- Effects ---

  // Initial fetch of posts
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // Fetch more posts when page changes (only for page > 1 as 1 is handled above)
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page, fetchPosts]);

  // --- Context Value ---
  const value = useMemo(() => ({
    // State
    posts,
    setPosts,
    isLoading,
    isLoadingPostCreated,
    imageView,
    setImageView,
    showPostModelEdit,
    setShowPostModelEdit,
    postIsEdit,
    setPostIsEdit,
    hasMore,
    setPage,
    page,
    userPosts,
    userHasMore,
    userIsLoading,

    // Actions
    fetchPosts,
    fetchUserPosts,
    getPostById,
    ...postManagement,
    ...postActions,
  }), [
    posts, isLoading, isLoadingPostCreated, imageView, showPostModelEdit,
    postIsEdit, hasMore, page, userPosts, userHasMore, userIsLoading,
    fetchPosts, fetchUserPosts, getPostById, postManagement, postActions
  ]);

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};
