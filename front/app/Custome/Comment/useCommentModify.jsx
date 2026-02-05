import { useCallback } from "react";
import api from "@/app/utils/api";
import { checkUserStatus } from "@/app/utils/checkUserLog";

export const useCommentModify = ({
  user,
  showAlert,
  setComments,
  setIsLoading,
}) => {

  // 🌳 Helper: Update deeply nested comment
  const updateCommentInTree = useCallback((list, updatedComment) => {
    return list.map((c) => {
      if (c._id === updatedComment._id) return { ...c, ...updatedComment };
      if (c.replies?.length > 0) {
        return { ...c, replies: updateCommentInTree(c.replies, updatedComment) };
      }
      return c;
    });
  }, []);

  // 🗑️ Helper: Delete from tree
  const deleteCommentFromTree = useCallback((list, idToDelete) => {
    return list
      .filter((c) => c._id !== idToDelete)
      .map((c) => ({
        ...c,
        replies: c.replies ? deleteCommentFromTree(c.replies, idToDelete) : [],
      }));
  }, []);

  // ➕ Helper: Insert into tree
  const insertCommentToTree = useCallback((tree, comment) => {
    if (comment.targetType !== "Comment") return [comment, ...tree];

    return tree.map((c) => {
      // If this comment is the parent
      if (c._id === comment.targetId) {
        return {
          ...c,
          replies: [comment, ...(c.replies || [])],
          replyCount: (c.replyCount || 0) + 1
        };
      }
      // If parent might be deeper
      if (c.replies?.length > 0) {
        return { ...c, replies: insertCommentToTree(c.replies, comment) };
      }
      return c;
    });
  }, []);

  // 🔄 Helper: Replace temporary node with real node
  const replaceCommentInTree = useCallback((list, tempId, realComment) => {
    return list.map((c) => {
      if (c._id === tempId) return realComment;
      if (c.replies?.length > 0) {
        return { ...c, replies: replaceCommentInTree(c.replies, tempId, realComment) };
      }
      return c;
    });
  }, []);

  // 🛠 Helper: Modify node with callback (for Optimistic Like)
  const modifyCommentInTree = useCallback((list, finderId, modifier) => {
    return list.map((c) => {
      if (c._id === finderId) return modifier(c);
      if (c.replies?.length > 0) {
        return { ...c, replies: modifyCommentInTree(c.replies, finderId, modifier) };
      }
      return c;
    });
  }, []);

  // 📌 Fetch Post/Reel Comments (Top-Level)
  const fetchCommentsByTarget = useCallback(async (targetId, targetType = 'Post', cursor = null) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/comment/${targetType}/${targetId}`, {
        params: { cursor, limit: 10 }
      });

      const { comments: newComments, nextCursor, hasMore } = res.data;

      setComments(prev => {
        if (!cursor) return newComments; // Fresh load
        // Avoid duplicates
        const existingIds = new Set(prev.map(c => c._id));
        const uniqueNew = newComments.filter(c => !existingIds.has(c._id));
        return [...prev, ...uniqueNew];
      });

      return { nextCursor, hasMore };
    } catch (err) {
      console.error("Error fetching comments:", err);
      if (showAlert) showAlert(err?.response?.data?.message || "Failed to load comments.", 'error');
    } finally {
      setIsLoading(false);
    }
  }, [setComments, setIsLoading, showAlert]);

  // 🔄 Fetch Replies for a Comment
  const getRepliesForComment = useCallback(async (commentId, cursor = null) => {
    try {
      const res = await api.get(`/comment/${commentId}/replies`, {
        params: { cursor, limit: 5 }
      });

      const { comments: newReplies, nextCursor, hasMore } = res.data;

      setComments(prev => {
        const updateReplies = (list) => {
          return list.map(c => {
            if (c._id === commentId) {
              const existingRepliesIds = new Set((c.replies || []).map(r => r._id));
              const uniqueNew = newReplies.filter(r => !existingRepliesIds.has(r._id));
              return {
                ...c,
                replies: cursor ? [...(c.replies || []), ...uniqueNew] : newReplies,
                replyCursor: nextCursor,
                hasMoreReplies: hasMore
              };
            }
            if (c.replies?.length > 0) {
              return { ...c, replies: updateReplies(c.replies) };
            }
            return c;
          });
        };
        return updateReplies(prev);
      });

      return { nextCursor, hasMore };
    } catch (err) {
      console.error("Error fetching replies:", err);
      if (showAlert) showAlert("Failed to load replies.", 'error');
    }
  }, [setComments, showAlert]);

  // ➕ Add Comment/Reply
  // ➕ Add Comment/Reply
  const AddComment = useCallback(async (text, targetId, targetType = 'Post') => {
    if (!checkUserStatus("add comments", showAlert, user)) return;

    // Optimistic Logic
    const tempId = `temp-${Date.now()}`;
    const optimisticComment = {
        _id: tempId,
        text,
        owner: user,
        targetId,
        targetType,
        likes: [],
        replies: [],
        replyCount: 0,
        createdAt: new Date().toISOString(),
        isOptimistic: true
    };

    setComments((prev) => insertCommentToTree(prev, optimisticComment));

    try {
      const res = await api.post('/comment', { text, targetId, targetType });
      const newCommentData = { ...res.data.comment, replies: [], replyCount: 0 }; // Ensure structure

      // Replace temp with real
      setComments((prev) => replaceCommentInTree(prev, tempId, newCommentData));

      if (showAlert) showAlert(targetType === "Comment" ? "Reply added." : "Comment added.", 'success');
      return newCommentData;
    } catch (err) {
      // Revert
      setComments((prev) => deleteCommentFromTree(prev, tempId));
      if (showAlert) showAlert(err?.response?.data?.message || "Failed to add comment.", 'error');
      throw err;
    }
  }, [user, showAlert, setComments, insertCommentToTree, replaceCommentInTree, deleteCommentFromTree]);

  // 🗑️ Delete Comment
  const deleteComment = useCallback(async (id) => {
    if (!checkUserStatus("delete comments", showAlert, user)) return;

    try {
      const res = await api.delete(`/comment/${id}`);
      setComments((prev) => deleteCommentFromTree(prev, id));
      if (showAlert) showAlert(res.data.message, 'success');
      return res.data;
    } catch (err) {
      if (showAlert) showAlert(err?.response?.data?.message || "Failed to delete comment.", 'error');
    }
  }, [user, showAlert, setComments, deleteCommentFromTree]);

  // ✏️ Update Comment
  const updateComment = useCallback(async (id, text) => {
    if (!checkUserStatus("update comments", showAlert, user)) return;

    try {
      const res = await api.put(`/comment/update/${id}`, { text });
      const updatedCommentData = res.data.comment;
      setComments((prev) => updateCommentInTree(prev, updatedCommentData));
      if (showAlert) showAlert("Comment updated.", 'success');
      return updatedCommentData;
    } catch (err) {
      if (showAlert) showAlert(err?.response?.data?.message || "Failed to update comment.", 'error');
    }
  }, [user, showAlert, setComments, updateCommentInTree]);

  return {
    fetchCommentsByTarget,
    getRepliesForComment,
    AddComment,
    deleteComment,
    updateComment,
    updateCommentInTree,
    insertCommentToTree,
    deleteCommentFromTree,
    replaceCommentInTree,
    modifyCommentInTree
  };
};
