'use client';

import { createContext,useEffect, useContext, useState, useCallback, useMemo } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import { useFeedback } from './FeedbackContext';
import { MESSAGES } from '../utils/messages';
import { useSocket } from './SocketContext';
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
    getRepliesForComment,
    AddComment,
    deleteComment,
    updateComment,
    updateCommentInTree,
    insertCommentToTree,
    deleteCommentFromTree,
    modifyCommentInTree
  } = useCommentModify({
    user,
    setComments,
    setIsLoading,
    showAlert: showToast,
  });

  // 🔌 Socket Listeners
  const { socket } = useSocket();

  // We need to use 'user' inside useEffect, so we add it to dependency
  // But handlers need access to 'insertCommentToTree', etc. which are stable if memoized
  
  // Note: We might need to listen to events for SPECIFIC targets if we only want relevant comments
  // But typically checking if target/parent exists in current `comments` tree is enough.
  // HOWEVER, top-level comments (targetType=Post) won't be in tree if we haven't loaded them?
  // Or they are just added to list.
  
  // Actually, filtering by `comments` existing is hard in useEffect because `comments` changes.
  // We can use functional updates `setComments(prev => ...)`

  useState(() => {
     // Setup listeners wrapper? No, useEffect.
  });

  // Since `comments` is global for the context instance, we assume it holds the CURRENTLY viewed tree.

  useEffect(() => {
    if (!socket) return;

    const handleCreate = (newComment) => {
       const currentUserId = user?._id?.toString();
       const ownerId = newComment?.owner?._id?.toString() || newComment?.owner?.toString();
       if (currentUserId && ownerId === currentUserId) return; // Handled by AddComment

       setComments(prev => insertCommentToTree(prev, newComment));
    };

    const handleUpdate = (updatedComment) => {
        setComments(prev => updateCommentInTree(prev, updatedComment));
    };

    const handleDelete = (commentId) => {
        setComments(prev => deleteCommentFromTree(prev, commentId));
    };

    socket.on("comment:create", handleCreate);
    socket.on("comment:update", handleUpdate);
    socket.on("comment:delete", handleDelete);

    return () => {
        socket.off("comment:create", handleCreate);
        socket.off("comment:update", handleUpdate);
        socket.off("comment:delete", handleDelete);
    };
  }, [socket, user, insertCommentToTree, updateCommentInTree, deleteCommentFromTree]);

  // --- Actions ---

  /**
   * Toggle like on a comment
   */
  const likeComment = useCallback(async (commentId) => {
    if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

    // Optimistic Update
    setComments(prev => modifyCommentInTree(prev, commentId, (c) => {
        const isLiked = c.likes?.includes(user._id);
        const newLikes = isLiked 
            ? c.likes.filter(id => id !== user._id) 
            : [...(c.likes || []), user._id];
        return { ...c, likes: newLikes };
    }));

    try {
      const res = await api.put(`/comment/like/${commentId}`, {});
      const updatedComment = res.data.comment || res.data;
      // Confirm with server
      setComments(prev => updateCommentInTree(prev, updatedComment));
      return updatedComment;
    } catch (err) {
      console.error('Like comment error:', err);
      showToast(err?.response?.data?.message || "Failed to update like status.", 'error');
    }
  }, [user, showToast, updateCommentInTree, modifyCommentInTree]);

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
    getRepliesForComment,
  }), [
    comments,
    isLoading,
    AddComment,
    deleteComment,
    likeComment,
    updateComment,
    fetchCommentsByTarget,
    getRepliesForComment
  ]);

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};
