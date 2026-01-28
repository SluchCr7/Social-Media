'use client';

import React, { useMemo, useState, memo, useCallback } from 'react';
import {
    HiMagnifyingGlass,
    HiArrowRight,
    HiSignal,
    HiSparkles,
    HiTrendingUp,
    HiUsers,
    HiPhoto,
    HiHashtag,
    HiNewspaper
} from "react-icons/hi2";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ExploreSearchBar from '../../Component/Explore/ExploreSearchBar';
import SearchResults from '../../Component/Explore/SearchResults';
import ExploreTabs from '../../Component/Explore/ExploreTabs';
import TabContentWrapper from '../../Component/Explore/TabContentWrapper';
import TrendingTabContent from '../../Component/Explore/TrendingTabContent';
import HashtagsTabContent from '../../Component/Explore/HashtagsTabContent';
import PhotosTabContent from '../../Component/Explore/PhotosTabContent';
import DefaultTabContent from '../../Component/Explore/DefaultTabContent';
import Link from 'next/link';

const useTrendingPosts = (trendingPosts, timeFilter) => {
    const withinTimeFilter = useCallback((post) => {
        if (!post?.createdAt) return false;
        const created = new Date(post.createdAt);
        const now = new Date();
        const diff = now - created;

        switch (timeFilter) {
            case 'today': return diff <= 86_400_000;
            case 'week': return diff <= 604_800_000;
            case 'month': return diff <= 2_592_000_000;
            default: return true;
        }
    }, [timeFilter]);

    const trendingToShow = useMemo(() => {
        return (trendingPosts || [])
            .filter(withinTimeFilter)
            .map(p => {
                const likes = Array.isArray(p?.likes) ? p?.likes.length : (p?.likes || 0);
                const comments = Array.isArray(p?.comments) ? p?.comments.length : (p?.comments || 0);
                const shares = p?.shares || 0;
                const views = p?.views || 0;
                const score = likes * 2 + comments * 3 + shares * 5 + views * 0.1;
                return { ...p, score };
            })
            .sort((a, b) => b.score - a.score);
    }, [trendingPosts, withinTimeFilter]);

    return trendingToShow;
};

const useFollowingPhotos = (user, posts) => useMemo(() => {
    const followingIds = new Set(user?.following?.map(f => f._id));
    return posts.flatMap(p =>
        (!followingIds.size || followingIds.has(p.user?._id))
            ? (p.Photos || [])
            : []
    );
}, [user?.following, posts]);

const DesignExplore = memo(({
    search, setSearch, searchResults, activeTab, setActiveTab,
    finalTabs, topHashtags, user, trendingPosts = [], posts, suggestedUsersArr = []
}) => {
    const { t } = useTranslation();
    const [timeFilter, setTimeFilter] = useState('today');

    const trendingToShow = useTrendingPosts(trendingPosts, timeFilter);
    const followingPhotos = useFollowingPhotos(user, posts);
    const hasSearchQuery = search.trim().length > 0;

    const allTabs = useMemo(
        () => [...finalTabs, { name: 'Trending' }, { name: 'Hashtags' }, { name: 'Photos' }],
        [finalTabs]
    );

    // Enhanced stats for the header
    const stats = useMemo(() => ({
        totalPosts: posts?.length || 0,
        totalUsers: suggestedUsersArr?.length || 0,
        totalHashtags: topHashtags?.length || 0,
        trendingCount: trendingToShow?.length || 0
    }), [posts, suggestedUsersArr, topHashtags, trendingToShow]);

    // Tab icons mapping
    const tabIcons = {
        'Trending': HiTrendingUp,
        'Hashtags': HiHashtag,
        'Photos': HiPhoto,
        'News': HiNewspaper
    };

    return (
        <div className="relative w-full min-h-screen px-4 sm:px-8 py-12 lg:px-16 overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-purple-500/5 dark:bg-purple-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/3 dark:bg-pink-500/8 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
            </div>

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Enhanced Header */}
                <header className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-12">
                    <div className="space-y-6 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <HiSignal className="w-4 h-4 animate-pulse" />
                            {t('Discovery Engine Active')}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.85]"
                        >
                            {t('Explore')} <br />
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {t('Everything')}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed"
                        >
                            {t('Discover trending content, connect with creators, and explore the global conversation.')}
                        </motion.p>
                    </div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-xl">
                            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{stats.trendingCount}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 mt-1">{t('Trending')}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-xl">
                            <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{stats.totalHashtags}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 mt-1">{t('Hashtags')}</div>
                        </div>
                    </motion.div>
                </header>

                {/* Enhanced Search Interface */}
                <div className="space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <ExploreSearchBar
                            search={search}
                            setSearch={setSearch}
                            placeholder={t("Search users, posts, hashtags, or topics...")}
                        />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {hasSearchQuery ? (
                            <motion.div
                                key="search-results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="relative z-10"
                            >
                                <div className="bg-white/80 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl p-10">
                                    <SearchResults
                                        searchResults={searchResults}
                                        searchQuery={search}
                                        user={user}
                                        t={t}
                                        maxResults={6}
                                    />
                                    <div className="mt-12 text-center">
                                        <Link
                                            href={`/Pages/Search?q=${encodeURIComponent(search.trim())}`}
                                            className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95 transition-all"
                                        >
                                            <span>
                                                {`${t("View All Results for")} "${search?.trim() || ''}"`}
                                            </span>
                                            <HiArrowRight className="w-5 h-5 rtl:rotate-180" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="tabs-content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Enhanced Tabs */}
                                <div className="mb-10">
                                    <ExploreTabs
                                        allTabs={allTabs}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                    />
                                </div>

                                {/* Tab Content */}
                                <motion.div
                                    layout
                                    className="max-w-5xl mx-auto"
                                >
                                    <AnimatePresence mode="wait">
                                        {allTabs.map((tab) => (
                                            activeTab === tab.name && (
                                                <TabContentWrapper key={tab.name}>
                                                    {tab.name === 'Trending' ? (
                                                        <TrendingTabContent
                                                            trendingToShow={trendingToShow}
                                                            timeFilter={timeFilter}
                                                            setTimeFilter={setTimeFilter}
                                                            t={t}
                                                        />
                                                    ) : tab.name === 'Hashtags' ? (
                                                        <HashtagsTabContent
                                                            topHashtags={topHashtags}
                                                            t={t}
                                                        />
                                                    ) : tab.name === 'Photos' ? (
                                                        <PhotosTabContent
                                                            followingPhotos={followingPhotos}
                                                            t={t}
                                                        />
                                                    ) : (
                                                        <DefaultTabContent
                                                            news={tab.news}
                                                            t={t}
                                                        />
                                                    )}
                                                </TabContentWrapper>
                                            )
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Enhanced Status Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="fixed bottom-8 right-8 hidden lg:flex items-center gap-4 bg-white/80 dark:bg-black/60 backdrop-blur-2xl px-8 py-4 rounded-full border border-gray-200 dark:border-white/10 shadow-2xl z-50"
            >
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
                <div className="flex items-center gap-3">
                    <HiSparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
                        {t('Discovery Active')} • {stats.totalPosts} {t('Posts')}
                    </span>
                </div>
            </motion.div>
        </div>
    );
});

DesignExplore.displayName = "DesignExplore";
export default DesignExplore;