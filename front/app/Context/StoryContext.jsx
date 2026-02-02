'use client';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import getData from "../utils/getData";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { useNotify } from "./NotifyContext";
import { useSocket } from "./SocketContext";

export const StoryContext = createContext();

export const StoryContextProvider = ({ children }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { addNotify } = useNotify();
  const { socket } = useSocket();

  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStory, setIsStory] = useState(false); // Modal toggle

  // 📥 Initial Fetch
  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        await getData('story', setStories);
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, []);

  // 🔔 Real-time Socket Listener
  useEffect(() => {
    if (!socket) return;

    const handleNewStory = (newStory) => {
      // Avoid duplicates
      setStories((prev) => {
        if (prev.some(s => s._id === newStory._id)) return prev;
        return [newStory, ...prev];
      });
    };

    const handleDeletedStory = (storyId) => {
      setStories((prev) => prev.filter(s => s._id !== storyId));
    };

    socket.on("new-story", handleNewStory);
    socket.on("delete-story", handleDeletedStory);

    // Also listen for interactions if needed
    socket.on("update-story", (updatedStory) => {
      setStories(prev => prev.map(s => s._id === updatedStory._id ? updatedStory : s));
    });

    return () => {
      socket.off("new-story", handleNewStory);
      socket.off("delete-story", handleDeletedStory);
      socket.off("update-story");
    };
  }, [socket]);

  // 📤 Actions

  const addNewStory = useCallback(async (storyData) => {
    const formData = new FormData();
    if (storyData.text) formData.append('text', storyData.text);
    if (storyData.file) formData.append('image', storyData.file);

    if (!storyData.text && !storyData.file) {
      showAlert("You must provide either text or an image.");
      return;
    }

    if (storyData.collaborators) {
      formData.append('collaborators', JSON.stringify(storyData.collaborators));
    }
    if (storyData.mentions) {
      formData.append('mentions', JSON.stringify(storyData.mentions));
    }
    if (storyData.music) {
      formData.append('music', JSON.stringify(storyData.music));
    }
    if (storyData.link) {
      formData.append('link', JSON.stringify(storyData.link));
    }
    if (storyData.isCloseFriends !== undefined) {
      formData.append('isCloseFriends', storyData.isCloseFriends);
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const newStory = res.data?.story || res.data;
      setStories(prev => {
        if (prev.some(s => s._id === newStory._id)) return prev;
        return [newStory, ...prev];
      });

      showAlert("✅ Story published successfully.");
      setIsStory(false); // Close modal
      return newStory;
    } catch (err) {
      console.error(err);
      showAlert("❌ Failed to add story.");
      return null;
    }
  }, [user, showAlert]);

  const deleteStory = useCallback(async (storyId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/story/delete/${storyId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setStories(prev => prev.filter(s => s._id !== storyId));
      showAlert("Story deleted successfully.");
    } catch (err) {
      showAlert("Failed to delete story.");
    }
  }, [user, showAlert]);

  const viewStory = useCallback(async (storyId) => {
    if (!user) return;
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/view/${storyId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updatedStory = data?.story || data;
      setStories(prev => prev.map(s => s._id === storyId ? updatedStory : s));
    } catch (err) {
      console.error("View story error:", err);
    }
  }, [user]);

  const toggleLove = useCallback(async (storyId) => {
    if (!user) return;
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/love/${storyId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setStories(prev => prev.map(s => s._id === storyId ? data : s));
    } catch (err) {
      console.error(err);
      showAlert("❌ Failed to toggle love.");
    }
  }, [user, showAlert]);

  const reactToStory = useCallback(async (storyId, emoji) => {
    if (!user) return;
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/react/${storyId}`,
        { emoji },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setStories(prev => prev.map(s => s._id === storyId ? data : s));
    } catch (err) {
      console.error(err);
      showAlert("❌ Failed to react.");
    }
  }, [user, showAlert]);

  const getStoryViewers = useCallback(async (storyId) => {
    if (!user) return [];
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/viewers/${storyId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }, [user]);

  const shareStory = useCallback(async (id) => {
    if (!user?.token) return showAlert("You must be logged in.");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/share/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setStories(prev => [res.data, ...prev]);
      showAlert("✅ Story shared successfully!");
    } catch (err) {
      showAlert("❌ Failed to share story.");
    }
  }, [user, showAlert]);

  const getUserStories = useCallback(async (userId) => {
    if (!userId) return [];
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/user/${userId}`,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      return data;
    } catch (err) {
      return [];
    }
  }, [user]);

  const value = useMemo(() => ({
    stories,
    isLoading,
    isStory,
    setIsStory,
    addNewStory,
    deleteStory,
    viewStory,
    toggleLove,
    reactToStory,
    getStoryViewers,
    getUserStories,
    shareStory
  }), [stories, isLoading, isStory, addNewStory, deleteStory, viewStory, toggleLove, reactToStory, getStoryViewers, getUserStories, shareStory]);

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => useContext(StoryContext);
