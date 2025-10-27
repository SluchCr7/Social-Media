'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const HighlightContext = createContext();
export const useHighlights = () => useContext(HighlightContext);

export const HighlightContextProvider = ({ children }) => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // تأكد أن فيه user.token
  const [openModal, setOpenModal] = useState(false)
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  // 🟢 جلب الـ Highlights الخاصة بالمستخدم
  const fetchHighlights = useCallback(async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${user?._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setHighlights(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 🟣 إنشاء Highlight جديد
  const createHighlight = useCallback(async ({ title, cover, storyIds }) => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      storyIds.forEach((id) => formData.append('storyIds', id));
      if (cover) formData.append('image', cover);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setHighlights((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 🔴 حذف Highlight
  const deleteHighlight = useCallback(async (id) => {
    if (!user?.token) return;
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setHighlights((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);
  const addStoryToHighlight = async (highlightId, storyId) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${highlightId}/add-story`,
        { storyId },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      // تحديث الهايلايت في الذاكرة المحلية
      const updated = res.data?.highlight;
      if (updated) {
        setHighlights(prev =>
          prev.map(h => (h._id === updated._id ? updated : h))
        );
      }

      return updated;
    } catch (err) {
      console.error('Error adding story to highlight:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return (
    <HighlightContext.Provider
      value={{
        highlights,
        loading,
        error,
        fetchHighlights,
        createHighlight,
        deleteHighlight,openModal ,addStoryToHighlight, setOpenModal,selectedHighlight, setSelectedHighlight
      }}
    >
      {children}
    </HighlightContext.Provider>
  );
};
