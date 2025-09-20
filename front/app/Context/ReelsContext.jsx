'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";

export const ReelsContext = createContext();

export const ReelsProvider = ({ children }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
      showAlert("Failed to fetch reels.");
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
      const updated = res.data.reel;
      setReels(prev => prev.map(r => (r._id === id ? updated : r)));
      showAlert(res.data.message || "Reel updated.");
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
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updated = res.data.reel;
      setReels(prev => prev.map(r => (r._id === id ? updated : r)));
    } catch (err) {
      console.error(err);
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
      }}
    >
      {children}
    </ReelsContext.Provider>
  );
};

export const useReels = () => useContext(ReelsContext);
