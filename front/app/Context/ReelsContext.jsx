'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { useNotify } from "./NotifyContext";
import { checkUserStatus } from "../utils/checkUserLog";

export const ReelsContext = createContext();

export const ReelsProvider = ({ children }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const {addNotify} = useNotify()
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showModelAddReel, setShowModelAddReel] = useState(false);
  // 🎯 جلب الريلز مع pagination
  const fetchReels = async (pageNum = 1) => {
    if (!hasMore && pageNum !== 1) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/reel?page=${pageNum}&limit=10`);
      const newReels = Array.isArray(res.data.reels) ? res.data.reels : [];

      setReels(prev => (pageNum === 1 ? newReels : [...prev, ...newReels]));
      setHasMore(pageNum < res.data.pages);
    } catch (err) {
      console.error(err);
      // showAlert("Failed to fetch reels.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ تحميل أول مرة
  useEffect(() => {
    fetchReels(page);
  }, [page]);

  // 🎥 رفع Reel جديد
  const uploadReel = async (file, caption = "") => {
    if (!user?.token) {
      showAlert("You must be logged in to upload a reel.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("caption", caption);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setReels(prev => [res.data.reel, ...prev]);
      showAlert("Reel uploaded successfully!");
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || "Failed to upload reel.");
    }
  };

  // 🗑️ حذف Reel
  const deleteReel = async (id) => {
    if (!user?.token) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReels(prev => prev.filter(r => r._id !== id));
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete reel.");
    }
  };

  // ❤️ لايك / أنلايك على Reel
  const likeReel = async (id) => {
    if (!user?.token) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updated = res.data;
      setReels(prev => prev.map(r => (r?._id === id ? updated : r)));
      showAlert(res.data.message || "You like this Reel ");
    } catch (err) {
      console.error(err);
      showAlert("Failed to like reel.");
    }
  };

  // 👁️ زيادة المشاهدات
  const viewReel = async (id) => {
    if (!user?.token) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/view/${id}`,
        {}, // لا حاجة لإرسال أي بيانات إضافية
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updated = res.data; // ملاحظة: السيرفر يرجع الـ reel مباشرة
      setReels(prev => prev.map(r => (r?._id === id ? updated : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const shareReel = async (id, ReelOwnerId) => {
    if (!checkUserStatus("Share Reel", showAlert, user)) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/share/${id}`,
        {}, // مفيش body هنا فخليته فاضي
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      showAlert("✅ Reel shared successfully.");
      setReels(prev => [res.data, ...prev]); // ✅ تحديث فوري للـ state

    } catch (err) {
      console.error(err);
      showAlert("❌ Failed to share the Reel.");
    }
  };


  // 🔍 Infinite Scroll
  const observer = useRef();
  const lastReelRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchReels(nextPage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page]
  );

  return (
    <ReelsContext.Provider
      value={{
        reels,
        fetchReels,
        uploadReel,
        deleteReel,
        likeReel,
        viewReel,
        isLoading,
        hasMore,
        lastReelRef,
        shareReel
        ,showModelAddReel, setShowModelAddReel
      }}
    >
      {children}
    </ReelsContext.Provider>
  );
};

export const useReels = () => useContext(ReelsContext);
// 'use client';

// import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
// import axios from "axios";
// import { useAuth } from "./AuthContext";
// import { useAlert } from "./AlertContext";
// import { useNotify } from "./NotifyContext";
// import { checkUserStatus } from "../utils/checkUserLog";

// export const ReelsContext = createContext();
// export const useReels = () => useContext(ReelsContext);

// export const ReelsProvider = ({ children }) => {
//   const { user } = useAuth();
//   const { showAlert } = useAlert();
//   const { addNotify } = useNotify();

//   const [reels, setReels] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showModelAddReel, setShowModelAddReel] = useState(false);

//   // 🎯 جلب الريلز (مع pagination)
//   const fetchReels = useCallback(async (pageNum = 1) => {
//     if (!hasMore && pageNum !== 1) return;

//     setIsLoading(true);
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/reel?page=${pageNum}&limit=10`);
//       const newReels = Array.isArray(res.data.reels) ? res.data.reels : [];
//       setReels((prev) => (pageNum === 1 ? newReels : [...prev, ...newReels]));
//       setHasMore(pageNum < res.data.pages);
//     } catch (err) {
//       console.error(err);
//       showAlert("❌ Failed to fetch reels.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [hasMore, showAlert]);

//   // ✅ تحميل أول مرة
//   useEffect(() => {
//     fetchReels(page);
//   }, [page, fetchReels]);

//   // 🎥 رفع Reel جديد
//   const uploadReel = useCallback(async (file, caption = "") => {
//     if (!checkUserStatus("Upload Reel", showAlert, user)) return;

//     try {
//       const formData = new FormData();
//       formData.append("video", file);
//       formData.append("caption", caption);

//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       const newReel = res.data.reel;
//       setReels((prev) => [newReel, ...prev]);
//       showAlert("✅ Reel uploaded successfully!");
//     } catch (err) {
//       console.error(err);
//       showAlert(err?.response?.data?.message || "❌ Failed to upload reel.");
//     }
//   }, [user, showAlert]);

//   // 🗑️ حذف Reel
//   const deleteReel = useCallback(async (id) => {
//     if (!checkUserStatus("Delete Reel", showAlert, user)) return;

//     try {
//       setReels((prev) => prev.filter((r) => r._id !== id)); // ✅ Optimistic UI
//       const res = await axios.delete(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/${id}`,
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       showAlert(res.data.message || "🗑️ Reel deleted.");
//     } catch (err) {
//       console.error(err);
//       showAlert("❌ Failed to delete reel.");
//     }
//   }, [user, showAlert]);

//   // ❤️ لايك / أنلايك
//   const likeReel = useCallback(async (id, reelOwnerId) => {
//     if (!checkUserStatus("Like Reel", showAlert, user)) return;

//     try {
//       // تحديث فوري مؤقت
//       setReels((prev) =>
//         prev.map((r) =>
//           r._id === id
//             ? {
//                 ...r,
//                 likes: r.likes.includes(user._id)
//                   ? r.likes.filter((uid) => uid !== user._id)
//                   : [...r.likes, user._id],
//               }
//             : r
//         )
//       );

//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/like/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       setReels((prev) =>
//         prev.map((r) => (r._id === id ? res.data : r))
//       );

//       // إشعار في حال كان الريل لشخص آخر
//       if (reelOwnerId && reelOwnerId !== user._id) {
//         addNotify({
//           receiverId: reelOwnerId,
//           type: "likeReel",
//           message: `${user.username} liked your reel.`,
//           reelId: id,
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("❌ Failed to like reel.");
//     }
//   }, [user, showAlert, addNotify]);

//   // 👁️ زيادة المشاهدات
//   const viewReel = useCallback(async (id) => {
//     if (!user?.token) return;
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/view/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       const updated = res.data;
//       setReels((prev) => prev.map((r) => (r._id === id ? updated : r)));
//     } catch (err) {
//       console.error("Failed to increase views", err);
//     }
//   }, [user]);

//   // 🔁 مشاركة الريل
//   const shareReel = useCallback(async (id, reelOwnerId) => {
//     if (!checkUserStatus("Share Reel", showAlert, user)) return;

//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/share/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       showAlert("✅ Reel shared successfully.");
//       setReels((prev) => [res.data, ...prev]);

//       if (reelOwnerId && reelOwnerId !== user._id) {
//         addNotify({
//           receiverId: reelOwnerId,
//           type: "shareReel",
//           message: `${user.username} shared your reel.`,
//           reelId: id,
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("❌ Failed to share the reel.");
//     }
//   }, [user, showAlert, addNotify]);

//   // 🔍 Infinite Scroll
//   const observer = useRef();
//   const lastReelRef = useCallback(
//     (node) => {
//       if (isLoading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore && !isLoading) {
//           const nextPage = page + 1;
//           setPage(nextPage);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [isLoading, hasMore, page]
//   );

//   return (
//     <ReelsContext.Provider
//       value={{
//         reels,
//         fetchReels,
//         uploadReel,
//         deleteReel,
//         likeReel,
//         viewReel,
//         shareReel,
//         isLoading,
//         hasMore,
//         lastReelRef,
//         showModelAddReel,
//         setShowModelAddReel,
//         setReels,
//       }}
//     >
//       {children}
//     </ReelsContext.Provider>
//   );
// };
