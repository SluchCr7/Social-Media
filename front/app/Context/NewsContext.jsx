'use client';
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const NewsContext = createContext();

export const NewsContextProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true); // إضافة حالة تحميل
  const [error, setError] = useState(null);     // إضافة حالة خطأ

  const fetchAllNews = async (params = {}) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/news', { params });
      setNews(response.data.articles || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews(); // أول تحميل
  }, []);

  return (
    <NewsContext.Provider value={{ news, loading, error, fetchAllNews }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
