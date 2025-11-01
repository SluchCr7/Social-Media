import axios from "axios";
import { checkUserStatus } from "@/app/utils/checkUserLog";

export const useCommentModify = ({
  user,
  showAlert,
  setComments,
  setIsLoading,
}) => {
  const headers = { Authorization: `Bearer ${user?.token}` };

  // 📌 جلب التعليقات لبوست معين
  const fetchCommentsByPostId = async (postId) => {
    if (!setIsLoading || !setComments)
      return console.error("setIsLoading or setComments not provided");

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/post/${postId}`
      );
      setComments(res.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      showAlert(err?.response?.data?.message || "Failed to load comments.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 تحديث كومنت داخل tree
  const updateCommentInTree = (list, updatedComment) => {
    return list.map((c) => {
      if (c._id === updatedComment._id) return updatedComment;
      if (c.replies?.length > 0) {
        return { ...c, replies: updateCommentInTree(c.replies, updatedComment) };
      }
      return c;
    });
  };

  // 🔹 حذف كومنت من tree
  const deleteCommentFromTree = (list, idToDelete) => {
    return list
      .filter((c) => c._id !== idToDelete)
      .map((c) => ({
        ...c,
        replies: c.replies ? deleteCommentFromTree(c.replies, idToDelete) : [],
      }));
  };

  // 🔹 إدراج كومنت جديد في tree
  const insertCommentToTree = (tree, comment) => {
    const replies = Array.isArray(comment.replies) ? comment.replies : [];

    if (!comment.parent) return [{ ...comment, replies }, ...tree];

    return tree.map((c) => {
      const cReplies = Array.isArray(c.replies) ? c.replies : [];
      if (c._id === comment.parent) {
        return { ...c, replies: [{ ...comment, replies }, ...cReplies] };
      }
      if (cReplies.length > 0) {
        return { ...c, replies: insertCommentToTree(cReplies, comment) };
      }
      return c;
    });
  };

  // ➕ إضافة كومنت
  const AddComment = async (text, postId, receiverId, parent = null) => {
    if (!checkUserStatus("add comments", showAlert, user)) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${postId}`,
        { text, parent },
        { headers }
      );

      const newComment = {
        ...res.data.comment,
        replies: res.data.comment.replies || [],
      };

      setComments((prev) => insertCommentToTree(prev, newComment));
      showAlert("Comment added successfully.");

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
