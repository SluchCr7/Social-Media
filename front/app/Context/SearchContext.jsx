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

    // Advanced search filters
    const [sortBy, setSortBy] = useState('relevance'); // relevance, recent, popular
    const [dateRange, setDateRange] = useState('all'); // all, day, week, month, year
    const [hasMedia, setHasMedia] = useState(false);
    const [verifiedOnly, setVerifiedOnly] = useState(false);

    // Pagination state per type
    const [pagination, setPagination] = useState({
        users: { page: 1, totalPages: 0, totalCount: 0, hasMore: false },
        posts: { page: 1, totalPages: 0, totalCount: 0, hasMore: false },
        communities: { page: 1, totalPages: 0, totalCount: 0, hasMore: false },
        hashtags: { page: 1, totalPages: 0, totalCount: 0, hasMore: false }
    });

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
    const performSearch = useCallback(async (query, type = 'all', pageNum = 1) => {
        const trimmed = query.trim();
        if (!trimmed) {
            setSearchResults({ users: [], posts: [], communities: [], hashtags: [] });
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const url = `${process.env.NEXT_PUBLIC_BACK_URL}/api/search?q=${encodeURIComponent(trimmed)}&type=${type}&sortBy=${sortBy}&dateRange=${dateRange}&hasMedia=${hasMedia}&verifiedOnly=${verifiedOnly}&page=${pageNum}&limit=12`;
            const { data } = await axios.get(url, config);

            // Update search results
            setSearchResults(prev => {
                if (pageNum === 1) {
                    // For page 1, overwrite results for specified type or all
                    if (type === 'all') {
                        return {
                            users: data.users || [],
                            posts: data.posts || [],
                            communities: data.communities || [],
                            hashtags: data.hashtags || []
                        };
                    } else {
                        return {
                            ...prev,
                            [type]: data[type] || []
                        };
                    }
                } else {
                    // For page > 1, append results for that type
                    return {
                        ...prev,
                        [type]: [...(prev[type] || []), ...(data[type] || [])]
                    };
                }
            });

            // Update pagination state
            setPagination(prev => {
                const newPag = { ...prev };
                if (type === 'all') {
                    if (data.pagination) {
                        Object.keys(data.pagination).forEach(key => {
                            newPag[key] = data.pagination[key];
                        });
                    }
                } else if (data.pagination && data.pagination[type]) {
                    newPag[type] = data.pagination[type];
                }
                return newPag;
            });

        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong during search");
            console.error("Search API Error:", err);
        } finally {
            setLoading(false);
        }
    }, [config, sortBy, dateRange, hasMedia, verifiedOnly]);

    // Load More function for infinite scroll
    const loadMore = useCallback(async (type) => {
        if (loading) return;
        const currentPagination = pagination[type];
        if (currentPagination && currentPagination.hasMore) {
            const nextPage = currentPagination.page + 1;
            await performSearch(searchQuery, type, nextPage);
        }
    }, [pagination, loading, performSearch, searchQuery]);

    // Debounced Search Effect for initial query or filter changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults({ users: [], posts: [], communities: [], hashtags: [] });
            return;
        }

        const handler = setTimeout(() => {
            // Reset pagination to page 1 and run search for all
            performSearch(searchQuery, 'all', 1);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchQuery, sortBy, dateRange, hasMedia, verifiedOnly, performSearch]);

    // Initial Load for search history
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
        sortBy,
        setSortBy,
        dateRange,
        setDateRange,
        hasMedia,
        setHasMedia,
        verifiedOnly,
        setVerifiedOnly,
        pagination,
        addToHistory,
        removeFromHistory,
        clearAllHistory,
        performSearch,
        loadMore
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
