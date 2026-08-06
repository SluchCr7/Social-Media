'use client'
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';
import { useSocket } from './SocketContext';

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
  const { socket } = useSocket();

  // 🔔 Real-time Socket Listener
  useEffect(() => {
    if (!socket) return;

    const handleDeletedStory = (storyId) => {
      setHighlights((prev) =>
        prev.map((highlight) => ({
          ...highlight,
          stories: highlight.stories?.filter((s) => (s._id || s) !== storyId)
        }))
      );

      setSelectedHighlight((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          stories: prev.stories?.filter((s) => (s._id || s) !== storyId)
        };
      });
    };

    socket.on("delete-story", handleDeletedStory);
    return () => {
      socket.off("delete-story", handleDeletedStory);
    };
  }, [socket]);

  // Fetch Highlights
  const fetchHighlights = useCallback(async (targetUserId) => {
    const userIdToFetch = targetUserId || user?._id;
    if (!userIdToFetch) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/user/${userIdToFetch}`,
        {
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
        }
      );
      const sorted = (res.data || []).sort((a, b) => (a.order || 0) - (b.order || 0));
      setHighlights(sorted);
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load highlights.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create Highlight
  const createHighlight = useCallback(
    async ({ title, cover, storyIds }) => {
      if (!user?.token) return showAlert("You must be logged in first.");

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('storyIds', JSON.stringify(storyIds || []));
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

  // Delete Highlight
  const deleteHighlight = useCallback(
    async (id) => {
      if (!user?.token) return showAlert("You must be logged in.");

      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

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

  // Add story to highlight
  const addStoryToHighlight = useCallback(
    async (highlightId, storyIdOrIds) => {
      if (!user?.token) return showAlert("You must be logged in.");

      try {
        const payload = Array.isArray(storyIdOrIds)
          ? { storyIds: storyIdOrIds }
          : { storyId: storyIdOrIds };

        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${highlightId}/stories`,
          payload,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        const updated = res.data?.highlight;
        if (updated) {
          setHighlights((prev) =>
            prev.map((h) => (h._id === updated._id ? updated : h))
          );

          setSelectedHighlight((prev) =>
            prev && prev._id === updated._id ? updated : prev
          );

          showAlert(Array.isArray(storyIdOrIds) ? '📌 Stories added to highlight.' : '📌 Story added to highlight.');
        }
        return updated;
      } catch (err) {
        console.error('Error adding story to highlight:', err);
        const message = err.response?.data?.message || 'Failed to add story.';
        showAlert(`❌ ${message}`);
        throw err;
      }
    },
    [user, showAlert]
  );

  // Update Highlight
  const updateHighlight = useCallback(
    async (id, updates) => {
      if (!user?.token) return showAlert("You must be logged in.");

      setLoading(true);
      try {
        const formData = new FormData();
        if (updates.title) formData.append('title', updates.title);
        if (updates.description !== undefined) formData.append('description', updates.description);
        if (updates.isPublic !== undefined) formData.append('isPublic', updates.isPublic);
        if (updates.image) formData.append('image', updates.image);

        const res = await axios.patch(
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

  // Remove story from highlight
  const removeStoryFromHighlight = useCallback(
    async (highlightId, storyId) => {
      if (!user?.token) return showAlert("You must be logged in.");

      try {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${highlightId}/stories/${storyId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        const updated = res.data?.highlight;
        if (updated) {
          setHighlights((prev) =>
            prev.map((h) => (h._id === updated._id ? updated : h))
          );

          setSelectedHighlight((prev) =>
            prev && prev._id === updated._id ? updated : prev
          );

          showAlert('🗑️ Story removed from highlight.');
        }
        return updated;
      } catch (err) {
        console.error('Error removing story from highlight:', err);
        const message = err.response?.data?.message || 'Failed to remove story.';
        showAlert(`❌ ${message}`);
        throw err;
      }
    },
    [user, showAlert]
  );

  // Reorder stories inside highlight
  const reorderStoriesInHighlight = useCallback(
    async (highlightId, storyIds) => {
      if (!user?.token) return;
      try {
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${highlightId}/reorder-stories`,
          { storyIds },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        const updated = res.data?.highlight;
        setHighlights((prev) => prev.map((h) => (h._id === updated._id ? updated : h)));
        setSelectedHighlight((prev) => prev && prev._id === updated._id ? updated : prev);
        showAlert("✅ Order saved.");
      } catch (err) {
        showAlert("❌ Failed to reorder stories.");
      }
    },
    [user, showAlert]
  );

  // Reorder highlights
  const reorderHighlights = useCallback(
    async (highlightIds) => {
      if (!user?.token) return;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/reorder`,
          { highlightIds },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        showAlert("✅ Highlights reordered.");
      } catch (err) {
        showAlert("❌ Failed to reorder highlights.");
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
        removeStoryFromHighlight,
        reorderHighlights,
        reorderStoriesInHighlight,
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
