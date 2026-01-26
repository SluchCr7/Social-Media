'use client';

import axios from 'axios';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useFeedback } from './FeedbackContext';
import { MESSAGES } from '../utils/messages';
import { useCommentModify } from '../Custome/Comment/useCommentModify';

const CommentContext = createContext();

export const useComment = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComment must be used within a CommentContextProvider');
  }
  return context;
};

export const CommentContextProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useFeedback();

  // --- State ---
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- External Hook for CRUD ---
  const {
    fetchCommentsByPostId,
    AddComment,
    deleteComment,
    updateComment,
    updateCommentInTree
  } = useCommentModify({
    user,
    setComments,
    setIsLoading,
  });

  // --- Actions ---

  /**
   * Toggle like on a comment
   */
  const likeComment = useCallback(async (commentId) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/like/${commentId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updatedComment = res.data.comment;
      setComments(prev => updateCommentInTree(prev, updatedComment));

      // showToast(res.data.message, 'success'); // Optional, might be too noisy
      return updatedComment;
    } catch (err) {
      console.error('Like comment error:', err);
      showToast(err?.response?.data?.message || "Failed to update like status.", 'error');
    }
  }, [user, showToast, updateCommentInTree]);

  // --- Context Value ---
  const value = useMemo(() => ({
    comments,
    setComments,
    isLoading,
    AddComment,
    deleteComment,
    likeComment,
    updateComment,
    fetchCommentsByPostId,
  }), [
    comments, isLoading, AddComment, deleteComment,
    likeComment, updateComment, fetchCommentsByPostId
  ]);

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};
