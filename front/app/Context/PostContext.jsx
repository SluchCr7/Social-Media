'use client';

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import getData from "../utils/getData";
import { useAlert } from "./AlertContext";

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [imageView , setImageView] = useState(null);
  const [showPostModelEdit, setShowPostModelEdit] = useState(false);
  const [postIsEdit, setPostIsEdit] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);


const AddPost = async (content, images, Hashtags, communityId) => {
  const formData = new FormData();
  formData.append("text", content);

  images.forEach(img => formData.append("image", img.file)); // ✅ استخدم .file فقط

  Hashtags.forEach(tag => formData.append("Hashtags", tag));
  if (communityId) formData.append("community", communityId);

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/add`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    showAlert("Post added successfully.");
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  } catch (err) {
    console.error(err);
    showAlert(err?.response?.data?.message || "Failed to upload post.");
  }
};


  const deletePost = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/${id}`,
        { headers: { authorization: `Bearer ${user.token}` } }
      );
      showAlert(res.data.message);
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };

  const likePost = async (postId, postOwnerId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      showAlert(res.data.message);

      // Notify if it's not user's own post
      if (postOwnerId !== user._id) {
        await addNotify({
          content: `${user.username} liked your post`,
          type: "like",
          receiverId: postOwnerId,
          actionRef: postId,
          actionModel: "Post",
        });
      }
      
    } catch (err) {
      console.log(err);
    }
  };

  const savePost = async (id) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/save/${id}`,
        {},
        { headers: { authorization: `Bearer ${user.token}` } }
      );
      showAlert("Post saved successfully.");
    } catch (err) {
      console.log(err);
    }
  };

  const sharePost = async (id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/share/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      showAlert("Post shared successfully.");
    } catch (err) {
      console.log(err);
      showAlert("Failed to share the post.");
    }
  };

  const editPost = async (id, { text, community, Hashtags, existingPhotos, newPhotos }) => {
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (community) formData.append('community', community);
      if (Hashtags && Hashtags.length > 0) {
        formData.append('Hashtags', JSON.stringify(Hashtags));
      }
      formData.append('existingPhotos', JSON.stringify(existingPhotos));

      if (newPhotos && newPhotos.length > 0) {
        newPhotos.forEach(photo => {
          formData.append('newPhotos', photo);
        });
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/edit/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      showAlert("Post edited successfully.");
    } catch (err) {
      console.error(err);
      showAlert("Failed to edit the post.");
    }
  };
  const displayOrHideComments = async (postId) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/commentsOff/${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (response.data?.message) {
      showAlert(response.data.message); // "تم تعطيل التعليقات..." أو "تم تفعيل التعليقات..."
    }
    
    return response.data;
  } catch (err) {
    console.error("فشل في تبديل حالة التعليقات:", err);
    // showAlert("حدث خطأ أثناء تغيير حالة التعليقات");
  }
};

  const copyPostLink = (postId) => {
    const link = `${window.location.origin}/Pages/Post/${postId}`;
    
    navigator.clipboard.writeText(link)
      .then(() => {
        showAlert("Link copied to clipboard.");
      })
      .catch(() => {
        showAlert("Failed to copy link.");
      });
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
        setPostIsEdit,
        displayOrHideComments,
        copyPostLink,
        imageView , setImageView
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  return useContext(PostContext);
};
