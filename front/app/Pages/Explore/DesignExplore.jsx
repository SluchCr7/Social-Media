'use client';

import React, { useMemo, useState, memo } from 'react';
import {
  HiMagnifyingGlass,
  HiArrowRight,
  HiPhoto,
  HiHashtag,
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
import { useDebounce } from '@/app/hooks/useDebounce';
import { useThrottle } from '@/app/hooks/useThrottle';

// --- Photo Card Component ---
const ExplorePhotoCard = memo(({ photo, index }) => {
    const { setImageView } = usePost();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(index * 0.03, 0.3) }}
            whileHover={{ scale: 0.98 }}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 cursor-pointer shadow-sm hover:shadow-md transition-all"
            onClick={() => setImageView && setImageView({ url: photo.url, postUrl: photo.postUrl })}
        >
            <Image
                src={photo.url}
                alt="Visual Feed"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay Details */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 text-white font-bold text-sm">
                <span className="flex items-center gap-1">
                    <HiHeart className="w-4 h-4 text-rose-500" />
                    {photo.likes}
                </span>
                <span className="flex items-center gap-1">
                    <HiChatBubbleLeft className="w-4 h-4 text-indigo-400" />
                    {photo.comments}
                </span>
            </div>
        </motion.div>
    );
});
ExplorePhotoCard.displayName = "ExplorePhotoCard";

// --- Video Card Component ---
const ExploreVideoCard = memo(({ video, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(index * 0.03, 0.3) }}
            whileHover={{ scale: 0.98 }}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-sm hover:shadow-md transition-all"
        >
            <video
                src={video.url}
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                onMouseEnter={(e) => e.target.play().catch(() => {})}
                onMouseLeave={(e) => e.target.pause()}
            />
            {/* Overlay Details */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 text-white font-bold text-sm z-10">
                <span className="flex items-center gap-1">
                    <HiHeart className="w-4 h-4 text-rose-500" />
                    {video.likes}
                </span>
                <span className="flex items-center gap-1">
                    <HiChatBubbleLeft className="w-4 h-4 text-indigo-400" />
                    {video.comments}
                </span>
            </div>
            <div className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
                <HiVideoCamera className="w-3.5 h-3.5" />
            </div>
            <Link href={video.postUrl} className="absolute inset-0 z-20" />
        </motion.div>
    );
});
ExploreVideoCard.displayName = "ExploreVideoCard";

// --- Metric Stat Pill ---
const StatPill = memo(({ value, label }) => (
    <div className="px-4 py-2 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col items-center sm:items-start">
        <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">{value}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
    </div>
));
StatPill.displayName = 'StatPill';

const DesignExplore = memo(({
    search, setSearch, searchResults, activeTab, setActiveTab,
    finalTabs = [], topHashtags = [], user, posts = [], suggestedUsersArr = [], loading = false, hasMore = false, loadMore
}) => {
    const { t } = useTranslation();
    const [timeFilter, setTimeFilter] = useState('today');

    const debouncedSearch = useDebounce(search, 300);
    const hasSearchQuery = debouncedSearch.trim().length > 0;

    const throttledLoadMore = useThrottle(() => {
        if (loadMore && !loading) {
            loadMore();
        }
    }, 500);

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
        <div className="relative w-full min-h-screen pt-6 pb-16 px-4 sm:px-8 lg:px-16 bg-slate-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-8">

                {loading && posts.length === 0 ? (
                    <ExploreSkeleton />
                ) : (
                    <>
                        {/* Header Section */}
                        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                    {t('Explore')}
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                    {t('Discover trending topics, photos, videos, and creators.')}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <StatPill value={stats.activeFeeds} label={t('Feeds')} />
                                <StatPill value={`#${stats.topTag}`} label={t('Top Tag')} />
                                <StatPill value={stats.creatorCount} label={t('Creators')} />
                            </div>
                        </header>

                        {/* Search Bar */}
                        <div className="space-y-6">
                            <ExploreSearchBar
                                search={search}
                                setSearch={setSearch}
                                placeholder={t("Search creators, tags, keywords...")}
                            />

                            <AnimatePresence mode="wait">
                                {hasSearchQuery ? (
                                    <motion.div
                                        key="search-results"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm p-5 sm:p-8">
                                            <SearchResults
                                                searchResults={searchResults}
                                                searchQuery={search}
                                                user={user}
                                                t={t}
                                                maxResults={6}
                                            />
                                            <div className="mt-8 text-center">
                                                <Link
                                                    href={`/Pages/Search?q=${encodeURIComponent(search.trim())}`}
                                                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm"
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
                                        className="space-y-6"
                                    >
                                        <ExploreTabs
                                            allTabs={allTabs}
                                            activeTab={activeTab}
                                            setActiveTab={setActiveTab}
                                        />

                                        <div className="min-h-[400px]">
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
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                                                {explorePhotos.map((photo, idx) => (
                                                                    <ExplorePhotoCard
                                                                        key={photo.url || idx}
                                                                        photo={photo}
                                                                        index={idx}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="py-16 text-center text-slate-400 space-y-2">
                                                                <HiPhoto className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                                                                <p className="text-xs font-semibold">{t('No photos found.')}</p>
                                                            </div>
                                                        )}
                                                    </TabContentWrapper>
                                                )}

                                                {activeTab === 'Videos' && (
                                                    <TabContentWrapper key="videos">
                                                        {exploreVideos.length > 0 ? (
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                                                {exploreVideos.map((video, idx) => (
                                                                    <ExploreVideoCard
                                                                        key={video.url || idx}
                                                                        video={video}
                                                                        index={idx}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="py-16 text-center text-slate-400 space-y-2">
                                                                <HiVideoCamera className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                                                                <p className="text-xs font-semibold">{t('No videos found.')}</p>
                                                            </div>
                                                        )}
                                                    </TabContentWrapper>
                                                )}

                                                {activeTab === 'Creators' && (
                                                    <TabContentWrapper key="creators">
                                                        {suggestedUsersArr.length > 0 ? (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {suggestedUsersArr.map((creator, idx) => (
                                                                    <motion.div
                                                                        key={creator._id}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                                                                    >
                                                                        <UserCard user={creator} t={t} />
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="py-16 text-center text-slate-400 space-y-2">
                                                                <HiUsers className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                                                                <p className="text-xs font-semibold">{t('No creators found.')}</p>
                                                            </div>
                                                        )}
                                                    </TabContentWrapper>
                                                )}

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
                                        </div>

                                        {/* Throttled Load More Button */}
                                        {hasMore && !hasSearchQuery && (
                                            <div className="flex justify-center pt-6">
                                                <button
                                                    onClick={throttledLoadMore}
                                                    disabled={loading}
                                                    className="px-6 py-2.5 bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/40 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                                            <span>{t('Loading...')}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>{t('Load More')}</span>
                                                            <HiArrowRight className="w-3.5 h-3.5 rotate-90" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

DesignExplore.displayName = "DesignExplore";
export default DesignExplore;
