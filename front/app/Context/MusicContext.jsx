'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { useNotify } from "./NotifyContext";
import { usePost } from "./PostContext";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { addNotify } = useNotify();
  const [currentMusic , setCurrentMusic] = useState(null);
  const [music, setMusic] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showModelAddMusic, setShowModelAddMusic] = useState(false);
  const { setPosts } = usePost();
  // ✅ جلب الموسيقى مع pagination
  const fetchMusic = useCallback(async (pageNum = 1) => {
    if (!hasMore && pageNum !== 1) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music?page=${pageNum}&limit=10`
      );
      const newMusic = Array.isArray(res.data.music) ? res.data.music : [];

      setMusic(prev => (pageNum === 1 ? newMusic : [...prev, ...newMusic]));
      setHasMore(pageNum < res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, showAlert]);

  // ✅ تحميل أول مرة
  useEffect(() => {
    fetchMusic(page);
  }, [page, fetchMusic]);

  // 🎵 رفع موسيقى جديدة
  const uploadMusic = async (formData) => {
    try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/music`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    // تحديث state مباشرة بالموسيقى الجديدة
    setMusic(prev => [res.data, ...prev]);
    showAlert("Music uploaded successfully!");
  } catch (err) {
    console.error(err);
    showAlert(err?.response?.data?.message || "Failed to upload Music.");
  }
};
  // 🗑️ حذف موسيقى
  const deleteMusic = useCallback(async (id) => {
    if (!user?.token) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMusic(prev => prev.filter(r => r._id !== id));
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete Music.");
    }
  }, [user, showAlert]);

  // ❤️ لايك / إلغاء لايك
const likeMusic = useCallback(async (id) => {
  if (!user?.token) return;

  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/music/like/${id}`,
      {},
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    const { music, message } = res.data;

    // ✅ تحديث مباشر للحالة بدون refresh
    setMusic(prev =>
      prev.map(item => (item._id === music._id ? music : item))
    );

    // ✅ في حال الموسيقى غير موجودة (مثل عرض مفصل)، نضيفها مؤقتًا
    setMusic(prev => {
      if (!prev.find(m => m._id === music._id)) return [...prev, music];
      return prev;
    });

    showAlert(message || "Updated successfully");
  } catch (err) {
    console.error(err);
    showAlert("Failed to like music.");
  }
}, [user]);

  // 👁️ زيادة المشاهدات
  const viewMusic = useCallback(async (id) => {
    if (!user?.token) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music/view/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updated = res.data;
      setMusic(prev => prev.map(r => (r?._id === id ? updated : r)));
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  // 🎧 جلب أغنية معينة
  const getMusicFileById = useCallback(async (id) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/music/${id}`);
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  // 🔍 Infinite Scroll
  const observer = useRef();
  const lastMusicRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchMusic(nextPage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, fetchMusic]
  );

  const addListen = async (musicId) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/music/listen/${musicId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // تحديث الموسيقى في الـ state
      setMusic((prev) =>
        prev.map((m) => (m._id === data._id ? data : m))
      );
      return data;
    } catch (error) {
      console.error('Error adding listen:', error);
    }
  };
  const shareMusicAsPost = useCallback(async (musicId, customText = '') => {
    if (!user?.token) return showAlert('You must be logged in to share music as a post.');

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music/share/${musicId}`,
        { customText },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      // ✅ تحديث الـ state فورًا
      setPosts(prev => [data.post, ...prev])
      showAlert(message || "Shared successfully");
      return data.post
    } catch (error) {
      console.error('Error sharing music:', error)
      throw error
    }
  }, [user?.token])
  return (
    <MusicContext.Provider
      value={{
        music,
        fetchMusic,
        uploadMusic,
        deleteMusic,
        likeMusic,
        viewMusic,
        getMusicFileById,
        isLoading,
        hasMore,
        lastMusicRef,
        showModelAddMusic,
        setShowModelAddMusic,
        currentMusic,
        setCurrentMusic,
        addListen,shareMusicAsPost
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
