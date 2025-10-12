import axios from "axios";
import { checkUserStatus } from "@/utils/checkUserStatus";

export const usePostActions = ({ user, showAlert, setPosts, setIsLoading }) => {
  const headers = { Authorization: `Bearer ${user?.token}` };

  const updatePostInState = (updatedPost) =>
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));

  const deletePost = async (id) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/${id}`, { headers });
      showAlert(res.data.message);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const likePost = async (postId) => {
    if (!checkUserStatus("like Post", showAlert, user)) return;
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/like/${postId}`, {}, { headers });
      showAlert(res.data.message || "You liked this post.");
      updatePostInState(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const hahaPost = async (postId) => {
    if (!checkUserStatus("Haha Post", showAlert, user)) return;
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/haha/${postId}`, {}, { headers });
      showAlert(res.data.message || "You hahad this post.");
      updatePostInState(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const savePost = async (id) => {
    if (!checkUserStatus("Save Post", showAlert, user)) return;
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/save/${id}`, {}, { headers });
      updatePostInState(res.data);
      showAlert("Post saved successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  const sharePost = async (id, postOwnerId, customText = "") => {
    if (!checkUserStatus("Share Post", showAlert, user)) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/share/${id}`,
        { customText },
        { headers }
      );
      showAlert("Post shared successfully.");
      setPosts((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      showAlert("Failed to share the post.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayOrHideComments = async (postId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/commentsOff/${postId}`,
        {},
        { headers }
      );
      if (res.data?.message) showAlert(res.data.message);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, isCommentOff: !p.isCommentOff } : p))
      );
    } catch (err) {
      console.error("فشل في تبديل حالة التعليقات:", err);
    }
  };

  const copyPostLink = (postId) => {
    const link = `${window.location.origin}/Pages/Post/${postId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => showAlert("Link copied to clipboard."))
      .catch(() => showAlert("Failed to copy link."));
  };

  const viewPost = async (postId) => {
    if (!user?.token) return console.log("User is not logged in.");
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/view/${postId}`, {}, { headers });
      updatePostInState(res.data.post);
      return res.data.post;
    } catch (err) {
      console.error("Failed to register post view:", err);
    }
  };

  return {
    likePost,
    hahaPost,
    savePost,
    deletePost,
    sharePost,
    displayOrHideComments,
    viewPost,
    copyPostLink,
  };
};
