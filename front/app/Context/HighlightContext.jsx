'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';

const HighlightContext = createContext();
export const useHighlights = () => useContext(HighlightContext);

export const HighlightContextProvider = ({ children }) => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  const { user } = useAuth();
  const { showAlert } = useAlert();

  // 🟢 جلب الهايلايتس الخاصة بالمستخدم
  const fetchHighlights = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${user._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setHighlights(res.data || []);
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load highlights.';
      setError(message);
      showAlert(message);
    } finally {
      setLoading(false);
    }
  }, [user, showAlert]);

  // 🟣 إنشاء Highlight جديد
  const createHighlight = useCallback(
    async ({ title, cover, storyIds }) => {
      if (!user?.token) return showAlert("You must be logged in first.");

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('title', title);
        storyIds?.forEach((id) => formData.append('storyIds', id));
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

        const newHighlight = res.data;
        // The backend now returns { ...highlight, stories: [...] } (mapped from archivedStories)
        // We can directly add this to our state.
        setHighlights((prev) => [newHighlight, ...prev]);
        showAlert('✅ Highlight created successfully!');
        return newHighlight;
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to create highlight.';
        setError(message);
        showAlert(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, showAlert]
  );

  // 🔴 حذف Highlight
  const deleteHighlight = useCallback(
    async (id) => {
      if (!user?.token) return showAlert("You must be logged in.");

      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // ✅ حذف فوري من الواجهة
        setHighlights((prev) => prev.filter((h) => h._id !== id));
        showAlert('🗑️ Highlight deleted successfully.');
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete highlight.';
        setError(message);
        showAlert(message);
      }
    },
    [user, showAlert]
  );

  // 🟠 إضافة ستوري إلى Highlight
  const addStoryToHighlight = useCallback(
    async (highlightId, storyId) => {
      if (!user?.token) return showAlert("You must be logged in.");

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${highlightId}/add-story`,
          { storyId },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        const updated = res.data?.highlight;
        if (updated) {
          // ✅ تحديث فوري في الواجهة بدون Refresh
          setHighlights((prev) =>
            prev.map((h) => (h._id === updated._id ? updated : h))
          );

          // ✅ في حال كانت الهايلايت مفتوحة في Modal — حدّثها أيضًا
          setSelectedHighlight((prev) =>
            prev && prev._id === updated._id ? updated : prev
          );

          showAlert('📌 Story added to highlight.');
        }
        return updated;
      } catch (err) {
        console.error('Error adding story to highlight:', err);
        showAlert('❌ Failed to add story.');
        throw err;
      }
    },
    [user, showAlert]
  );

  // 🟤 تحديث عنوان أو صورة الهايلايت
  const updateHighlight = useCallback(
    async (id, updates) => {
      if (!user?.token) return showAlert("You must be logged in.");

      setLoading(true);
      try {
        const formData = new FormData();
        if (updates.title) formData.append('title', updates.title);
        if (updates.image) formData.append('image', updates.image);

        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const updated = res.data;

        // ✅ تحديث فوري في القائمة والـ Modal
        setHighlights((prev) =>
          prev.map((h) => (h._id === updated._id ? updated : h))
        );
        setSelectedHighlight((prev) =>
          prev && prev._id === updated._id ? updated : prev
        );

        showAlert('✏️ Highlight updated successfully.');
        return updated;
      } catch (err) {
        console.error('Failed to update highlight:', err);
        showAlert('❌ Could not update highlight.');
      } finally {
        setLoading(false);
      }
    },
    [user, showAlert]
  );

  return (
    <HighlightContext.Provider
      value={{
        highlights,
        loading,
        error,
        fetchHighlights,
        createHighlight,
        deleteHighlight,
        addStoryToHighlight,
        updateHighlight,
        openModal,
        setOpenModal,
        selectedHighlight,
        setSelectedHighlight,
        setHighlights,
      }}
    >
      {children}
    </HighlightContext.Provider>
  );
};
