'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import api from '../utils/api';
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
    fetchCommentsByTarget,
    fetchCommentReplies,
    AddComment,
    deleteComment,
    updateComment,
    updateCommentInTree
  } = useCommentModify({
    user,
    setComments,
    setIsLoading,
    showAlert: showToast,
  });

  // --- Actions ---

  /**
   * Toggle like on a comment
   */
  const likeComment = useCallback(async (commentId) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

    try {
      const res = await api.put(`/comment/like/${commentId}`, {});

      const updatedComment = res.data.comment || res.data;
      setComments(prev => updateCommentInTree(prev, updatedComment));

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
    fetchCommentsByTarget,
    fetchCommentReplies,
  }), [
    comments, isLoading, AddComment, deleteComment,
    likeComment, updateComment, fetchCommentsByTarget,
    fetchCommentReplies
  ]);

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};
