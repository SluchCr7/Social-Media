// 'use client';

// import axios from 'axios';
// import { createContext, useContext, useState } from 'react';
// import { useAuth } from './AuthContext';
// import { useNotify } from './NotifyContext';
// import { useAlert } from './AlertContext';

// export const CommentContext = createContext();
// export const useComment = () => useContext(CommentContext);

// export const CommentContextProvider = ({ children }) => {
//   const [comments, setcomments] = useState([]);
//   const { user } = useAuth();
//   const { addNotify } = useNotify();
//   const { showAlert } = useAlert();
//   const [isLoading, setIsLoading] = useState(false);

//   // 🔹 دالة مساعدة: تحقق من حالة الحساب
//   const checkUserStatus = (action = "perform this action") => {
//     if (!user || !user.token) {
//       showAlert(`You must be logged in to ${action}.`);
//       return false;
//     }
//     if (user?.accountStatus === "banned" || user?.accountStatus === "suspended") {
//       showAlert(`Your account is suspended. You cannot ${action}.`);
//       return false;
//     }
//     return true;
//   };

//   // 📌 جلب التعليقات لبوست معين
//   const fetchCommentsByPostId = async (postId) => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/post/${postId}`);
//       setcomments(res.data);
//     } catch (err) {
//       console.error('Error fetching comments:', err);
//       showAlert(err?.response?.data?.message || "Failed to load comments.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 📌 إضافة كومنت
//   const AddComment = async (text, postId, receiverId, parent = null) => {
//     if (!checkUserStatus("add comments")) return;

//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${postId}`,
//         { text, parent },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       const newComment = res.data.comment;
//       setcomments((prev) => [newComment, ...prev]);
//       showAlert('Comment added successfully.');

//       if (user._id !== receiverId) {
//         await addNotify({
//           content: `${user.username} commented on your post`,
//           type: 'comment',
//           receiverId,
//           actionRef: newComment._id,
//           actionModel: 'Comment',
//         });
//       }

//       return newComment;
//     } catch (err) {
//       showAlert(err?.response?.data?.message || 'Failed to upload comment.');
//       throw err;
//     }
//   };

//   // 📌 حذف كومنت
//   const deleteComment = async (id) => {
//     if (!checkUserStatus("delete comments")) return;

//     try {
//       const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${id}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       showAlert(res.data.message);
//       setcomments((prev) => prev.filter((c) => c._id !== id));
//       return res.data;
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to delete comment.");
//     }
//   };

//   // 📌 تعديل كومنت
//   const updateComment = async (id, text) => {
//     if (!checkUserStatus("update comments")) return;

//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/update/${id}`,
//         { text },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       const updatedComment = res.data.comment;
//       setcomments((prev) =>
//         prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
//       );

//       showAlert('Comment updated successfully.');
//       return updatedComment;
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to update comment.");
//     }
//   };

//   // 📌 لايك على كومنت
//   const likeComment = async (id) => {
//     if (!checkUserStatus("like comments")) return;

//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/like/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       const updatedComment = res.data.comment;
//       setcomments((prev) =>
//         prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
//       );

//       showAlert(res.data.message);
//       return updatedComment;
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to like comment.");
//     }
//   };

//   return (
//     <CommentContext.Provider
//       value={{
//         comments,
//         setcomments,
//         AddComment,
//         deleteComment,
//         likeComment,
//         updateComment,
//         fetchCommentsByPostId,
//         isLoading
//       }}
//     >
//       {children}
//     </CommentContext.Provider>
//   );
// };

'use client';

import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotify } from './NotifyContext';
import { useAlert } from './AlertContext';

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export const CommentContextProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  const { addNotify } = useNotify();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 دالة مساعدة: تحقق من حالة الحساب
  const checkUserStatus = (action = "perform this action") => {
    if (!user || !user.token) {
      showAlert(`You must be logged in to ${action}.`);
      return false;
    }
    if (user?.accountStatus === "banned" || user?.accountStatus === "suspended") {
      showAlert(`Your account is suspended. You cannot ${action}.`);
      return false;
    }
    return true;
  };

  // 📌 جلب التعليقات لبوست معين
  const fetchCommentsByPostId = async (postId) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/post/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      showAlert(err?.response?.data?.message || "Failed to load comments.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 دالة مساعدة: تحديث كومنت داخل parent recursively
  const updateCommentInTree = (list, updatedComment) => {
    return list.map(c => {
      if (c._id === updatedComment._id) return updatedComment;
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: updateCommentInTree(c.replies, updatedComment) };
      }
      return c;
    });
  };

  // 🔹 دالة مساعدة: حذف كومنت وكل replies recursively
  const deleteCommentFromTree = (list, idToDelete) => {
    return list
      .filter(c => c._id !== idToDelete)
      .map(c => ({
        ...c,
        replies: c.replies ? deleteCommentFromTree(c.replies, idToDelete) : []
      }));
  };

  // 📌 إضافة كومنت
  const AddComment = async (text, postId, receiverId, parent = null) => {
    if (!checkUserStatus("add comments")) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${postId}`,
        { text, parent },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const newComment = res.data.comment;

      // تحديث الـ state مع مراعاة nested comments
      if (parent) {
        setComments(prev =>
          prev.map(c => {
            if (c._id === parent) {
              return { ...c, replies: [newComment, ...(c.replies || [])] };
            } else if (c.replies && c.replies.length > 0) {
              return { ...c, replies: updateCommentInTree(c.replies, newComment) };
            }
            return c;
          })
        );
      } else {
        setComments(prev => [newComment, ...prev]);
      }

      showAlert('Comment added successfully.');

      // إرسال إشعار إذا ليس كومنت على نفسك
      if (user._id !== receiverId) {
        await addNotify({
          content: `${user.username} commented on your post`,
          type: 'comment',
          receiverId,
          actionRef: newComment._id,
          actionModel: 'Comment',
        });
      }

      return newComment;
    } catch (err) {
      showAlert(err?.response?.data?.message || 'Failed to upload comment.');
      throw err;
    }
  };

  // 📌 حذف كومنت
  const deleteComment = async (id) => {
    if (!checkUserStatus("delete comments")) return;

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      showAlert(res.data.message);
      setComments(prev => deleteCommentFromTree(prev, id));
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || "Failed to delete comment.");
    }
  };

  // 📌 تعديل كومنت
  const updateComment = async (id, text) => {
    if (!checkUserStatus("update comments")) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/update/${id}`,
        { text },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updatedComment = res.data.comment;
      setComments(prev => updateCommentInTree(prev, updatedComment));

      showAlert('Comment updated successfully.');
      return updatedComment;
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || "Failed to update comment.");
    }
  };

  // 📌 لايك على كومنت
  const likeComment = async (id) => {
    if (!checkUserStatus("like comments")) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updatedComment = res.data.comment;
      setComments(prev => updateCommentInTree(prev, updatedComment));

      showAlert(res.data.message);
      return updatedComment;
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || "Failed to like comment.");
    }
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        setComments,
        AddComment,
        deleteComment,
        likeComment,
        updateComment,
        fetchCommentsByPostId,
        isLoading
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
