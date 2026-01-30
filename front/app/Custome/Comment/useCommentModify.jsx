import axios from "axios";
import { checkUserStatus } from "@/app/utils/checkUserLog";

export const useCommentModify = ({
  user,
  showAlert,
  setComments,
  setIsLoading,
}) => {
  const headers = { Authorization: `Bearer ${user?.token}` };

  // 📌 Generic fetch for any target
  const fetchCommentsByTarget = async (targetId, targetType = 'Post') => {
    if (!setIsLoading || !setComments)
      return console.error("setIsLoading or setComments not provided");

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${targetType}/${targetId}`
      );
      setComments(res.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      showAlert(err?.response?.data?.message || "Failed to load comments.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Update comment inside tree (recursive)
  const updateCommentInTree = (list, updatedComment) => {
    return list.map((c) => {
      if (c._id === updatedComment._id) return { ...updatedComment, replies: c.replies || [] };
      if (c.replies?.length > 0) {
        return { ...c, replies: updateCommentInTree(c.replies, updatedComment) };
      }
      return c;
    });
  };

  // 🔹 Delete comment from tree (recursive)
  const deleteCommentFromTree = (list, idToDelete) => {
    return list
      .filter((c) => c._id !== idToDelete)
      .map((c) => ({
        ...c,
        replies: c.replies ? deleteCommentFromTree(c.replies, idToDelete) : [],
      }));
  };

  // 🔹 Insert new comment/reply into tree
  const insertCommentToTree = (tree, comment) => {
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
  };

  // ➕ Generic Add Comment (supports Post, Reel, Comment)
  const AddComment = async (text, targetId, targetType = 'Post') => {
    if (!checkUserStatus("add comments", showAlert, user)) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment`,
        { text, targetId, targetType },
        { headers }
      );

      const newComment = {
        ...res.data.comment,
        replies: res.data.comment.replies || [],
      };

      setComments((prev) => insertCommentToTree(prev, newComment));
      showAlert(targetType === "Comment" ? "Reply added successfully." : "Comment added successfully.");

      return newComment;
    } catch (err) {
      showAlert(err?.response?.data?.message || "Failed to upload comment.");
      throw err;
    }
  };

  // 🗑️ حذف كومنت
  const deleteComment = async (id) => {
    if (!checkUserStatus("delete comments", showAlert, user)) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${id}`,
        { headers }
      );
      showAlert(res.data.message);
      setComments((prev) => deleteCommentFromTree(prev, id));
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || "Failed to delete comment.");
    }
  };

  // ✏️ تعديل كومنت
  const updateComment = async (id, text) => {
    if (!checkUserStatus("update comments", showAlert, user)) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/update/${id}`,
        { text },
        { headers }
      );

      const updatedComment = res.data.comment;
      setComments((prev) => updateCommentInTree(prev, updatedComment));
      showAlert("Comment updated successfully.");
      return updatedComment;
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || "Failed to update comment.");
    }
  };

  return {
    fetchCommentsByPostId,
    AddComment,
    deleteComment,
    updateComment,
    updateCommentInTree
  };
};
