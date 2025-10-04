'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { useNotify } from "./NotifyContext";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { addNotify } = useNotify();

  const [music, setMusic] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showModelAddMusic, setShowModelAddMusic] = useState(false);

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
      showAlert("Failed to fetch music.");
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, showAlert]);

  // ✅ تحميل أول مرة
  useEffect(() => {
    fetchMusic(page);
  }, [page, fetchMusic]);

  // 🎵 رفع موسيقى جديدة
  const uploadMusic = useCallback(async (file, title, artist, genre, album = null, cover) => {
    if (!user?.token) {
      showAlert("You must be logged in to upload a music file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("audio", file);
      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("genre", genre);
      if (album) formData.append("album", album);
      if (cover) formData.append("image", cover);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          },
        }
      );

      setMusic(prev => [res.data, ...prev]);
      showAlert("Music uploaded successfully!");
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || "Failed to upload Music.");
    }
  }, [user, showAlert]);

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
      const updated = res.data;
      setMusic(prev => prev.map(r => (r?._id === id ? updated : r)));
      showAlert("You liked this music.");
    } catch (err) {
      console.error(err);
      showAlert("Failed to like Music.");
    }
  }, [user, showAlert]);

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
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
