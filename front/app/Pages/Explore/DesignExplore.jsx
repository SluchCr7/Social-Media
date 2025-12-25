'use client';

import React, { useEffect, useMemo, useState, memo, useCallback } from 'react';
import { HiMagnifyingGlass, HiArrowRight, HiSignal } from "react-icons/hi2";
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
    }, [trendingPosts, timeFilter]);

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
    finalTabs, topHashtags, user, trendingPosts = [], posts
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

    return (
        <div className="relative min-h-screen px-4 sm:px-8 py-12 lg:px-16 overflow-hidden">
            {/* 🔮 Background Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto space-y-12">
                {/* 🚀 Header */}
                <header className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-gray-100 dark:border-white/5 pb-12">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <HiSignal className="w-3 h-3 animate-pulse" />
                            {t('Search Operation Live')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.9]">
                            {t('Explore')} <br />
                            <span className="text-indigo-500">{t('Entropy')}</span>
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                            {t('Scan the global grid for trending data streams and user nodes.')}
                        </p>
                    </div>
                </header>

                {/* 🔍 Search Interface */}
                <div className="space-y-12">
                    <ExploreSearchBar
                        search={search}
                        setSearch={setSearch}
                        placeholder={t("Scan for users, #tags or signals...")}
                    />

                    <AnimatePresence>
                        {hasSearchQuery && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="relative z-10 bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl p-8"
                            >
                                <SearchResults
                                    searchResults={searchResults}
                                    searchQuery={search}
                                    user={user}
                                    t={t}
                                    maxResults={4}
                                />
                                <div className="mt-12 text-center">
                                    <Link
                                        href={`/Pages/Search?q=${encodeURIComponent(search.trim())}`}
                                        className="inline-flex items-center gap-4 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/30 active:scale-95 transition-all"
                                    >
                                        <span>
                                            {`${t("Expand Data View for")} "${search?.trim() || ''}"`}
                                        </span>
                                        <HiArrowRight className="w-5 h-5 rtl:rotate-180" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!hasSearchQuery && (
                        <>
                            <ExploreTabs
                                allTabs={allTabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />

                            <motion.div
                                layout
                                className="max-w-4xl mx-auto"
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
                        </>
                    )}
                </div>
            </div>

            <div className="fixed bottom-12 right-12 hidden lg:flex items-center gap-4 bg-white/70 dark:bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl z-50">
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-75" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Sync Operational • Neural Exploration
                </span>
            </div>
        </div>
    );
});

DesignExplore.displayName = "DesignExplore";
export default DesignExplore;