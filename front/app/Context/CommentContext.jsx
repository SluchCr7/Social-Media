'use client';

import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotify } from './NotifyContext';
import { useAlert } from './AlertContext';

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export const CommentContextProvider = ({ children }) => {
  const [comments, setcomments] = useState([]);
  const { user } = useAuth();
  const { addNotify } = useNotify();
  const { showAlert } = useAlert();
  const [isLoading , setIsLoading] = useState(false)
  const fetchCommentsByPostId = async (postId) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/post/${postId}`);
      setcomments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  };


const AddComment = async (text, postId, receiverId, parent = null) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${postId}`,
      { text, parent },
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    const newComment = res.data.comment; // الكومنت بعد الـ populate
    setcomments((prev) => [newComment, ...prev]); // تحديث الـ state

    showAlert('Comment added successfully.');

    if (user._id !== receiverId) {
      await addNotify({
        content: `${user.username} commented on your post`,
        type: 'comment',
        receiverId,
        actionRef: newComment._id,
        actionModel: 'Comment',
      });
    }

    return res.data;
  } catch (err) {
    showAlert(err?.response?.data?.message || 'Failed to upload comment.');
    throw err;
  }
};


  const deleteComment = async (id) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      showAlert(res.data.message);
      setcomments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateComment = async (id, text) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/update/${id}`,
        { text },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      showAlert('Comment updated successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  const likeComment = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/like/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const updatedComment = res.data.comment;

      setcomments((prev) =>
        prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
      );

      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        setcomments,
        AddComment,
        deleteComment,
        likeComment,
        updateComment,
        fetchCommentsByPostId,
        isLoading
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
