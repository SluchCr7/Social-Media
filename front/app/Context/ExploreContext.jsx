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

    // Active explore tab state (lowercase to match backend tab names: trending, photos, videos, tags, users)
    const [exploreTab, setExploreTab] = useState('trending');
    const [pagination, setPagination] = useState({ page: 1, hasMore: false });

    const config = useMemo(() => ({
        headers: { Authorization: `Bearer ${user?.token}` }
    }), [user?.token]);

    const fetchExploreContent = useCallback(async (tabName = 'trending', pageNum = 1) => {
        if (!user?.token) return;
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BACK_URL}/api/search/explore?tab=${tabName}&page=${pageNum}&limit=12`, 
                config
            );
            
            if (pageNum === 1) {
                setExplorePosts(data.posts || []);
            } else {
                setExplorePosts(prev => [...prev, ...(data.posts || [])]);
            }

            if (data.suggestedUsers) setSuggestedUsers(data.suggestedUsers);
            if (data.trendingHashtags) setTrendingHashtags(data.trendingHashtags);
            
            setPagination({
                page: pageNum,
                hasMore: data.pagination?.hasMore || false
            });
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
            if (data.hashtags) setTrendingHashtags(data.hashtags);
        } catch (err) {
            console.error("Error fetching trending content:", err);
        }
    }, [user?.token, config]);

    // Load more for explore infinite scroll
    const loadMoreExplore = useCallback(async () => {
        if (loading || !pagination.hasMore) return;
        const nextPage = pagination.page + 1;
        await fetchExploreContent(exploreTab, nextPage);
    }, [loading, pagination, exploreTab, fetchExploreContent]);

    // Fetch tab-specific explore content when active tab changes
    useEffect(() => {
        if (user?.token) {
            fetchExploreContent(exploreTab, 1);
        }
    }, [user?.token, exploreTab, fetchExploreContent]);

    // Initial Load of trending static content
    useEffect(() => {
        if (user?.token) {
            fetchTrending();
        }
    }, [user?.token, fetchTrending]);

    const value = {
        explorePosts,
        suggestedUsers,
        trendingHashtags,
        trendingPosts,
        loading,
        error,
        exploreTab,
        setExploreTab,
        pagination,
        refreshExplore: () => fetchExploreContent(exploreTab, 1),
        refreshTrending: fetchTrending,
        loadMoreExplore
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
