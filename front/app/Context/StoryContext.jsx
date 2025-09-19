'use client';
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import getData from "../utils/getData";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";

export const StoryContext = createContext();

export const StoryContextProvider = ({ children }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ➕ إضافة قصة جديدة
  const addNewStory = async (storyData) => {
    const formData = new FormData();

    // ✅ إضافة النص لو موجود
    if (storyData.text) {
      formData.append('text', storyData.text);
    }

    // ✅ إضافة الصورة لو موجودة
    if (storyData.file) {
      formData.append('image', storyData.file);
    }

    // ✅ تحقق أنه على الأقل فيه نص أو صورة
    if (!storyData.text && !storyData.file) {
      showAlert("You must provide either an image, text, or both for the story.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
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
        prev.map(story => (story._id === storyId ? data.story : story))
      );
    } catch (err) {
      console.error(err);
      showAlert("Failed to toggle love");
    }
  };
  return (
    <StoryContext.Provider
      value={{
        addNewStory,
        stories,
        isLoading,
        viewStory,toggleLove, getUserStories
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => useContext(StoryContext);
