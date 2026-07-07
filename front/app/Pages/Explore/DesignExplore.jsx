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
    HiNewspaper,
    HiVideoCamera,
    HiUsers,
    HiHeart,
    HiChatBubbleLeft,
    HiArrowTrendingUp
} from "react-icons/hi2";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { usePost } from '@/app/Context/PostContext';
import ExploreSearchBar from '../../Component/Explore/ExploreSearchBar';
import SearchResults from '../../Component/Explore/SearchResults';
import ExploreTabs from '../../Component/Explore/ExploreTabs';
import TabContentWrapper from '../../Component/Explore/TabContentWrapper';
import TrendingTabContent from '../../Component/Explore/TrendingTabContent';
import HashtagsTabContent from '../../Component/Explore/HashtagsTabContent';
import DefaultTabContent from '../../Component/Explore/DefaultTabContent';
import ExploreSkeleton from '../../Skeletons/ExploreSkeleton';
import UserCard from '../../Component/UserCard';
import Link from 'next/link';
import Image from 'next/image';

// --- Premium Photo Card ---
const ExplorePhotoCard = memo(({ photo, index }) => {
    const { setImageView } = usePost();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 0.98 }}
            className="group relative aspect-square rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-white/[0.02] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
            onClick={() => setImageView && setImageView({ url: photo.url, postUrl: photo.postUrl })}
        >
            <Image
                src={photo.url}
                alt="Visual Feed"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Overlay Details */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white font-black text-sm">
                <span className="flex items-center gap-1.5">
                    <HiHeart className="w-5 h-5 text-rose-500 animate-pulse" />
                    {photo.likes}
                </span>
                <span className="flex items-center gap-1.5">
                    <HiChatBubbleLeft className="w-5 h-5 text-indigo-400" />
                    {photo.comments}
                </span>
            </div>
        </motion.div>
    );
});
ExplorePhotoCard.displayName = "ExplorePhotoCard";

// --- Premium Video Card ---
const ExploreVideoCard = memo(({ video, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 0.98 }}
            className="group relative aspect-square rounded-[2rem] overflow-hidden bg-slate-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
        >
            <video
                src={video.url}
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-550"
                onMouseEnter={(e) => e.target.play().catch(() => {})}
                onMouseLeave={(e) => e.target.pause()}
            />
            {/* Overlay Details */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white font-black text-sm z-10">
                <span className="flex items-center gap-1.5">
                    <HiHeart className="w-5 h-5 text-rose-500" />
                    {video.likes}
                </span>
                <span className="flex items-center gap-1.5">
                    <HiChatBubbleLeft className="w-5 h-5 text-indigo-400" />
                    {video.comments}
                </span>
            </div>
            {/* Play Badge */}
            <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                <HiVideoCamera className="w-4 h-4" />
            </div>
            <Link href={video.postUrl} className="absolute inset-0 z-20" />
        </motion.div>
    );
});
ExploreVideoCard.displayName = "ExploreVideoCard";

