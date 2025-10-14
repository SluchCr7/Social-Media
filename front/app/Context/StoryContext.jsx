'use client';
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import getData from "../utils/getData";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { useNotify } from "./NotifyContext";

export const StoryContext = createContext();

export const StoryContextProvider = ({ children }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {addNotify} = useNotify()

  const addNewStory = async (storyData) => {
    const formData = new FormData();

    if (storyData.text) formData.append('text', storyData.text);
    if (storyData.file) formData.append('image', storyData.file);

    if (!storyData.text && !storyData.file) {
      showAlert("You must provide either an image, text, or both for the story.");
      return;
    }

    if (storyData.collaborators) {
      for (const collaborator of storyData.collaborators) {
        formData.append('collaborators', collaborator);
      }
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const story = res.data?.story || res.data;

      // ✅ إضافة القصة الجديدة إلى الـ state مباشرة بدون refresh
      setStories((prev) => [story, ...prev]);

      // ✅ إرسال إشعارات للمشاركين (collaborators)
      if (storyData.collaborators?.length > 0 && story?._id) {
        for (const collaborator of storyData.collaborators) {
          await addNotify({
            content: `${user?.username} added you as a collaborator in a story 🎉`,
            type: 'collaborator',
            receiverId: collaborator?._id,
            actionRef: story._id,
            actionModel: 'Story',
          });
        }
      }

      showAlert("Story added successfully.");
    } catch (err) {
      console.error(err);
      showAlert("Failed to add story.");
    }
  };


  // ➕ جلب قصص يوزر معين
const getUserStories = async (userId) => {
  if (!userId) return [];

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    );

    return data; // بيرجع القصص نفسها
  } catch (err) {
    console.error("Failed to fetch user stories:", err);
    showAlert("Could not load user stories.");
    return [];
  }
};


  // 📥 جلب القصص
  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        await getData('story', setStories);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, []);

// ➕ تسجيل مشاهدة الستوري
  const viewStory = async (storyId) => {
    if (!user) return;
    try {
      // استدعاء API مخصص لتسجيل المشاهدة
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/view/${storyId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // تحديث الستوري داخل state
      setStories((prev) =>
        prev.map((story) => (story._id === storyId ? data.story : story))
      );
    } catch (err) {
      console.error(err);
    }
  };
  const toggleLove = async (storyId) => {
    if (!user) return;

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/love/${storyId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // تحديث الستوري داخل state
      setStories(prev =>
        prev.map(story => (story._id === storyId ? data : story))
      );
      showAlert("you Love this Story")
    } catch (err) {
      console.error(err);
      showAlert("Failed to toggle love");
    }
  };

  const shareStory = async (id) => {
    if (!user.token) showAlert("You must be logged in.");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/share/${id}`,
        {}, // مفيش body هنا فخليته فاضي
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      showAlert("✅ Story shared successfully.");
      setStories(prev => [res.data, ...prev]); // ✅ تحديث فوري للـ state

    } catch (err) {
      console.error(err);
      showAlert("❌ Failed to share the Reel.");
    }
  };
  return (
    <StoryContext.Provider
      value={{
        addNewStory,
        stories,
        isLoading,
        viewStory,toggleLove, getUserStories,shareStory
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => useContext(StoryContext);
