'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch } from '../hooks';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { MESSAGES } from '@/app/utils/messages';
import { commentsApi } from '../features/comments/commentsApi';
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsInfiniteQuery,
  useLikeCommentMutation,
  useUpdateCommentMutation,
} from '../features/comments/commentsApi';

const getErrorMessage = (error) =>
  error?.data?.message || error?.response?.data?.message || error?.message;

export const useComment = ({ targetId, targetType, enabled = true } = {}) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showToast } = useFeedback();
  const commentsQuery = useGetCommentsInfiniteQuery({
    targetId,
    targetType,
    limit: 10,
  }, {
    skip: !enabled || !targetId || !targetType,
  });
  const {
    fetchNextPage: fetchNextCommentsPage,
    refetch: refetchComments,
  } = commentsQuery;
  const [addCommentRequest] = useAddCommentMutation();
  const [deleteCommentRequest] = useDeleteCommentMutation();
  const [updateCommentRequest] = useUpdateCommentMutation();
  const [likeCommentRequest] = useLikeCommentMutation();

  const comments = useMemo(
    () => commentsQuery.data?.pages?.flatMap((page) => page?.comments || []) || [],
    [commentsQuery.data]
  );

  const fetchCommentsByTarget = useCallback(async (id, type = 'Post', cursor = null) => {
    if (!id || !type) return null;
    let response;
    if (String(id) === String(targetId) && type === targetType) {
      response = cursor
        ? await fetchNextCommentsPage()
        : await refetchComments();
    } else {
      response = await dispatch(commentsApi.endpoints.getComments.initiate(
        { targetId: id, targetType: type, limit: 10 },
        { subscribe: false, forceRefetch: true }
      ));
    }
    const pages = response?.data?.pages || [];
    const page = cursor ? pages[pages.length - 1] : pages[0];
    return page ? { nextCursor: page.nextCursor, hasMore: page.hasMore } : null;
  }, [
    fetchNextCommentsPage,
    refetchComments,
    dispatch,
    targetId,
    targetType,
  ]);

  const AddComment = useCallback(async ({ text, targetType: type, targetId: id }) => {
    if (!user) {
      showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
      return null;
    }
    try {
      const data = await addCommentRequest({ text, targetType: type, targetId: id }).unwrap();
      const comment = data?.comment || data;
      showToast(MESSAGES.COMMENT.ADD_SUCCESS, 'success');
      return comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      showToast(getErrorMessage(error) || MESSAGES.COMMENT.ADD_ERROR, 'error');
      return null;
    }
  }, [addCommentRequest, showToast, user]);

  const deleteComment = useCallback(async (commentId) => {
    try {
      await deleteCommentRequest(commentId).unwrap();
      showToast(MESSAGES.COMMENT.DELETE_SUCCESS, 'success');
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToast(getErrorMessage(error) || MESSAGES.COMMENT.DELETE_ERROR, 'error');
    }
  }, [deleteCommentRequest, showToast]);

  const updateComment = useCallback(async (commentId, text) => {
    try {
      const data = await updateCommentRequest({ id: commentId, text }).unwrap();
      showToast(MESSAGES.COMMENT.UPDATE_SUCCESS, 'success');
      return data?.comment || data;
    } catch (error) {
      console.error('Error updating comment:', error);
      showToast(getErrorMessage(error) || MESSAGES.COMMENT.UPDATE_ERROR, 'error');
    }
  }, [showToast, updateCommentRequest]);

  const likeComment = useCallback(async (commentId) => {
    if (!user) {
      showToast(MESSAGES.COMMON.UNAUTHORIZED, 'error');
      return null;
    }
    try {
      const data = await likeCommentRequest(commentId).unwrap();
      return data?.comment || data;
    } catch (error) {
      console.error('Like comment error:', error);
      showToast(getErrorMessage(error) || 'Failed to update like status.', 'error');
      return null;
    }
  }, [likeCommentRequest, showToast, user]);

  return useMemo(() => ({
    comments,
    isLoading: commentsQuery.isLoading,
    isFetchingMore: commentsQuery.isFetchingNextPage,
    hasMore: Boolean(commentsQuery.hasNextPage),
    error: commentsQuery.error,
    loadMoreComments: commentsQuery.fetchNextPage,
    AddComment,
    deleteComment,
    likeComment,
    updateComment,
    fetchCommentsByTarget,
  }), [
    comments,
    commentsQuery.isLoading,
    commentsQuery.isFetchingNextPage,
    commentsQuery.hasNextPage,
    commentsQuery.error,
    commentsQuery.fetchNextPage,
    AddComment,
    deleteComment,
    likeComment,
    updateComment,
    fetchCommentsByTarget,
  ]);
};

export default useComment;
