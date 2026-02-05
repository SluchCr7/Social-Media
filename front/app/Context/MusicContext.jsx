'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { useNotify } from "./NotifyContext";
import { useNotify } from "./NotifyContext";
import { usePost } from "./PostContext";
import { useSocket } from "./SocketContext";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { showAlert } = useAlert();
  const [music, setMusic] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [genre, setGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [topCharts, setTopCharts] = useState({ trending: [], popular: [] });
  const [showModelAddMusic, setShowModelAddMusic] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);

  const { setPosts } = usePost();

  // ✅ جلب الموسيقى مع التصفية والـ Pagination
  const fetchMusic = useCallback(async (pageNum = 1, currentGenre = "All") => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music?page=${pageNum}&limit=12&genre=${currentGenre}`
      );
      const newMusic = Array.isArray(res.data.music) ? res.data.music : [];

      setMusic(prev => (pageNum === 1 ? newMusic : [...prev, ...newMusic]));
      setHasMore(pageNum < res.data.totalPages);
    } catch (err) {
      console.error("Fetch Error:", err);
      // showAlert("Failed to fetch music.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ جلب التريند والأكثر شعبية
  const fetchTopCharts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/music/top-charts`);
      setTopCharts(data);
    } catch (err) {
      console.error("Top Charts Error:", err);
    }
  }, []);

  // ✅ البحث عن الموسيقى (Server Side)
  const searchMusic = useCallback(async (query) => {
    if (!query) {
      fetchMusic(1, genre);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/music/search?q=${query}`);
      setMusic(data);
      setHasMore(false); // البحث يعيد نتائج ثابتة عادة
    } catch (err) {
      console.error("Search Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [genre, fetchMusic]);

  // ✅ تحميل البيانات عند تغيير النوع أو أول مرة
  useEffect(() => {
    setPage(1);
    fetchMusic(1, genre);
    fetchTopCharts();
  }, [genre, fetchMusic, fetchTopCharts]);

  // 🔔 Socket Listeners
  useEffect(() => {
    if (!socket) return;

    const handleCreate = (newM) => {
      const currentUserId = user?._id?.toString();
      const ownerId = newM?.owner?._id?.toString() || newM?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      setMusic(prev => [newM, ...prev]);
    };
    const handleUpdate = (updated) => {
      setMusic(prev => prev.map(m => m._id === updated._id ? updated : m));
      // Update charts locally (though they might need re-fetch for precise ordering, but this updates data)
      setTopCharts(prev => ({
        trending: prev.trending.map(m => m._id === updated._id ? updated : m),
        popular: prev.popular.map(m => m._id === updated._id ? updated : m)
      }));
    };
    const handleDelete = (id) => {
      setMusic(prev => prev.filter(m => m._id !== id));
      setTopCharts(prev => ({
        trending: prev.trending.filter(m => m._id !== id),
        popular: prev.popular.filter(m => m._id !== id)
      }));
    };

    socket.on("music:create", handleCreate);
    socket.on("music:update", handleUpdate);
    socket.on("music:delete", handleDelete);

    return () => {
      socket.off("music:create", handleCreate);
      socket.off("music:update", handleUpdate);
      socket.off("music:delete", handleDelete);
    };
  }, [socket, user]);

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

      setMusic(prev => [res.data, ...prev]);
      showAlert("Music uploaded successfully!");
      setShowModelAddMusic(false);
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
    if (!user?.token) return showAlert("Please login to like music");
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const { music: updatedMusic, message } = res.data;
      setMusic(prev => prev.map(item => (item._id === updatedMusic._id ? updatedMusic : item)));

      // تحديث التريند أيضاً لو كان فيها
      setTopCharts(prev => ({
        trending: prev.trending.map(m => m._id === updatedMusic._id ? updatedMusic : m),
        popular: prev.popular.map(m => m._id === updatedMusic._id ? updatedMusic : m)
      }));

    } catch (err) {
      console.error(err);
      showAlert("Failed to like music.");
    }
  }, [user, showAlert]);

  // 👁️ زيادة المشاهدات
  const viewMusic = useCallback(async (id) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/music/view/${id}`);
      const updated = res.data;
      setMusic(prev => prev.map(r => (r?._id === id ? updated : r)));
    } catch (err) { console.error(err); }
  }, []);

  const addListen = useCallback(async (musicId) => {
    if (!user?.token) return;
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music/listen/${musicId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMusic(prev => prev.map(m => (m._id === data._id ? data : m)));
      return data;
    } catch (error) { console.error('Error adding listen:', error); }
  }, [user]);

  const shareMusicAsPost = useCallback(async (musicId, customText = '') => {
    if (!user?.token) return showAlert('You must be logged in to share music.');
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music/share/${musicId}`,
        { customText },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPosts(prev => [data.post, ...prev]);
      showAlert("Shared successfully as a post!");
      return data.post;
    } catch (error) {
      console.error('Error sharing music:', error);
      showAlert("Failed to share music.");
    }
  }, [user, setPosts, showAlert]);

  // 🔍 Infinite Scroll Logic
  const observer = useRef();
  const lastMusicRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => {
            const nextPage = prev + 1;
            fetchMusic(nextPage, genre);
            return nextPage;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, fetchMusic, genre]
  );

  const value = useMemo(() => ({
    music,
    topCharts,
    isLoading,
    hasMore,
    genre,
    setGenre,
    searchQuery,
    setSearchQuery,
    searchMusic,
    uploadMusic,
    deleteMusic,
    likeMusic,
    viewMusic,
    addListen,
    shareMusicAsPost,
    lastMusicRef,
    showModelAddMusic,
    setShowModelAddMusic,
    currentMusic,
    setCurrentMusic,
  }), [
    music, topCharts, isLoading, hasMore, genre, searchQuery,
    searchMusic, uploadMusic, deleteMusic, likeMusic, viewMusic,
    addListen, shareMusicAsPost, lastMusicRef, showModelAddMusic, currentMusic
  ]);

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
