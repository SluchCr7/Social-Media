// 'use client';
// import React, { createContext, useContext, useState, useCallback } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';

// const HighlightContext = createContext();
// export const useHighlights = () => useContext(HighlightContext);

// export const HighlightContextProvider = ({ children }) => {
//   const [highlights, setHighlights] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { user } = useAuth(); // تأكد أن فيه user.token
//   const [openModal, setOpenModal] = useState(false)
//   const [selectedHighlight, setSelectedHighlight] = useState(null);
//   // 🟢 جلب الـ Highlights الخاصة بالمستخدم
//   const fetchHighlights = useCallback(async () => {
//     if (!user?.token) return;
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${user?._id}`,
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );
//       setHighlights(res.data);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   // 🟣 إنشاء Highlight جديد
//   const createHighlight = useCallback(async ({ title, cover, storyIds }) => {
//     if (!user?.token) return;
//     try {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append('title', title);
//       storyIds.forEach((id) => formData.append('storyIds', id));
//       if (cover) formData.append('image', cover);

//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       setHighlights((prev) => [res.data, ...prev]);
//       return res.data;
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   // 🔴 حذف Highlight
//   const deleteHighlight = useCallback(async (id) => {
//     if (!user?.token) return;
//     try {
//       setLoading(true);
//       await axios.delete(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${id}`,
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );
//       setHighlights((prev) => prev.filter((h) => h._id !== id));
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);
//   const addStoryToHighlight = async (highlightId, storyId) => {
//     try {
//       setLoading(true);
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${highlightId}/add-story`,
//         { storyId },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//           },
//         }
//       );

//       // تحديث الهايلايت في الذاكرة المحلية
//       const updated = res.data?.highlight;
//       if (updated) {
//         setHighlights(prev =>
//           prev.map(h => (h._id === updated._id ? updated : h))
//         );
//       }

//       return updated;
//     } catch (err) {
//       console.error('Error adding story to highlight:', err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <HighlightContext.Provider
//       value={{
//         highlights,
//         loading,
//         error,
//         fetchHighlights,
//         createHighlight,
//         deleteHighlight,openModal ,addStoryToHighlight, setOpenModal,selectedHighlight, setSelectedHighlight
//       }}
//     >
//       {children}
//     </HighlightContext.Provider>
//   );
// };
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
        setHighlights((prev) => [newHighlight, ...prev]); // ✅ تحديث فوري
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

      setLoading(true);
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/highlight/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setHighlights((prev) => prev.filter((h) => h._id !== id)); // ✅ تحديث فوري
        showAlert('🗑️ Highlight deleted successfully.');
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete highlight.';
        setError(message);
        showAlert(message);
      } finally {
        setLoading(false);
      }
    },
    [user, showAlert]
  );

  // 🟠 إضافة ستوري إلى Highlight
  const addStoryToHighlight = useCallback(
    async (highlightId, storyId) => {
      if (!user?.token) return showAlert("You must be logged in.");

      setLoading(true);
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
          setHighlights((prev) =>
            prev.map((h) => (h._id === updated._id ? updated : h))
          );
          showAlert('📌 Story added to highlight.');
        }
        return updated;
      } catch (err) {
        console.error('Error adding story to highlight:', err);
        showAlert('❌ Failed to add story.');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, showAlert]
  );

  // 🟤 تحديث عنوان أو صورة الهايلايت (إضافة اختيارية)
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
        setHighlights((prev) =>
          prev.map((h) => (h._id === updated._id ? updated : h))
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
        updateHighlight, // ✅ تمت إضافة تحديث الهايلايت
        openModal,
        setOpenModal,
        selectedHighlight,
        setSelectedHighlight,
        setHighlights // ✅ للسماح بتحديث يدوي من المكونات الأخرى
      }}
    >
      {children}
    </HighlightContext.Provider>
  );
};
