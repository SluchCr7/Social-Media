// useSearchLogic.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

/**
 * Custom Hook to manage search logic via Server API.
 * @param {string} initialSearch - Initial search query.
 * @returns {object} - Contains search state, setter, results, and hashtags (mocked or fetched).
 */
export const useSearchLogic = (initialSearch = '') => {
  const { user } = useAuth();
  const [search, setSearch] = useState(initialSearch);
  const [searchResults, setSearchResults] = useState({
    users: [],
    hashtags: [],
    posts: [],
    communities: []
  });
  const [loading, setLoading] = useState(false);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(async () => {
      const trimmed = search.trim();

      if (!trimmed) {
        setSearchResults({ users: [], hashtags: [], posts: [], communities: [] });
        return;
      }

      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${user?.token}` }
        };

        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/search?q=${encodeURIComponent(trimmed)}`, config);

        // Hashtags extraction from posts can still be done client side if needed, 
        // or backend should return them. For now we just return posts/users.
        setSearchResults({
          users: data.users || [],
          posts: data.posts || [],
          communities: data.communities || [],
          hashtags: [] // Backend doesn't return hashtags yet
        });

      } catch (error) {
        console.error("Search API Error:", error);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [search, user?.token]);

  // Mock top hashtags for now or fetch from a trending API
  const topHashtags = [];

  return { search, setSearch, searchResults, topHashtags, loading };
};