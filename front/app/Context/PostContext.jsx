'use client';

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { useNotify } from "./NotifyContext";
import { checkUserStatus } from "../utils/checkUserLog";
import { usePostActions } from "../Custome/Post/usePostActions";

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user , isLogin } = useAuth();
  const { showAlert } = useAlert();
  const [imageView , setImageView] = useState(null);
  const [showPostModelEdit, setShowPostModelEdit] = useState(false);
  const [postIsEdit, setPostIsEdit] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [userPages, setUserPages] = useState(1);
  const [userHasMore, setUserHasMore] = useState(true);
  const [userIsLoading , setUserIsLoading] = useState(false);
  const [isLoadingPostCreated , setIsLoadingPostCreated] = useState(false)
  
  const { AddPost, editPost } = usePostManagement({ user, showAlert, setPosts, setIsLoadingPostCreated, setIsLoading });
  const {likePost , deletePost , savePost , hahaPost , displayOrHideComments,sharePost , viewPost,copyPostLink} = usePostActions({ user, showAlert, setPosts, setIsLoading});

  const fetchPosts = async (pageNum = 1) => {
    if (!hasMore && pageNum !== 1) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post?page=${pageNum}&limit=10`);
      const newPosts = Array.isArray(res.data.posts) ? res.data.posts : [];

      // تحديث posts
      setPosts(prev => (pageNum === 1 ? newPosts : [...prev, ...newPosts]));

      // تحديث hasMore
      setHasMore(pageNum < res.data.pages);
    } catch (err) {
      console.error("Error fetching posts", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch عند mount أو عند تغير page
  useEffect(() => {
    fetchPosts(page);
  }, [page]);
  
  // ✅ جلب بوستات يوزر معين (مع pagination)
  const fetchUserPosts = async (userId, pageNum = 1, limit = 5) => {
    setUserIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/user/${userId}?page=${pageNum}&limit=${limit}`
      );

      const newPosts = Array.isArray(res.data.posts) ? res.data.posts : [];

      setUserPosts(prev =>
        pageNum === 1 ? newPosts : [...prev, ...newPosts]
      );

      // تحديث hasMore
      setUserHasMore(pageNum < res.data.pages);
    } catch (err) {
      console.error("Error fetching user posts", err.response?.data || err.message);
    }finally {
      setUserIsLoading(false);
    }
  };

  const getPostById = async(id) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/${id}`);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        AddPost,
        deletePost,
        likePost,
        savePost,
        sharePost,
        isLoading,
        editPost,
        showPostModelEdit,
        setShowPostModelEdit,
        postIsEdit,
        getPostById,
        setPostIsEdit,
        displayOrHideComments,
        copyPostLink,
        imageView , setImageView, viewPost,fetchPosts,hasMore, setPage
        ,hahaPost, userPosts, fetchUserPosts, userPages,setUserPages , userHasMore,userIsLoading
        ,isLoadingPostCreated
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  return useContext(PostContext);
};
