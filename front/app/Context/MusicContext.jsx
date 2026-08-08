'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { usePost } from "./PostContext";
import { useSocket } from "./SocketContext";

export const MusicContext = createContext();

const normalizeMusicItem = (item) => {
  if (!item || typeof item !== "object") return null;

  const title = typeof item.title === "string" ? item.title.trim() : "";
  const artist = typeof item.artist === "string" ? item.artist.trim() : "";
  const url = typeof item.url === "string" ? item.url.trim() : "";

  if (!title || !artist || !url) return null;

  return {
    ...item,
    title,
    artist,
    album: typeof item.album === "string" && item.album.trim() ? item.album.trim() : "Single",
    genre: typeof item.genre === "string" && item.genre.trim() ? item.genre : "Other",
    cover: typeof item.cover === "string" && item.cover.trim() ? item.cover : "/default-music.jpg",
    duration: Number(item.duration) || 0,
  };
};

const normalizeMusicList = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeMusicItem).filter(Boolean);
};

export const MusicProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { showAlert } = useAlert();
  const [music, setMusic] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [genre, setGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [topCharts, setTopCharts] = useState({ trending: [], popular: [] });
  const [showModelAddMusic, setShowModelAddMusic] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);

  const { setPosts } = usePost();

  const fetchMusic = useCallback(async (pageNum = 1, currentGenre = "All") => {
    if (pageNum === 1) {
      setIsLoading(true);
      setHasLoadedOnce(false);
    } else {
      setIsLoading(true);
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music?page=${pageNum}&limit=12&genre=${currentGenre}`
      );
      const nextMusic = normalizeMusicList(Array.isArray(res?.data?.music) ? res.data.music : []);

      setMusic((prev) => (pageNum === 1 ? nextMusic : [...prev, ...nextMusic]));
      setHasMore(pageNum < (res?.data?.totalPages || 1));
    } catch (err) {
      console.error("Fetch Error:", err);
      if (pageNum === 1) {
        setMusic([]);
      }
    } finally {
      setIsLoading(false);
      if (pageNum === 1) {
        setHasLoadedOnce(true);
      }
    }
  }, []);

  const fetchTopCharts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/music/top-charts`);
      setTopCharts({
        trending: normalizeMusicList(Array.isArray(data?.trending) ? data.trending : []),
        popular: normalizeMusicList(Array.isArray(data?.popular) ? data.popular : []),
      });
    } catch (err) {
      console.error("Top Charts Error:", err);
      setTopCharts({ trending: [], popular: [] });
    }
  }, []);

  const searchMusic = useCallback(async (query) => {
    const trimmedQuery = query?.trim() || "";

    if (!trimmedQuery) {
      setSearchQuery("");
      fetchMusic(1, genre);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/music/search?q=${trimmedQuery}`);
      const nextMusic = normalizeMusicList(Array.isArray(data) ? data : []);
      setMusic(nextMusic);
      setHasMore(false);
      setHasLoadedOnce(true);
    } catch (err) {
      console.error("Search Error:", err);
      setMusic([]);
    } finally {
      setIsLoading(false);
    }
  }, [genre, fetchMusic]);

  useEffect(() => {
    setPage(1);
    fetchMusic(1, genre);
    fetchTopCharts();
  }, [genre, fetchMusic, fetchTopCharts]);

  useEffect(() => {
    if (!socket) return;

    const handleCreate = (newM) => {
      const normalized = normalizeMusicItem(newM);
      if (!normalized) return;

      const currentUserId = user?._id?.toString();
      const ownerId = normalized?.owner?._id?.toString() || normalized?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      setMusic((prev) => [normalized, ...prev.filter((m) => m._id !== normalized._id)]);
    };

    const handleUpdate = (updated) => {
      const normalized = normalizeMusicItem(updated);
      if (!normalized) return;
      setMusic((prev) => prev.map((m) => (m._id === normalized._id ? normalized : m)));
      setTopCharts((prev) => ({
        trending: prev.trending.map((m) => (m._id === normalized._id ? normalized : m)),
        popular: prev.popular.map((m) => (m._id === normalized._id ? normalized : m)),
      }));
    };

    const handleDelete = (id) => {
      setMusic((prev) => prev.filter((m) => m._id !== id));
      setTopCharts((prev) => ({
        trending: prev.trending.filter((m) => m._id !== id),
        popular: prev.popular.filter((m) => m._id !== id),
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

  const uploadMusic = async (formData) => {
    try {
      const token = user?.token || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}')?.token : null);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      const normalized = normalizeMusicItem(res?.data);
      if (normalized) {
        setMusic((prev) => [normalized, ...prev.filter((m) => m._id !== normalized._id)]);
      }
      showAlert("Music uploaded successfully!");
      setShowModelAddMusic(false);
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || err?.message || "Failed to upload Music.";
      showAlert(message);
      throw err;
    }
  };

  const deleteMusic = useCallback(async (id) => {
    if (!user?.token) return;
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMusic((prev) => prev.filter((r) => r._id !== id));
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete Music.");
    }
  }, [user, showAlert]);

  const likeMusic = useCallback(async (id) => {
    if (!user?.token) return showAlert("Please login to like music");
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/music/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updatedMusic = normalizeMusicItem(res?.data?.music);
      if (!updatedMusic) return;

      setMusic((prev) => prev.map((item) => (item._id === updatedMusic._id ? updatedMusic : item)));
      setTopCharts((prev) => ({
        trending: prev.trending.map((m) => (m._id === updatedMusic._id ? updatedMusic : m)),
        popular: prev.popular.map((m) => (m._id === updatedMusic._id ? updatedMusic : m)),
      }));
    } catch (err) {
      console.error(err);
      showAlert("Failed to like music.");
    }
  }, [user, showAlert]);

  const viewMusic = useCallback(async (id) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/music/view/${id}`);
      const updated = normalizeMusicItem(res?.data);
      if (!updated) return;
      setMusic((prev) => prev.map((r) => (r?._id === id ? updated : r)));
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
      const updated = normalizeMusicItem(data);
      if (!updated) return data;
      setMusic((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      return updated;
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
      setPosts((prev) => [data.post, ...prev]);
      showAlert("Shared successfully as a post!");
      return data.post;
    } catch (error) {
      console.error('Error sharing music:', error);
      showAlert("Failed to share music.");
    }
  }, [user, setPosts, showAlert]);

  const observer = useRef();
  const lastMusicRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => {
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
    hasLoadedOnce,
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
    music, topCharts, isLoading, hasMore, hasLoadedOnce, genre, searchQuery,
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
