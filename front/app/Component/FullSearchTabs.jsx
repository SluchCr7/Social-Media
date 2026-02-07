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
    HiHeart
} from 'react-icons/hi2';

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
];

const EmptyState = memo(({ message, t }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-white/50 to-indigo-50/30 dark:from-white/[0.01] dark:to-indigo-500/5 rounded-[3rem] border border-dashed border-gray-200 dark:border-white/5"
    >
        <div className="relative w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6">
            <HiSparkles className="w-10 h-10 text-gray-200 dark:text-gray-800" />
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-200 dark:border-white/10 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">
            {message || t("No signals found in this sector")}
        </p>
        <p className="text-xs text-gray-400 mt-2 max-w-md text-center">
            {t("Try adjusting your search or explore trending content")}
        </p>
    </motion.div>
));

EmptyState.displayName = 'EmptyState';

const SectionHeader = memo(({ icon: Icon, title, count, onViewAll, color = 'indigo', t }) => (
    <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-${color}-500/10 text-${color}-500`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
                    {title}
                </h3>
                {count !== undefined && (
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                        {count} {t('Results')}
                    </p>
                )}
            </div>
        </div>
        {onViewAll && (
            <button
                onClick={onViewAll}
                className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-${color}-500 hover:text-${color}-600 transition-colors group`}
            >
                {t("View All")}
                <HiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
        )}
    </div>
));

SectionHeader.displayName = 'SectionHeader';

const FullSearchTabs = ({ searchResults, searchQuery, user, t, sortBy = 'relevance' }) => {
    const [activeTab, setActiveTab] = useState('top');
    const { addToHistory } = useSearch();

    const { users = [], hashtags = [], posts = [] } = searchResults || {};

    // Sort results based on sortBy option
    const sortedResults = useMemo(() => {
        const sortFn = (a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                case 'popular':
                    return (b.likes?.length || b.count || 0) - (a.likes?.length || a.count || 0);
                default: // relevance
                    return 0;
            }
        };

        return {
            users: [...users].sort(sortFn),
            hashtags: [...hashtags].sort(sortFn),
            posts: [...posts].sort(sortFn),
        };
    }, [users, hashtags, posts, sortBy]);

    const topResults = useMemo(() => ({
        users: sortedResults.users.slice(0, 4),
        hashtags: sortedResults.hashtags.slice(0, 6),
        posts: sortedResults.posts.slice(0, 3),
    }), [sortedResults]);

    const handleResultClick = useCallback((query, type, id) => {
        addToHistory(query, type, id);
    }, [addToHistory]);

    const CurrentContent = useCallback(() => {
        if (!searchQuery.trim()) return null;

        switch (activeTab) {
            case 'top':
                const hasResults = topResults.users.length > 0 || topResults.posts.length > 0 || topResults.hashtags.length > 0;

                if (!hasResults) return <EmptyState t={t} />;

                return (
                    <div className="space-y-12 pb-20">
                        {/* Top Users */}
                        {topResults.users.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
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
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <UserCard user={u} t={t} isCompact={true} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Top Hashtags */}
                        {topResults.hashtags.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-8"
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
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                        >
                                            <Link
                                                href={`/Pages/Hashtag/${encodeURIComponent(h.name)}`}
                                                onClick={() => handleResultClick(h.name, 'hashtag')}
                                                className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-purple-500/30 hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-pink-500/5 transition-all shadow-sm hover:shadow-lg"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                                                    <HiHashtag className="w-4 h-4 text-purple-500 group-hover:text-white" />
                                                </div>
                                                <span className="font-extrabold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">
                                                    #{h.name}
                                                </span>
                                                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
                                                    <HiFire className="w-3 h-3" />
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
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-8"
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
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
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
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
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
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <SluchitEntry post={p} t={t} />
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
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                            >
                                <Link
                                    href={`/Pages/Hashtag/${encodeURIComponent(h.name)}`}
                                    onClick={() => handleResultClick(h.name, 'hashtag')}
                                    className="group flex justify-between items-center p-6 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[2rem] hover:border-indigo-500/30 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 transition-all shadow-sm hover:shadow-xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all group-hover:rotate-12">
                                            <HiHashtag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                                                #{h.name}
                                            </h4>
                                            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
                                                <HiFire className="w-3 h-3" />
                                                {h.count} {t("signals")}
                                            </p>
                                        </div>
                                    </div>
                                    <HiArrowRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    }, [activeTab, topResults, sortedResults, searchQuery, users.length, hashtags.length, posts.length, handleResultClick, setActiveTab, t]);

    return (
        <div className="w-full space-y-12">
            {/* Tab Navigation */}
            <div className="sticky top-0 z-30 py-4 bg-[#fafafa]/90 dark:bg-[#050505]/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 shadow-sm">
                <ExploreTabs
                    allTabs={TABS(t)}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>

            {/* Content Display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                >
                    <CurrentContent />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default memo(FullSearchTabs);