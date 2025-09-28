// 'use client';

// import axios from 'axios';
// import { createContext, useContext, useState } from 'react';
// import { useAuth } from './AuthContext';
// import { useNotify } from './NotifyContext';
// import { useAlert } from './AlertContext';
// import { checkUserStatus } from '../utils/checkUserLog';
// export const CommentContext = createContext();
// export const useComment = () => useContext(CommentContext);

// export const CommentContextProvider = ({ children }) => {
  
//   const [comments, setComments] = useState([]);
//   const { user } = useAuth();
//   const { addNotify } = useNotify();
//   const { showAlert } = useAlert();
//   const [isLoading, setIsLoading] = useState(false);


//   // 📌 جلب التعليقات لبوست معين
//   const fetchCommentsByPostId = async (postId) => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/post/${postId}`);
//       setComments(res.data);
//     } catch (err) {
//       console.error('Error fetching comments:', err);
//       showAlert(err?.response?.data?.message || "Failed to load comments.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//     // 📌 جلب التعليقات لبوست معين (مع pagination)

//   // 🔹 دالة مساعدة: تحديث كومنت داخل tree recursively
//   const updateCommentInTree = (list, updatedComment) => {
//     return list.map(c => {
//       if (c._id === updatedComment._id) return updatedComment;
//       if (c.replies && c.replies.length > 0) {
//         return { ...c, replies: updateCommentInTree(c.replies, updatedComment) };
//       }
//       return c;
//     });
//   };

//   // 🔹 دالة مساعدة: حذف كومنت وكل replies recursively
//   const deleteCommentFromTree = (list, idToDelete) => {
//     return list
//       .filter(c => c._id !== idToDelete)
//       .map(c => ({
//         ...c,
//         replies: c.replies ? deleteCommentFromTree(c.replies, idToDelete) : []
//       }));
//   };

//   const insertCommentToTree = (tree, comment) => {
//     const replies = Array.isArray(comment.replies) ? comment.replies : [];

//     if (!comment.parent) return [{ ...comment, replies }, ...tree];

//     return tree.map(c => {
//       const cReplies = Array.isArray(c.replies) ? c.replies : [];
//       if (c._id === comment.parent) {
//         return { ...c, replies: [{ ...comment, replies }, ...cReplies] };
//       }
//       if (cReplies.length > 0) {
//         return { ...c, replies: insertCommentToTree(cReplies, comment) };
//       }
//       return c;
//     });
//   };

//   // إضافة كومنت
//   const AddComment = async (text, postId, receiverId, parent = null) => {
//     if (!checkUserStatus("add comments",showAlert,user)) return;

//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${postId}`,
//         { text, parent },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       const newComment = { ...res.data.comment, replies: res.data.comment.replies || [] };

//       setComments(prev => insertCommentToTree(prev, newComment));

//       showAlert('Comment added successfully.');

//       return newComment;
//     } catch (err) {
//       showAlert(err?.response?.data?.message || 'Failed to upload comment.');
//       throw err;
//     }
//   };

//   // 📌 حذف كومنت
//   const deleteComment = async (id) => {
//     if (!checkUserStatus("delete comments" ,showAlert,user)) return;

//     try {
//       const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${id}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       showAlert(res.data.message);
//       setComments(prev => deleteCommentFromTree(prev, id));
//       return res.data;
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to delete comment.");
//     }
//   };

//   // 📌 تعديل كومنت
//   const updateComment = async (id, text) => {
//     if (!checkUserStatus("update comments" ,showAlert,user)) return;

//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/update/${id}`,
//         { text },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       const updatedComment = res.data.comment;
//       setComments(prev => updateCommentInTree(prev, updatedComment));

//       showAlert('Comment updated successfully.');
//       return updatedComment;
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to update comment.");
//     }
//   };

//   // 📌 لايك على كومنت
//   const likeComment = async (id) => {
//     if (!checkUserStatus("like comments" ,showAlert,user)) return;

//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/like/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       const updatedComment = res.data.comment;
//       setComments(prev => updateCommentInTree(prev, updatedComment));

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
//         setComments,
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
import { checkUserStatus } from '../utils/checkUserLog';

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export const CommentContextProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { addNotify } = useNotify();
  const { showAlert } = useAlert();

  // 📌 جلب التعليقات لبوست معين (مع pagination)
  const fetchCommentsByPostId = async (postId, pageNum = 1, append = false) => {
    if (append && pages && pageNum > pages) return; // 🛑 مفيش صفحات تانية

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/post/${postId}?page=${pageNum}&limit=5`
      );

      const { nestedComments, page: currentPage, pages: totalPages } = res.data;

      if (append) {
        setComments(prev => {
          const existingIds = new Set(prev.map(c => c._id));
          const newOnes = nestedComments.filter(c => !existingIds.has(c._id));
          return [...prev, ...newOnes];
        });
      } else {
        setComments(nestedComments);
      }

      setPage(currentPage);
      setPages(totalPages);
    } catch (err) {
      console.error('Error fetching comments:', err);
      showAlert(err?.response?.data?.message || 'Failed to load comments.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 تحديث كومنت داخل tree recursively
  const updateCommentInTree = (list, updatedComment) => {
    return list.map(c => {
      if (c._id === updatedComment._id) return updatedComment;
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: updateCommentInTree(c.replies, updatedComment) };
      }
      return c;
    });
  };

  // 🔹 حذف كومنت وكل replies recursively
  const deleteCommentFromTree = (list, idToDelete) => {
    return list
      .filter(c => c._id !== idToDelete)
      .map(c => ({
        ...c,
        replies: c.replies ? deleteCommentFromTree(c.replies, idToDelete) : []
      }));
  };

  // 🔹 إدخال كومنت جديد في الشجرة
  const insertCommentToTree = (tree, comment) => {
    const replies = Array.isArray(comment.replies) ? comment.replies : [];

    if (!comment.parent) return [{ ...comment, replies }, ...tree];

    return tree.map(c => {
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

  // 📌 إضافة كومنت
  const AddComment = async (text, postId, receiverId, parent = null) => {
    if (!checkUserStatus('add comments', showAlert, user)) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${postId}`,
        { text, parent },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const newComment = { ...res.data.comment, replies: res.data.comment.replies || [] };
      setComments(prev => insertCommentToTree(prev, newComment));
      showAlert('Comment added successfully.');
      return newComment;
    } catch (err) {
      showAlert(err?.response?.data?.message || 'Failed to upload comment.');
      throw err;
    }
  };

  // 📌 حذف كومنت
  const deleteComment = async (id) => {
    if (!checkUserStatus('delete comments', showAlert, user)) return;

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      showAlert(res.data.message);
      setComments(prev => deleteCommentFromTree(prev, id));
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || 'Failed to delete comment.');
    }
  };

  // 📌 تعديل كومنت
  const updateComment = async (id, text) => {
    if (!checkUserStatus('update comments', showAlert, user)) return;

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
      showAlert(err?.response?.data?.message || 'Failed to update comment.');
    }
  };

  // 📌 لايك على كومنت
  const likeComment = async (id) => {
    if (!checkUserStatus('like comments', showAlert, user)) return;

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
      showAlert(err?.response?.data?.message || 'Failed to like comment.');
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
        isLoading,
        page,
        pages
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
