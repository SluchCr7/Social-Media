import { useCallback } from "react";
import api from "@/app/utils/api";
import { checkUserStatus } from "@/app/utils/checkUserLog";

export const useCommentModify = ({
  user,
  showAlert,
  setComments,
  setIsLoading,
}) => {

  // 🔹 Update comment inside tree (recursive)
  const updateCommentInTree = useCallback((list, updatedComment) => {
    return list.map((c) => {
      if (c._id === updatedComment._id) return { ...updatedComment, replies: c.replies || [] };
      if (c.replies?.length > 0) {
        return { ...c, replies: updateCommentInTree(c.replies, updatedComment) };
      }
      return c;
    });
  }, []);

  // 🔹 Delete comment from tree (recursive)
  const deleteCommentFromTree = useCallback((list, idToDelete) => {
    return list
      .filter((c) => c._id !== idToDelete)
      .map((c) => ({
        ...c,
        replies: c.replies ? deleteCommentFromTree(c.replies, idToDelete) : [],
      }));
  }, []);

  // 🔹 Insert new comment/reply into tree
  const insertCommentToTree = useCallback((tree, comment) => {
    const replies = Array.isArray(comment.replies) ? comment.replies : [];

    // If it's a top-level comment (Post or Reel), prepend to tree
    if (comment.targetType !== "Comment") return [{ ...comment, replies }, ...tree];

    // If it's a reply (targetType === "Comment"), find parent and insert
    return tree.map((c) => {
      const cReplies = Array.isArray(c.replies) ? c.replies : [];
      if (c._id === comment.targetId) {
        return { ...c, replies: [{ ...comment, replies }, ...cReplies] };
      }
      if (cReplies.length > 0) {
        return { ...c, replies: insertCommentToTree(cReplies, comment) };
      }
      return c;
    });
  }, []);

  // 📌 Generic fetch for any target
  const fetchCommentsByTarget = useCallback(async (targetId, targetType = 'Post') => {
    if (!setIsLoading || !setComments)
      return console.error("setIsLoading or setComments not provided");

    setIsLoading(true);
    try {
      const res = await api.get(`/comment/${targetType}/${targetId}`);
      setComments(res.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      if (showAlert) showAlert(err?.response?.data?.message || "Failed to load comments.", 'error');
    } finally {
      setIsLoading(false);
    }
  }, [setComments, setIsLoading, showAlert]);

  // ➕ Generic Add Comment (supports Post, Reel, Comment)
  const AddComment = useCallback(async (text, targetId, targetType = 'Post') => {
    if (!checkUserStatus("add comments", showAlert, user)) return;

    try {
      const res = await api.post('/comment', { text, targetId, targetType });

      const newComment = {
        ...res.data.comment,
        replies: res.data.comment.replies || [],
      };

      setComments((prev) => insertCommentToTree(prev, newComment));
      if (showAlert) showAlert(targetType === "Comment" ? "Reply added successfully." : "Comment added successfully.", 'success');

      return newComment;
    } catch (err) {
      if (showAlert) showAlert(err?.response?.data?.message || "Failed to upload comment.", 'error');
      throw err;
    }
  }, [user, showAlert, setComments, insertCommentToTree]);

  // 🗑️ Delete Comment
  const deleteComment = useCallback(async (id) => {
    if (!checkUserStatus("delete comments", showAlert, user)) return;

    try {
      const res = await api.delete(`/comment/${id}`);
      if (showAlert) showAlert(res.data.message, 'success');
      setComments((prev) => deleteCommentFromTree(prev, id));
      return res.data;
    } catch (err) {
      console.error(err);
      if (showAlert) showAlert(err?.response?.data?.message || "Failed to delete comment.", 'error');
    }
  }, [user, showAlert, setComments, deleteCommentFromTree]);

  // ✏️ Update Comment
  const updateComment = useCallback(async (id, text) => {
    if (!checkUserStatus("update comments", showAlert, user)) return;

    try {
      const res = await api.put(`/comment/update/${id}`, { text });

      const updatedComment = res.data.comment;
      setComments((prev) => updateCommentInTree(prev, updatedComment));
      if (showAlert) showAlert("Comment updated successfully.", 'success');
      return updatedComment;
    } catch (err) {
      console.error(err);
      if (showAlert) showAlert(err?.response?.data?.message || "Failed to update comment.", 'error');
    }
  }, [user, showAlert, setComments, updateCommentInTree]);

  return {
    fetchCommentsByPostId: fetchCommentsByTarget,
    fetchCommentsByTarget,
    AddComment,
    deleteComment,
    updateComment,
    updateCommentInTree
  };
};