// --- Stat Card ---
const StatCard = memo(({ value, label, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="p-4 sm:p-6 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 backdrop-blur-xl shadow-sm hover:shadow-md transition-all group"
    >
        <div className={`text-2xl sm:text-3xl font-black ${colorClass} group-hover:scale-105 transition-transform origin-left`}>
            {value}
        </div>
        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
            {label}
        </div>
    </motion.div>
));
StatCard.displayName = 'StatCard';

const DesignExplore = memo(({
    search, setSearch, searchResults, activeTab, setActiveTab,
    finalTabs = [], topHashtags = [], user, posts = [], suggestedUsersArr = [], loading = false, hasMore = false, loadMore
}) => {
    const { t } = useTranslation();
    const [timeFilter, setTimeFilter] = useState('today');

    const hasSearchQuery = search.trim().length > 0;

    // Build tabs list
    const allTabs = useMemo(
        () => [
            { name: 'Trending', icon: HiArrowTrendingUp },
            { name: 'Photos', icon: HiPhoto },
            { name: 'Videos', icon: HiVideoCamera },
            { name: 'Hashtags', icon: HiHashtag },
            { name: 'Creators', icon: HiUsers },
            ...finalTabs
        ],
        [finalTabs]
    );

    // Extract photos from active posts
    const explorePhotos = useMemo(() => {
        return posts.flatMap(post => {
            const mediaPhotos = post.media?.filter(m => m.type === 'image').map(m => ({
                url: m.url,
                postUrl: `/Pages/Post/${post._id}`,
                likes: post.likes?.length || 0,
                comments: post.comments?.length || 0
            })) || [];
            const legacyPhotos = post.Photos?.map(url => ({
                url,
                postUrl: `/Pages/Post/${post._id}`,
                likes: post.likes?.length || 0,
                comments: post.comments?.length || 0
            })) || [];
            return [...mediaPhotos, ...legacyPhotos];
        });
    }, [posts]);

    // Extract videos from active posts
    const exploreVideos = useMemo(() => {
        return posts.flatMap(post => {
            const mediaVideos = post.media?.filter(m => m.type === 'video').map(m => ({
                url: m.url,
                postUrl: `/Pages/Post/${post._id}`,
                likes: post.likes?.length || 0,
                comments: post.comments?.length || 0
            })) || [];
            const legacyVideos = post.Videos?.map(url => ({
                url,
                postUrl: `/Pages/Post/${post._id}`,
                likes: post.likes?.length || 0,
                comments: post.comments?.length || 0
            })) || [];
            return [...mediaVideos, ...legacyVideos];
        });
    }, [posts]);

    // Fast analytics stats
    const stats = useMemo(() => ({
        activeFeeds: posts?.length || 0,
        topTag: topHashtags?.[0]?.[0] || 'Trending',
        creatorCount: suggestedUsersArr?.length || 0
    }), [posts?.length, topHashtags, suggestedUsersArr]);

    return (
        <div className="relative w-full min-h-screen pt-6 pb-20 px-4 sm:px-10 lg:px-20 overflow-x-hidden bg-slate-50/30 dark:bg-black text-gray-900 dark:text-white">
            {/* 🌌 Atmospheric Backdrop */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-500/10 blur-[130px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            <div className="max-w-6xl mx-auto space-y-10 sm:space-y-14">
                {loading && posts.length === 0 ? (
                    <ExploreSkeleton />
                ) : (
                    <>
                        {/* ✨ Premium Header */}
                        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                            <div className="space-y-4 max-w-2xl">
                                <motion.div
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
                                >
                                    <HiSignal className="w-3.5 h-3.5 animate-pulse" />
                                    <span>{t('Discovery Engine Active')}</span>
                                </motion.div>

                                <div className="space-y-2">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.9]"
                                    >
                                        {t('Explore')} <br />
                                        <span className="bg-gradient-to-r from-indigo-500 via-purple-550 to-pink-500 bg-clip-text text-transparent">
                                            {t('The Feed')}
                                        </span>
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed"
                                    >
                                        {t('Discover popular streams, hot photography, trending videos, and creators tailored for you.')}
                                    </motion.p>
                                </div>
                            </div>

                            {/* 📊 Rapid Analytics Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
                                <StatCard
                                    value={stats.activeFeeds}
                                    label={t('Hot Content')}
                                    colorClass="text-orange-550"
                                    delay={0.2}
                                />
                                <StatCard
                                    value={`#${stats.topTag}`}
                                    label={t('Top Tag')}
                                    colorClass="text-indigo-500 dark:text-indigo-400"
                                    delay={0.25}
                                />
                                <StatCard
                                    value={stats.creatorCount}
                                    label={t('New Nodes')}
                                    colorClass="text-purple-500"
                                    delay={0.3}
                                />
                            </div>
                        </header>

                        {/* 🔍 Search Vessel */}
                        <div className="space-y-10 sm:space-y-14">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <ExploreSearchBar
                                    search={search}
                                    setSearch={setSearch}
                                    placeholder={t("Search creators, tags, keywords...")}
                                />
                            </motion.div>

                            <AnimatePresence mode="wait">
                                {hasSearchQuery ? (
                                    <motion.div
                                        key="search-results"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        className="relative z-10"
                                    >
                                        <div className="bg-white/80 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl p-6 sm:p-12">
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
                                                    className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl"
                                                >
                                                    <span>{t("View All Results")}</span>
                                                    <HiArrowRight className="w-4 h-4" />
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
                                                {activeTab === 'Trending' && (
                                                    <TabContentWrapper key="trending">
                                                        <TrendingTabContent
                                                            trendingToShow={posts}
                                                            timeFilter={timeFilter}
                                                            setTimeFilter={setTimeFilter}
                                                            t={t}
                                                        />
                                                    </TabContentWrapper>
                                                )}

                                                {activeTab === 'Hashtags' && (
                                                    <TabContentWrapper key="hashtags">
                                                        <HashtagsTabContent
                                                            topHashtags={topHashtags}
                                                            t={t}
                                                        />
                                                    </TabContentWrapper>
                                                )}

                                                {activeTab === 'Photos' && (
                                                    <TabContentWrapper key="photos">
                                                        {explorePhotos.length > 0 ? (
                                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                                                {explorePhotos.map((photo, idx) => (
                                                                    <ExplorePhotoCard
                                                                        key={photo.url || idx}
                                                                        photo={photo}
                                                                        index={idx}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="py-20 text-center space-y-4 opacity-30">
                                                                <HiPhoto className="w-12 h-12 mx-auto text-slate-400" />
                                                                <p className="text-[10px] font-black uppercase tracking-widest">{t('No visual assets detected.')}</p>
                                                            </div>
                                                        )}
                                                    </TabContentWrapper>
                                                )}

                                                {activeTab === 'Videos' && (
                                                    <TabContentWrapper key="videos">
                                                        {exploreVideos.length > 0 ? (
                                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                                                {exploreVideos.map((video, idx) => (
                                                                    <ExploreVideoCard
                                                                        key={video.url || idx}
                                                                        video={video}
                                                                        index={idx}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="py-20 text-center space-y-4 opacity-30">
                                                                <HiVideoCamera className="w-12 h-12 mx-auto text-slate-400" />
                                                                <p className="text-[10px] font-black uppercase tracking-widest">{t('No video assets detected.')}</p>
                                                            </div>
                                                        )}
                                                    </TabContentWrapper>
                                                )}

                                                {activeTab === 'Creators' && (
                                                    <TabContentWrapper key="creators">
                                                        {suggestedUsersArr.length > 0 ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                {suggestedUsersArr.map((creator, idx) => (
                                                                    <motion.div
                                                                        key={creator._id}
                                                                        initial={{ opacity: 0, y: 15 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: idx * 0.04 }}
                                                                    >
                                                                        <UserCard user={creator} t={t} />
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="py-20 text-center space-y-4 opacity-30">
                                                                <HiUsers className="w-12 h-12 mx-auto text-slate-400" />
                                                                <p className="text-[10px] font-black uppercase tracking-widest">{t('No curators detected.')}</p>
                                                            </div>
                                                        )}
                                                    </TabContentWrapper>
                                                )}

                                                {/* Client-only news / interest tabs */}
                                                {allTabs.map((tab) => (
                                                    tab.news && activeTab === tab.name && (
                                                        <TabContentWrapper key={tab.name}>
                                                            <DefaultTabContent
                                                                news={tab.news}
                                                                t={t}
                                                            />
                                                        </TabContentWrapper>
                                                    )
                                                ))}
                                            </AnimatePresence>
                                        </motion.div>

                                        {/* Pagination Button */}
                                        {hasMore && !hasSearchQuery && (
                                            <div className="flex justify-center pt-8 pb-16">
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={loadMore}
                                                    disabled={loading}
                                                    className="px-8 py-3.5 bg-white dark:bg-white/5 border border-slate-205 dark:border-white/10 hover:border-indigo-500/35 text-[10px] font-black uppercase tracking-widest rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-3 disabled:opacity-50"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                                            <span>{t('Cataloging...')}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>{t('Load More Feeds')}</span>
                                                            <HiArrowRight className="w-3.5 h-3.5 rotate-90" />
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </div>

            {/* 📡 Sticky Indicator Hub */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 right-6 hidden md:flex items-center gap-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl px-6 py-3.5 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl z-40 hover:scale-105 transition-transform cursor-default"
            >
                <div className="flex -space-x-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
                <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />
                <div className="flex items-center gap-2">
                    <HiSparkles className="w-4 h-4 text-indigo-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {stats.activeFeeds} {t('Active Feeds')}
                    </span>
                </div>
            </motion.div>
        </div>
    );
});

DesignExplore.displayName = "DesignExplore";
export default DesignExplore;
