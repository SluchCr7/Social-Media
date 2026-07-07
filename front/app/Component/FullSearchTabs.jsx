'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    HiHashtag,
    HiUser,
    HiDocumentText,
    HiPhoto,
    HiSparkles,
    HiArrowRight,
    HiFire,
    HiClock,
    HiHeart,
    HiUserGroup,
    HiChevronRight
} from 'react-icons/hi2';
import Image from 'next/image';

// Component Imports
import ExploreTabs from './Explore/ExploreTabs';
import UserCard from './UserCard';
import SluchitEntry from './SluchitEntry';
import { useSearch } from '../Context/SearchContext';

const TABS = (t) => [
    { name: t("Top"), key: 'top', icon: HiSparkles },
    { name: t("Users"), key: 'users', icon: HiUser },
    { name: t("Posts"), key: 'posts', icon: HiDocumentText },
    { name: t("Hashtags"), key: 'hashtags', icon: HiHashtag },
    { name: t("Communities"), key: 'communities', icon: HiUserGroup }
];

const EmptyState = memo(({ message, t }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-white/50 to-indigo-55/30 dark:from-white/[0.01] dark:to-indigo-500/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/5"
    >
        <div className="relative w-20 h-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6">
            <HiSparkles className="w-10 h-10 text-slate-200 dark:text-slate-700 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200 dark:border-white/10 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            {message || t("No matches found in this channel")}
        </p>
        <p className="text-xs text-slate-400 mt-2 max-w-md text-center">
            {t("Try altering your keywords or filters to discover content.")}
        </p>
    </motion.div>
));

EmptyState.displayName = 'EmptyState';

const SectionHeader = memo(({ icon: Icon, title, count, onViewAll, color = 'indigo', t }) => (
    <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-${color}-500/10 text-${color}-500 dark:text-${color}-400`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {title}
                </h3>
                {count !== undefined && (
                    <p className="text-[9px] font-black text-slate-450 uppercase tracking-wider">
                        {count} {t('Results')}
                    </p>
                )}
            </div>
        </div>
        {onViewAll && (
            <button
                onClick={onViewAll}
                className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-${color}-500 hover:text-${color}-600 dark:text-${color}-450 transition-colors group`}
            >
                {t("View All")}
                <HiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
        )}
    </div>
));

SectionHeader.displayName = 'SectionHeader';

