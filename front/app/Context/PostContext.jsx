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

  // Memories State
  const [memories, setMemories] = useState([]);
  const [memoriesLoading, setMemoriesLoading] = useState(false);

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
    if (!userId || (pageNum !== 1 && userIsLoading)) return;

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
  }, [userIsLoading]);

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

  /**
   * Fetch user memories (posts from this day in past years)
   */
  const fetchMemories = useCallback(async () => {
    setMemoriesLoading(true);
    try {
      const res = await api.get('/post/memories');
      setMemories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching memories:", err.message);
    } finally {
      setMemoriesLoading(false);
    }
  }, []);

  // --- External Hooks (passed state setters) ---
  const postManagement = usePostManagement({
    user,
    setPosts,
    setUserPosts,
    setIsLoadingPostCreated,
    setIsLoading
  });

  const postActions = usePostActions({
    user,
    setPosts,
    setUserPosts,
    setIsLoading
  });

  // --- Effects ---

  // Consolidated fetch effect
  useEffect(() => {
    fetchPosts(page);
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
    memories,
    memoriesLoading,

    // Actions
    fetchPosts,
    fetchUserPosts,
    getPostById,
    fetchMemories,
    ...postManagement,
    ...postActions,
  }), [
    posts, isLoading, isLoadingPostCreated, imageView, showPostModelEdit,
    postIsEdit, hasMore, page, userPosts, userHasMore, userIsLoading,
    memories, memoriesLoading,
    fetchPosts, fetchUserPosts, getPostById, fetchMemories, postManagement, postActions
  ]);

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};
