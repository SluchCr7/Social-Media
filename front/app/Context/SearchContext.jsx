'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({
        users: [],
        posts: [],
        communities: [],
        hashtags: []
    });
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const config = useMemo(() => ({
        headers: { Authorization: `Bearer ${user?.token}` }
    }), [user?.token]);

    // Fetch Search History
    const fetchSearchHistory = useCallback(async () => {
        if (!user?.token) return;
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/search/history`, config);
            setSearchHistory(data);
        } catch (err) {
            console.error("Error fetching search history:", err);
        }
    }, [user?.token, config]);

    // Add to Search History
    const addToHistory = useCallback(async (query, searchType = 'text', refId = null) => {
        if (!user?.token || !query.trim()) return;
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/search/history`, {
                query, searchType, refId
            }, config);
            setSearchHistory(data);
        } catch (err) {
            console.error("Error adding to history:", err);
        }
    }, [user?.token, config]);

    // Remove from History
    const removeFromHistory = useCallback(async (id) => {
        if (!user?.token) return;
        try {
            const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/search/history?id=${id}`, config);
            setSearchHistory(data.searchHistory);
        } catch (err) {
            console.error("Error removing from history:", err);
        }
    }, [user?.token, config]);

    // Clear All History
    const clearAllHistory = useCallback(async () => {
        if (!user?.token) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/search/history`, config);
            setSearchHistory([]);
        } catch (err) {
            console.error("Error clearing history:", err);
        }
    }, [user?.token, config]);

    // Global Search Logic
    const performSearch = useCallback(async (query) => {
        const trimmed = query.trim();
        if (!trimmed) {
            setSearchResults({ users: [], posts: [], communities: [], hashtags: [] });
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/search?q=${encodeURIComponent(trimmed)}`, config);
            setSearchResults(data);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong during search");
            console.error("Search API Error:", err);
        } finally {
            setLoading(false);
        }
    }, [config]);

    // Debounced Search Effect
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults({ users: [], posts: [], communities: [], hashtags: [] });
            return;
        }

        const handler = setTimeout(() => {
            performSearch(searchQuery);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery, performSearch]);

    // Initial Load
    useEffect(() => {
        if (user?.token) {
            fetchSearchHistory();
        }
    }, [user?.token, fetchSearchHistory]);

    const value = {
        searchQuery,
        setSearchQuery,
        searchResults,
        searchHistory,
        loading,
        error,
        addToHistory,
        removeFromHistory,
        clearAllHistory,
        performSearch
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
};
