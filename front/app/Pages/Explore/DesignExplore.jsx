'use client';

import React, { useMemo, useState, memo, useCallback } from 'react';
import {
    HiMagnifyingGlass,
    HiArrowRight,
    HiSignal,
    HiSparkles,
    HiFire,
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
import ExploreSkeleton from '../../Skeletons/ExploreSkeleton';
import Link from 'next/link';

// --- Logic Hooks ---

const useTrendingPostsFallback = (trendingPosts, timeFilter) => {
    const withinTimeFilter = useCallback((post) => {
        if (!post?.createdAt) return false;
        const created = new Date(post.createdAt);
        const now = new Date();
        const diff = now.getTime() - created.getTime();

        switch (timeFilter) {
            case 'today': return diff <= 86_400_000;
            case 'week': return diff <= 604_800_000;
            case 'month': return diff <= 2_592_000_000;
            default: return true;
        }
    }, [timeFilter]);

    return useMemo(() => {
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
};

const useFollowingPhotosFallback = (user, posts) => useMemo(() => {
    if (!posts?.length) return [];
    const followingIds = new Set(user?.following?.map(f => f._id || f) || []);
    return posts.flatMap(p =>
        (!followingIds.size || followingIds.has(p.user?._id || p.user))
            ? (p.Photos || [])
            : []
    );
}, [user?.following, posts]);

// --- Components ---

const StatCard = memo(({ value, label, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className={`p-4 sm:p-6 rounded-3xl bg-white/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 backdrop-blur-xl shadow-sm hover:shadow-md transition-all group`}
    >
        <div className={`text-2xl sm:text-3xl font-black ${colorClass} group-hover:scale-110 transition-transform origin-left`}>
            {value}
        </div>
        <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">
            {label}
        </div>
    </motion.div>
));

StatCard.displayName = 'StatCard';

const DesignExplore = memo(({
    search, setSearch, searchResults, activeTab, setActiveTab,
    finalTabs = [], topHashtags = [], user, trendingPosts = [], posts = [], suggestedUsersArr = [], loading = false
}) => {
    const { t } = useTranslation();
    const [timeFilter, setTimeFilter] = useState('today');

    const trendingToShow = useTrendingPostsFallback(trendingPosts, timeFilter);
    const followingPhotos = useFollowingPhotosFallback(user, posts);
    const hasSearchQuery = search.trim().length > 0;

    const allTabs = useMemo(
        () => [
            { name: 'Trending' },
            { name: 'Hashtags' },
            ...finalTabs,
            { name: 'Photos' }
        ],
        [finalTabs]
    );

    const stats = useMemo(() => ({
        totalPosts: posts?.length || 0,
        trendingCount: trendingToShow?.length || 0,
        topHashtag: topHashtags?.[0]?.[0] || 'Trending'
    }), [posts?.length, trendingToShow?.length, topHashtags]);

    return (
        <div className="relative w-full min-h-screen pt-4 pb-20 px-4 sm:px-10 lg:px-20 overflow-x-hidden">
            {/* 🌌 Atmospheric Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/20 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto space-y-10 sm:space-y-16">
                {loading ? (
                    <ExploreSkeleton />
                ) : (
                    <>
                        {/* ✨ Premium Header */}
                        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                            <div className="space-y-4 sm:space-y-6 max-w-2xl">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em]"
                                >
                                    <HiSignal className="w-3.5 h-3.5 animate-pulse" />
                                    <span>{t('Discovery Engine Active')}</span>
                                </motion.div>

                                <div className="space-y-2">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white leading-[0.9]"
                                    >
                                        {t('Explore')} <br />
                                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            {t('The Future')}
                                        </span>
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-lg leading-relaxed"
                                    >
                                        {t('Uncover the most relevant content, trending topics, and creative minds across the platform.')}
                                    </motion.p>
                                </div>
                            </div>

                            {/* 📊 Rapid Stats */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
                                <StatCard
                                    value={stats.trendingCount}
                                    label={t('Hot Now')}
                                    colorClass="text-orange-500"
                                    delay={0.3}
                                />
                                <StatCard
                                    value={`#${stats.topHashtag}`}
                                    label={t('Top Tag')}
                                    colorClass="text-indigo-600 dark:text-indigo-400"
                                    delay={0.4}
                                />
                            </div>
                        </header>

                        {/* 🔍 Search Section */}
                        <div className="space-y-10 sm:space-y-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <ExploreSearchBar
                                    search={search}
                                    setSearch={setSearch}
                                    placeholder={t("Search everything...")}
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
                                        <div className="bg-white/80 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl p-6 sm:p-12">
                                            <SearchResults
                                                searchResults={searchResults}
                                                searchQuery={search}
                                                user={user}
                                                t={t}
                                                maxResults={8}
                                            />
                                            <div className="mt-12 text-center">
                                                <Link
                                                    href={`/Pages/Search?q=${encodeURIComponent(search.trim())}`}
                                                    className="inline-flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl"
                                                >
                                                    <span>{t("View All Results")}</span>
                                                    <HiArrowRight className="w-4 h-4 rtl:rotate-180" />
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
                                        className="space-y-10"
                                    >
                                        <ExploreTabs
                                            allTabs={allTabs}
                                            activeTab={activeTab}
                                            setActiveTab={setActiveTab}
                                        />

                                        <motion.div layout className="min-h-[400px]">
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
                    </>
                )}
            </div>

            {/* 📡 Status Hub */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 right-6 hidden md:flex items-center gap-4 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-2xl px-6 py-3.5 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl z-50 hover:scale-105 transition-transform cursor-default"
            >
                <div className="flex -space-x-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                </div>
                <div className="h-4 w-px bg-gray-200 dark:bg-white/10" />
                <div className="flex items-center gap-2">
                    <HiSparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
                        {stats.totalPosts} {t('Entities Cataloged')}
                    </span>
                </div>
            </motion.div>
        </div>
    );
});

DesignExplore.displayName = "DesignExplore";
export default DesignExplore;
