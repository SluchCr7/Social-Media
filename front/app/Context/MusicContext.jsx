'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { useNotify } from "./NotifyContext";
import { checkUserStatus } from "../utils/checkUserLog";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const {addNotify} = useNotify()
  const [music, setMusic] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showModelAddMusic, setShowModelAddMusic] = useState(false);
  // 🎯 جلب الريلز مع pagination
  const fetchMusic = async (pageNum = 1) => {
    if (!hasMore && pageNum !== 1) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/music?page=${pageNum}&limit=10`);
      const newMusic = Array.isArray(res.data.music) ? res.data.music : [];

      setMusic(prev => (pageNum === 1 ? newMusic : [...prev, ...newMusic]));
      setHasMore(pageNum < res.data.pages);
    } catch (err) {
      console.error(err);
      // showAlert("Failed to fetch Musics.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ تحميل أول مرة
  useEffect(() => {
    fetchMusic(page);
  }, [page]);

  // 🎥 رفع Music جديد
  const uploadMusic = async (file, title , artist , genre , album=null , cover) => {
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
      formData.append("album", album);
      formData.append("image" , cover)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMusic(prev => [res.data.music, ...prev]);
      showAlert("Music uploaded successfully!");
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || "Failed to upload Music.");
    }
  };

  // 🗑️ حذف Music
  const deleteMusic = async (id) => {
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
  };

  // ❤️ لايك / أنلايك على Music
  const likeMusic = async (id) => {
    if (!user?.token) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updated = res.data;
      setMusic(prev => prev.map(r => (r?._id === id ? updated : r)));
      showAlert(res.data.message || "You like this Music audio ");
    } catch (err) {
      console.error(err);
      showAlert("Failed to like Music.");
    }
  };

  // 👁️ زيادة المشاهدات
  const viewMusic = async (id) => {
    if (!user?.token) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music/view/${id}`,
        {}, // لا حاجة لإرسال أي بيانات إضافية
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updated = res.data; // ملاحظة: السيرفر يرجع الـ Music مباشرة
      setMusic(prev => prev.map(r => (r?._id === id ? updated : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const getMusicFileById = async (id) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/music/${id}`);
      return res.data.music;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

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
    [isLoading, hasMore, page]
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
        isLoading,
        hasMore,
        lastMusicRef,
        showModelAddMusic, setShowModelAddMusic,getMusicFileById
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
