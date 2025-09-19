'use client';

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { useNotify } from "./NotifyContext";
import { checkUserStatus } from "../utils/checkUserLog";

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user , isLogin } = useAuth();
  const { showAlert } = useAlert();
  const { addNotify } = useNotify();
  const [imageView , setImageView] = useState(null);
  const [showPostModelEdit, setShowPostModelEdit] = useState(false);
  const [postIsEdit, setPostIsEdit] = useState(null);
  // ✅ تحميل البوستات أول مرة
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ✅ إضافة بوست جديد
  const AddPost = async (content, images, Hashtags, communityId, mentions = []) => {
    if (!checkUserStatus("Add Post",showAlert,user)) return;
    const formData = new FormData();
    formData.append("text", content);

    images.forEach(img => formData.append("image", img.file));
    Hashtags.forEach(tag => formData.append("Hashtags", tag));

    if (communityId) formData.append("community", communityId);

    // ✅ إضافة mentions
    if (mentions.length > 0) formData.append("mentions", JSON.stringify(mentions));

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newPost = res.data;

      showAlert("Post added successfully.");
      setPosts(prev => [newPost, ...prev]);

      // ✅ إرسال Notifications لليوزرز المذكورين
      if (mentions.length > 0) {
        mentions.forEach(m => {
          addNotify({
            content: `${user.username} mentioned you in a post`,
            type: "mention",
            receiverId: m._id,   // لازم يكون عندك الـ _id مش بس username
            actionRef: newPost._id,
            actionModel: "Post",
          });
        });
      }
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || "Failed to upload post.");
    }
  };

  // ✅ حذف بوست
  const deletePost = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/${id}`,
        { headers: { authorization: `Bearer ${user.token}` } }
      );

      showAlert(res.data.message);
      setPosts(prev => prev.filter(p => p._id !== id)); // ✅ تحديث فوري

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ لايك
  const likePost = async (postId, postOwnerId) => {
    if (!checkUserStatus("like Post",showAlert,user)) return;
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      showAlert(res.data.message);

      // تحديث اللايكات في state
      setPosts(prev =>
      prev.map(p =>
        p._id === res.data._id ? res.data : p
      )
    );

      // إشعار
      if (res.data.message === "Post Liked" && postOwnerId !== user._id) {
        await addNotify({
          content: `${user.username} liked your post`,
          type: "like",
          receiverId: postOwnerId,
          actionRef: postId,
          actionModel: "Post",
        });
      }

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ حفظ بوست
  const savePost = async (id) => {
    if (!checkUserStatus("Save Post",showAlert,user)) return;
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/save/${id}`,
        {},
        { headers: { authorization: `Bearer ${user.token}` } }
      );

      setPosts(prev =>
        prev.map(p =>
          p._id === res.data._id ? res.data : p
        )
      );

      showAlert("Post saved successfully.");
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ مشاركة بوست
  const sharePost = async (id, postOwnerId, customText = "") => {
    if (!checkUserStatus("Share Post",showAlert,user)) return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/share/${id}`,
        { customText }, // ✅ إضافة النص هنا
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      showAlert("Post shared successfully.");
      setPosts(prev => [res.data, ...prev]); // ✅ تحديث فوري

      if (postOwnerId !== user._id) {
        await addNotify({
          content: `${user.username} shared your post`,
          type: "share",
          receiverId: postOwnerId,
          actionRef: id,
          actionModel: "Post",
        });
      }
    } catch (err) {
      console.log(err);
      showAlert("Failed to share the post.");
    }
  };


  // ✅ تعديل بوست
  const editPost = async (id, { text, community, Hashtags, existingPhotos, newPhotos, mentions = [] }) => {
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (community) formData.append('community', community);
      if (Hashtags && Hashtags.length > 0) {
        formData.append('Hashtags', JSON.stringify(Hashtags));
      }
      formData.append('existingPhotos', JSON.stringify(existingPhotos));

      // ✅ mentions
      if (mentions.length > 0) formData.append('mentions', JSON.stringify(mentions));

      if (newPhotos && newPhotos.length > 0) {
        newPhotos.forEach(photo => {
          formData.append('newPhotos', photo);
        });
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/edit/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updatedPost = res.data;
      showAlert("Post edited successfully.");

      setPosts(prev =>
        prev.map(p =>
          p._id === id ? updatedPost : p
        )
      );

    } catch (err) {
      console.error(err);
      showAlert("Failed to edit the post.");
    }
  };



  // ✅ إظهار/إخفاء التعليقات
  const displayOrHideComments = async (postId) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/commentsOff/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data?.message) {
        showAlert(response.data.message);
      }

      // تحديث حالة التعليقات في state
      setPosts(prev =>
        prev.map(p =>
          p._id === postId ? { ...p, isCommentOff: !p.isCommentOff } : p
        )
      );

      return response.data;
    } catch (err) {
      console.error("فشل في تبديل حالة التعليقات:", err);
    }
  };

  // ✅ نسخ رابط البوست
  const copyPostLink = (postId) => {
    const link = `${window.location.origin}/Pages/Post/${postId}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        showAlert("Link copied to clipboard.");
      })
      .catch(() => {
        showAlert("Failed to copy link.");
      });
  };

  const viewPost = async (postId) => {
    if (!user?.token) {
      console.log("User is not logged in.");
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/view/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setPosts(prev =>
        prev.map(p =>
          p._id === postId ? res.data.post : p
        )
      );

      return res.data.post;
    } catch (err) {
      console.error("Failed to register post view:", err);
    }
  };


  return (
    <PostContext.Provider
      value={{
        posts,
        AddPost,
        deletePost,
        likePost,
        savePost,
        sharePost,
        isLoading,
        editPost,
        showPostModelEdit,
        setShowPostModelEdit,
        postIsEdit,
        setPostIsEdit,
        displayOrHideComments,
        copyPostLink,
        imageView , setImageView, viewPost
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  return useContext(PostContext);
};
// 'use client';

// import axios from "axios";
// import { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "./AuthContext";
// import { useAlert } from "./AlertContext";
// import { useNotify } from "./NotifyContext";

// export const PostContext = createContext();

// export const PostContextProvider = ({ children }) => {
//   const [posts, setPosts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const { user } = useAuth();
//   const { showAlert } = useAlert();
//   const { addNotify } = useNotify();
//   const [imageView, setImageView] = useState(null);
//   const [showPostModelEdit, setShowPostModelEdit] = useState(false);
//   const [postIsEdit, setPostIsEdit] = useState(null);

//   // ✅ Helper function لتقليل التكرار
//   const checkUserAction = (action) => {
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

//   // ✅ تحميل البوستات للجميع (مسجلين وغير مسجلين)
//   useEffect(() => {
//     const fetchPosts = async () => {
//       setIsLoading(true);
//       try {
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post`);
//         setPosts(res.data || []);
//       } catch (err) {
//         console.error("Error fetching posts", err);
//         showAlert("Failed to fetch posts.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPosts();
//   }, []);

//   // لا نحتاج مسح البوستات بعد logout، نتركهم للعرض العام

//   // ✅ الإجراءات التي تتطلب تسجيل دخول
//   const AddPost = async (content, images, Hashtags, communityId, mentions = []) => {
//     if (!checkUserAction("add posts")) return;

//     const formData = new FormData();
//     formData.append("text", content);
//     images.forEach(img => formData.append("image", img.file));
//     Hashtags.forEach(tag => formData.append("Hashtags", tag));
//     if (communityId) formData.append("community", communityId);
//     if (mentions.length > 0) formData.append("mentions", JSON.stringify(mentions));

//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/add`,
//         formData,
//         { headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "multipart/form-data" } }
//       );
//       showAlert("Post added successfully.");
//       setPosts(prev => [res.data, ...prev]);
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to upload post.");
//     }
//   };

//   const deletePost = async (id) => {
//     if (!checkUserAction("delete posts")) return;
//     try {
//       const res = await axios.delete(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/${id}`,
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       showAlert(res.data.message);
//       setPosts(prev => prev.filter(p => p._id !== id));
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to delete post.");
//     }
//   };

//   const likePost = async (postId, postOwnerId) => {
//     if (!checkUserAction("like posts")) return;
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/like/${postId}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       showAlert(res.data.message);
//       setPosts(prev => prev.map(p => (p._id === res.data._id ? res.data : p)));

//       if (res.data.message === "Post Liked" && postOwnerId !== user._id) {
//         await addNotify({
//           content: `${user.username} liked your post`,
//           type: "like",
//           receiverId: postOwnerId,
//           actionRef: postId,
//           actionModel: "Post",
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to like post.");
//     }
//   };

//   const savePost = async (id) => {
//     if (!checkUserAction("save posts")) return;
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/save/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       setPosts(prev => prev.map(p => (p._id === res.data._id ? res.data : p)));
//       showAlert("Post saved successfully.");
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to save post.");
//     }
//   };

//   const sharePost = async (id, postOwnerId) => {
//     if (!checkUserAction("share posts")) return;
//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/share/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       showAlert("Post shared successfully.");
//       setPosts(prev => [res.data, ...prev]);

//       if (postOwnerId !== user._id) {
//         await addNotify({
//           content: `${user.username} shared your post`,
//           type: "share",
//           receiverId: postOwnerId,
//           actionRef: id,
//           actionModel: "Post",
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to share post.");
//     }
//   };

//   const editPost = async (id, { text, community, Hashtags, existingPhotos, newPhotos, mentions = [] }) => {
//     if (!checkUserAction("edit posts")) return;

//     try {
//       const formData = new FormData();
//       formData.append("text", text);
//       if (community) formData.append("community", community);
//       if (Hashtags?.length > 0) formData.append("Hashtags", JSON.stringify(Hashtags));
//       formData.append("existingPhotos", JSON.stringify(existingPhotos));
//       if (mentions.length > 0) formData.append("mentions", JSON.stringify(mentions));
//       if (newPhotos?.length > 0) newPhotos.forEach(photo => formData.append("newPhotos", photo));

//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/edit/${id}`,
//         formData,
//         { headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "multipart/form-data" } }
//       );

//       showAlert("Post edited successfully.");
//       setPosts(prev => prev.map(p => (p._id === id ? res.data : p)));
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to edit post.");
//     }
//   };

//   const displayOrHideComments = async (postId) => {
//     if (!checkUserAction("toggle comments")) return;
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/commentsOff/${postId}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       if (res.data?.message) showAlert(res.data.message);
//       setPosts(prev => prev.map(p => (p._id === postId ? { ...p, isCommentOff: !p.isCommentOff } : p)));
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "Failed to toggle comments.");
//     }
//   };

//   const copyPostLink = (postId) => {
//     const link = `${window.location.origin}/Pages/Post/${postId}`;
//     navigator.clipboard.writeText(link)
//       .then(() => showAlert("Link copied to clipboard."))
//       .catch(() => showAlert("Failed to copy link."));
//   };

//   return (
//     <PostContext.Provider
//       value={{
//         posts,
//         AddPost,
//         deletePost,
//         likePost,
//         savePost,
//         sharePost,
//         isLoading,
//         editPost,
//         showPostModelEdit,
//         setShowPostModelEdit,
//         postIsEdit,
//         setPostIsEdit,
//         displayOrHideComments,
//         copyPostLink,
//         imageView,
//         setImageView,
//       }}
//     >
//       {children}
//     </PostContext.Provider>
//   );
// };

// export const usePost = () => useContext(PostContext);
