'use client';

import { useCallback, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { MESSAGES } from '@/app/utils/messages';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import { selectComments, selectCommentsLoading } from '../features/comments/commentsSelectors';
import {
  setComments as setReduxComments,
  appendComments,
  insertComment,
  updateComment as updateReduxComment,
  deleteCommentFromState,
  setIsLoading,
  optimisticLikeComment,
} from '../features/comments/commentsSlice';



export const useComment = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { user } = useAuth();
  const { showToast } = useFeedback();

  const comments = useAppSelector(selectComments);
  const isLoading = useAppSelector(selectCommentsLoading);

  const setComments = useCallback(
    (c) => {
      const currentComments = selectComments(store.getState());
      dispatch(setReduxComments(typeof c === 'function' ? c(currentComments) : c));
    },
    [dispatch, store]
  );

  const fetchCommentsByTarget = useCallback(
    async (targetId, targetType = 'Post', cursor = null) => {
      if (!targetType || !targetId) return;
      dispatch(setIsLoading(true));
      try {
        const res = await api.get(`/comment/${targetType}/${targetId}`, {
          params: { cursor, limit: 10 },
        });
        const fetchedComments = Array.isArray(res.data.comments) ? res.data.comments : [];
        dispatch(cursor ? appendComments(fetchedComments) : setReduxComments(fetchedComments));
        return { nextCursor: res.data.nextCursor, hasMore: res.data.hasMore };
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch]
  );

  const getRepliesForComment = useCallback(async (commentId, cursor = null) => {
    try {
      const res = await api.get(`/comment/${commentId}/replies`, {
        params: { cursor, limit: 5 },
      });
      const fetchedReplies = Array.isArray(res.data.comments) ? res.data.comments : [];
      const currentComments = selectComments(store.getState());
      const findComment = (items) => {
        for (const comment of items) {
          if (comment._id === commentId) return comment;
          const nested = findComment(comment.replies || []);
          if (nested) return nested;
        }
        return null;
      };
      const currentComment = findComment(currentComments);
      const existingIds = new Set((currentComment?.replies || []).map((reply) => reply._id));
      const replies = cursor
        ? [
            ...(currentComment?.replies || []),
            ...fetchedReplies.filter((reply) => !existingIds.has(reply._id)),
          ]
        : fetchedReplies;
      dispatch(updateReduxComment({
        _id: commentId,
        replies,
        replyCursor: res.data.nextCursor,
        hasMoreReplies: res.data.hasMore,
      }));
      return { comments: replies, nextCursor: res.data.nextCursor, hasMore: res.data.hasMore };
    } catch (err) {
      console.error('Error fetching replies:', err);
    }
  }, [dispatch, store]);

  const AddComment = useCallback(
    async ({ text, targetType, targetId }) => {
      if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

      const tempId = `temp-${Date.now()}`;
      const tempComment = {
        _id: tempId,
        text,
        owner: user,
        targetType,
        targetId,
        likes: [],
        replies: [],
        replyCount: 0,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      dispatch(insertComment(tempComment));

      try {
        const res = await api.post('/comment', { text, targetType, targetId });

        const newComment = res.data.comment || res.data;
        dispatch(deleteCommentFromState(tempId));
        dispatch(insertComment(newComment));
        showToast(MESSAGES.COMMENT.ADD_SUCCESS, 'success');
        return newComment;
      } catch (err) {
        console.error('Error adding comment:', err);
        dispatch(deleteCommentFromState(tempId));
        showToast(MESSAGES.COMMENT.ADD_ERROR, 'error');
      }
    },
    [user, showToast, dispatch]
  );

  const deleteComment = useCallback(
    async (commentId) => {
      try {
        await api.delete(`/comment/${commentId}`);
        dispatch(deleteCommentFromState(commentId));
        showToast(MESSAGES.COMMENT.DELETE_SUCCESS, 'success');
      } catch (err) {
        console.error('Error deleting comment:', err);
        showToast(MESSAGES.COMMENT.DELETE_ERROR, 'error');
      }
    },
    [dispatch, showToast]
  );

  const updateComment = useCallback(
    async (commentId, text) => {
      try {
        const res = await api.put(`/comment/update/${commentId}`, { text });
        const updated = res.data.comment || res.data;
        dispatch(updateReduxComment(updated));
        showToast(MESSAGES.COMMENT.UPDATE_SUCCESS, 'success');
      } catch (err) {
        console.error('Error updating comment:', err);
        showToast(MESSAGES.COMMENT.UPDATE_ERROR, 'error');
      }
    },
    [dispatch, showToast]
  );

  const likeComment = useCallback(
    async (commentId) => {
      if (!user) return showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');

      dispatch(optimisticLikeComment({ commentId, userId: user._id }));

      try {
        const res = await api.put(`/comment/like/${commentId}`, {});
        const updatedComment = res.data.comment || res.data;
        dispatch(updateReduxComment(updatedComment));
        return updatedComment;
      } catch (err) {
        console.error('Like comment error:', err);
        showToast(err?.response?.data?.message || 'Failed to update like status.', 'error');
      }
    },
    [user, dispatch, showToast]
  );

  return useMemo(
    () => ({
      comments,
      setComments,
      isLoading,
      AddComment,
      deleteComment,
      likeComment,
      updateComment,
      fetchCommentsByTarget,
      getRepliesForComment,
    }),
    [
      comments,
      setComments,
      isLoading,
      AddComment,
      deleteComment,
      likeComment,
      updateComment,
      fetchCommentsByTarget,
      getRepliesForComment,
    ]
  );
};

export default useComment;