const CommunityCard = memo(({ community, t }) => (
    <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        className="group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-slate-250/50 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-500 p-6 flex flex-col justify-between"
    >
        {/* Cover Art Background */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 -z-10" />

        <div className="flex items-start gap-4 mt-4">
            <div className="w-16 h-16 relative rounded-2xl overflow-hidden border-2 border-white dark:border-slate-900 shadow-md">
                <Image
                    src={community.Picture?.url || '/default-community.png'}
                    alt={community.Name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors tracking-tight text-base">
                    {community.Name}
                </h4>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
                    <HiUserGroup className="w-3.5 h-3.5" />
                    {community.membersCount || 0} {t('members')}
                </span>
            </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-4 leading-relaxed flex-1">
            {community.description || t('Welcome to our community, join us to connect!')}
        </p>

        <div className="mt-6 flex justify-end">
            <Link
                href={`/Pages/Community/${community._id || community.Name}`}
                className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
                <span>{t('Enter')}</span>
                <HiChevronRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    </motion.div>
));

CommunityCard.displayName = 'CommunityCard';

const FullSearchTabs = ({ searchResults, searchQuery, user, t, sortBy = 'relevance' }) => {
    const [activeTab, setActiveTab] = useState('top');
    const { addToHistory, pagination, loadMore, loading } = useSearch();

    const { users = [], hashtags = [], posts = [], communities = [] } = searchResults || {};

    // Sort results based on sortBy option
    const sortedResults = useMemo(() => {
        const sortFn = (a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                case 'popular':
                    return (b.likes?.length || b.count || b.membersCount || 0) - (a.likes?.length || a.count || a.membersCount || 0);
                default: // relevance
                    return 0;
            }
        };

        return {
            users: [...users].sort(sortFn),
            hashtags: [...hashtags].sort(sortFn),
            posts: [...posts].sort(sortFn),
            communities: [...communities].sort(sortFn),
        };
    }, [users, hashtags, posts, communities, sortBy]);

    const topResults = useMemo(() => ({
        users: sortedResults.users.slice(0, 4),
        hashtags: sortedResults.hashtags.slice(0, 6),
        posts: sortedResults.posts.slice(0, 3),
        communities: sortedResults.communities.slice(0, 3),
    }), [sortedResults]);

    const handleResultClick = useCallback((query, type, id) => {
        addToHistory(query, type, id);
    }, [addToHistory]);

    const CurrentContent = useCallback(() => {
        if (!searchQuery.trim()) return null;

        switch (activeTab) {
            case 'top':
                const hasResults = 
                    topResults.users.length > 0 || 
                    topResults.posts.length > 0 || 
                    topResults.hashtags.length > 0 ||
                    topResults.communities.length > 0;

                if (!hasResults) return <EmptyState t={t} />;

                return (
                    <div className="space-y-16 pb-20">
                        {/* Top Users */}
                        {topResults.users.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <SectionHeader
                                    icon={HiUser}
                                    title={t("Top Creators")}
                                    count={users.length}
                                    onViewAll={() => setActiveTab('users')}
                                    color="indigo"
                                    t={t}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {topResults.users.map((u, index) => (
                                        <motion.div
                                            key={u?._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <UserCard user={u} t={t} isCompact={true} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Top Communities */}
                        {topResults.communities.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-6"
                            >
                                <SectionHeader
                                    icon={HiUserGroup}
                                    title={t("Top Communities")}
                                    count={communities.length}
                                    onViewAll={() => setActiveTab('communities')}
                                    color="emerald"
                                    t={t}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {topResults.communities.map((c, index) => (
                                        <motion.div
                                            key={c?._id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <CommunityCard community={c} t={t} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Top Hashtags */}
                        {topResults.hashtags.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-6"
                            >
                                <SectionHeader
                                    icon={HiHashtag}
                                    title={t("Trending Hashtags")}
                                    count={hashtags.length}
                                    onViewAll={() => setActiveTab('hashtags')}
                                    color="purple"
                                    t={t}
                                />
                                <div className="flex flex-wrap gap-3">
                                    {topResults.hashtags.map((h, index) => (
                                        <motion.div
                                            key={h.name}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                        >
                                            <Link
                                                href={`/Pages/Hashtag/${encodeURIComponent(h.name)}`}
                                                onClick={() => handleResultClick(h.name, 'hashtag')}
                                                className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-205 dark:border-white/5 hover:border-purple-500/30 hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-pink-500/5 transition-all shadow-sm hover:shadow-lg"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                                                    <HiHashtag className="w-4 h-4 text-purple-500 group-hover:text-white" />
                                                </div>
                                                <span className="font-extrabold text-slate-800 dark:text-white group-hover:text-purple-500 transition-colors">
                                                    #{h.name}
                                                </span>
                                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                                                    <HiFire className="w-3 h-3 text-orange-500" />
                                                    {h.count}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Top Posts */}
                        {topResults.posts.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-6"
                            >
                                <SectionHeader
                                    icon={HiDocumentText}
                                    title={t("Recent Signals")}
                                    count={posts.length}
                                    onViewAll={() => setActiveTab('posts')}
                                    color="pink"
                                    t={t}
                                />
                                <div className="space-y-4">
                                    {topResults.posts.map((p, index) => (
                                        <motion.div
                                            key={p?._id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                            onClick={() => handleResultClick(searchQuery, 'post', p._id)}
                                        >
                                            <SluchitEntry post={p} t={t} isPreview={true} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>
                );

            case 'users':
                if (sortedResults.users.length === 0) return <EmptyState t={t} />;
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        {sortedResults.users.map((u, index) => (
                            <motion.div
                                key={u?._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.04 }}
                            >
                                <UserCard user={u} t={t} isCompact={false} />
                            </motion.div>
                        ))}
                    </div>
                );

            case 'posts':
                if (sortedResults.posts.length === 0) return <EmptyState t={t} />;
                return (
                    <div className="space-y-6 max-w-3xl mx-auto pb-20">
                        {sortedResults.posts.map((p, index) => (
                            <motion.div
                                key={p?._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                            >
                                <SluchitEntry post={p} t={t} />
                            </motion.div>
                        ))}
                    </div>
                );

            case 'communities':
                if (sortedResults.communities.length === 0) return <EmptyState t={t} />;
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        {sortedResults.communities.map((c, index) => (
                            <motion.div
                                key={c?._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.04 }}
                            >
                                <CommunityCard community={c} t={t} />
                            </motion.div>
                        ))}
                    </div>
                );

            case 'hashtags':
                if (sortedResults.hashtags.length === 0) return <EmptyState t={t} />;
                return (
                    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
                        {sortedResults.hashtags.map((h, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.04 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                            >
                                <Link
                                    href={`/Pages/Hashtag/${encodeURIComponent(h.name)}`}
                                    onClick={() => handleResultClick(h.name, 'hashtag')}
                                    className="group flex justify-between items-center p-6 bg-white dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 rounded-3xl hover:border-indigo-500/30 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 transition-all shadow-sm hover:shadow-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all group-hover:rotate-6">
                                            <HiHashtag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors">
                                                #{h.name}
                                            </h4>
                                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                                                <HiFire className="w-3 h-3 text-orange-500" />
                                                {h.count} {t("signals")}
                                            </p>
                                        </div>
                                    </div>
                                    <HiArrowRight className="w-5 h-5 text-slate-200 dark:text-slate-800 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    }, [activeTab, topResults, sortedResults, searchQuery, users.length, hashtags.length, posts.length, communities.length, handleResultClick, setActiveTab, t]);

    // Check if current tab has more pages to load
    const hasMore = useMemo(() => {
        if (activeTab === 'top') return false;
        return pagination[activeTab]?.hasMore || false;
    }, [pagination, activeTab]);

    return (
        <div className="w-full space-y-10">
            {/* Sticky Navigation Tabs */}
            <div className="sticky top-0 z-30 py-4 bg-[#fafafa]/90 dark:bg-[#050505]/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-sm">
                <ExploreTabs
                    allTabs={TABS(t)}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>

            {/* Content Segment */}
            <div className="min-h-[400px]">
                <CurrentContent />
            </div>

            {/* loadMore pagination trigger */}
            {hasMore && (
                <div className="flex justify-center pb-16">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => loadMore(activeTab)}
                        disabled={loading}
                        className="px-8 py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                <span>{t('Fetching...')}</span>
                            </>
                        ) : (
                            <>
                                <span>{t('Load More Results')}</span>
                                <HiArrowRight className="w-3.5 h-3.5 rotate-90" />
                            </>
                        )}
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default memo(FullSearchTabs);