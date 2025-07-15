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

    if (storyData.type === 'image' && storyData.file) {
      formData.append('image', storyData.file);
    } else if (storyData.type === 'text' && storyData.text) {
      formData.append('text', storyData.text);
    } else {
      showAlert("You must provide either an image or text for the story.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      showAlert("Story added successfully.");
    } catch (err) {
      console.error(err);
      showAlert("Failed to add story.");
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

  return (
    <StoryContext.Provider
      value={{
        addNewStory,
        stories,
        isLoading,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => useContext(StoryContext);
