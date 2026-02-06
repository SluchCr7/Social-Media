
'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { useNotify } from "./NotifyContext";
import { checkUserStatus } from "../utils/checkUserLog";
import { useSocket } from "./SocketContext";

export const ReelsContext = createContext();

export const ReelsProvider = ({ children }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { addNotify } = useNotify();
  const { socket } = useSocket();

  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showModelAddReel, setShowModelAddReel] = useState(false);

  // 🎯 جلب الريلز مع pagination
  const fetchReels = useCallback(async (pageNum = 1) => {
    if (!hasMore && pageNum !== 1) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/reel?page=${pageNum}&limit=10`);
      const newReels = Array.isArray(res.data.reels) ? res.data.reels : [];
      setReels(prev => (pageNum === 1 ? newReels : [...prev, ...newReels]));
      setHasMore(pageNum < res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore]);

  // ✅ تحميل أول مرة
  useEffect(() => {
    fetchReels(page);
  }, [page, fetchReels]);

  // 🔔 Socket Listeners
  useEffect(() => {
    if (!socket) return;

    const handleCreate = (newReel) => {
      const currentUserId = user?._id?.toString();
      const ownerId = newReel?.owner?._id?.toString() || newReel?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return; // Handled by Upload
      setReels(prev => [newReel, ...prev]);
    };

    const handleUpdate = (updated) => {
      setReels(prev => prev.map(r => r._id === updated._id ? updated : r));
    };

    const handleDelete = (id) => {
      setReels(prev => prev.filter(r => r._id !== id));
    };

    socket.on("reel:create", handleCreate);
    socket.on("reel:update", handleUpdate);
    socket.on("reel:delete", handleDelete);

    return () => {
      socket.off("reel:create", handleCreate);
      socket.off("reel:update", handleUpdate);
      socket.off("reel:delete", handleDelete);
    };
  }, [socket, user]);

  // 🎥 رفع Reel جديد
  const uploadReel = useCallback(async (file, caption = "") => {
    if (!user?.token) return showAlert("You must be logged in to upload a reel.");

    // Optimistic UI (Temp Reel)
    const tempId = `temp-${Date.now()}`;
    const tempReel = {
      _id: tempId,
      videoUrl: URL.createObjectURL(file), // Local blob
      thumbnailUrl: URL.createObjectURL(file), // Use video as thumb for now
      caption,
      owner: user,
      likes: [],
      views: [],
      comments: [],
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };

    setReels(prev => [tempReel, ...prev]);
    setShowModelAddReel(false); // Close modal immediately
    showAlert("Uploading reel...", 'loading');

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

      const realReel = res.data.reel || res.data;
      // Replace temp
      setReels(prev => prev.map(r => r._id === tempId ? realReel : r));
      showAlert("Reel uploaded successfully!", 'success');
    } catch (err) {
      console.error(err);
      // Remove temp
      setReels(prev => prev.filter(r => r._id !== tempId));
      showAlert(err?.response?.data?.message || "Failed to upload reel.", 'error');
    }
  }, [user, showAlert, setShowModelAddReel]);

  // 🗑️ حذف Reel
  const deleteReel = useCallback(async (id) => {
    if (!user?.token) return;

    // Optimistic Delete
    setReels(prev => prev.filter(r => r._id !== id));

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
      // Revert if needed, but risky to restore deleted. Just show error.
      showAlert("Failed to delete reel.");
    }
  }, [user, showAlert]);

  // ❤️ لايك / أنلايك على Reel
  const likeReel = useCallback(async (id) => {
    if (!user?.token) return;

    // Optimistic Like
    setReels(prev => prev.map(r => {
      if (r._id === id) {
        const isLiked = r.likes.includes(user._id);
        const newLikes = isLiked
          ? r.likes.filter(uid => uid !== user._id)
          : [...r.likes, user._id];
        return { ...r, likes: newLikes };
      }
      return r;
    }));

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updated = res.data;
      setReels(prev => prev.map(r => (r?._id === id ? updated : r)));
      // showAlert(res.data.message || "You like this Reel "); // optional toast
    } catch (err) {
      console.error(err);
      showAlert("Failed to like reel.");
      // Revert could be here
    }
  }, [user, showAlert]);

  // 👁️ زيادة المشاهدات
  const viewReel = useCallback(async (id) => {
    if (!user?.token) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/view/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updated = res.data;
      setReels(prev => prev.map(r => (r?._id === id ? updated : r)));
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  // 📤 مشاركة Reel
  const shareReel = useCallback(async (id, ReelOwnerId) => {
    if (!checkUserStatus("Share Reel", showAlert, user)) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/reel/share/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      showAlert("✅ Reel shared successfully.");
      setReels(prev => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      showAlert("❌ Failed to share the Reel.");
    }
  }, [user, showAlert]);

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
    [isLoading, hasMore, page, fetchReels]
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
        shareReel,
        showModelAddReel,
        setShowModelAddReel
      }}
    >
      {children}
    </ReelsContext.Provider>
  );
};

export const useReels = () => useContext(ReelsContext);
