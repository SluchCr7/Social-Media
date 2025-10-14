'use client';

import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotify } from './NotifyContext';
import { useAlert } from './AlertContext';
import { checkUserStatus } from '../utils/checkUserLog';
import { useCommentModify } from '../Custome/Comment/useCommentModify';
export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export const CommentContextProvider = ({ children }) => {
  
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  const { addNotify } = useNotify();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const {
    fetchCommentsByPostId,
    AddComment,
    deleteComment,
    updateComment
  } = useCommentModify({
    user,
    showAlert,
    setComments,
    setIsLoading,
  });

  // 📌 لايك على كومنت
  const likeComment = async (id) => {
    if (!checkUserStatus("like comments" ,showAlert,user)) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updatedComment = res.data.comment;
      setComments(prev => updateCommentInTree(prev, updatedComment));

      showAlert(res.data.message);
      return updatedComment;
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || "Failed to like comment.");
    }
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        setComments,
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


