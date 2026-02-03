'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ExploreContext = createContext();

export const ExploreProvider = ({ children }) => {
    const { user } = useAuth();
    const [explorePosts, setExplorePosts] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [trendingHashtags, setTrendingHashtags] = useState([]);
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const config = useMemo(() => ({
        headers: { Authorization: `Bearer ${user?.token}` }
    }), [user?.token]);

    const fetchExploreContent = useCallback(async () => {
        if (!user?.token) return;
        setLoading(true);
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/search/explore`, config);
            setExplorePosts(data.posts || []);
            setSuggestedUsers(data.suggestedUsers || []);
            setTrendingHashtags(data.trendingHashtags || []);
        } catch (err) {
            console.error("Error fetching explore content:", err);
            setError(err.response?.data?.message || "Failed to load explore content");
        } finally {
            setLoading(false);
        }
    }, [user?.token, config]);

    const fetchTrending = useCallback(async () => {
        if (!user?.token) return;
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/search/trending`, config);
            setTrendingPosts(data.posts || []);
            // Update hashtags if needed or just use from explore if they are the same
            if (data.hashtags) setTrendingHashtags(data.hashtags);
        } catch (err) {
            console.error("Error fetching trending content:", err);
        }
    }, [user?.token, config]);

    useEffect(() => {
        if (user?.token) {
            fetchExploreContent();
            fetchTrending();
        }
    }, [user?.token, fetchExploreContent, fetchTrending]);

    const value = {
        explorePosts,
        suggestedUsers,
        trendingHashtags,
        trendingPosts,
        loading,
        error,
        refreshExplore: fetchExploreContent,
        refreshTrending: fetchTrending
    };

    return (
        <ExploreContext.Provider value={value}>
            {children}
        </ExploreContext.Provider>
    );
};

export const useExplore = () => {
    const context = useContext(ExploreContext);
    if (!context) {
        throw new Error("useExplore must be used within an ExploreProvider");
    }
    return context;
};
