'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HiHashtag, HiUser, HiDocumentText, HiPhoto, HiSparkles, HiArrowRight } from 'react-icons/hi2';

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

const FullSearchTabs = ({ searchResults, searchQuery, user, t }) => {
    const [activeTab, setActiveTab] = useState('top');
    const { addToHistory } = useSearch();

    const { users = [], hashtags = [], posts = [] } = searchResults || {};

    const topResults = useMemo(() => {
        return {
            users: users.slice(0, 4),
            hashtags: hashtags.slice(0, 6),
            posts: posts.slice(0, 3),
        };
    }, [users, hashtags, posts]);

    const handleResultClick = (query, type, id) => {
        addToHistory(query, type, id);
    };

    const EmptyState = ({ message }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-white/[0.01] rounded-[3rem] border border-dashed border-gray-200 dark:border-white/5"
        >
            <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6">
                <HiSparkles className="w-10 h-10 text-gray-200 dark:text-gray-800" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">
                {message || t("No signals found in this sector")}
            </p>
        </motion.div>
    );

    const CurrentContent = () => {
        if (!searchQuery.trim()) return null;

        switch (activeTab) {
            case 'top':
                const hasResults = topResults.users.length > 0 || topResults.posts.length > 0 || topResults.hashtags.length > 0;

                if (!hasResults) return <EmptyState />;

                return (
                    <div className="space-y-12 pb-20">
                        {/* Top Users */}
                        {topResults.users.length > 0 && (
                            <section className="space-y-8">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                                            <HiUser className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">{t("Top Creators")}</h3>
                                    </div>
                                    <button onClick={() => setActiveTab('users')} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:underline">{t("View All")}</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {topResults.users.map((u) => (
                                        <UserCard key={u?._id} user={u} t={t} isCompact={true} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Top Hashtags */}
                        {topResults.hashtags.length > 0 && (
                            <section className="space-y-8">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                                            <HiHashtag className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">{t("Trending Hashtags")}</h3>
                                    </div>
                                    <button onClick={() => setActiveTab('hashtags')} className="text-[10px] font-black uppercase tracking-widest text-purple-500 hover:underline">{t("View All")}</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {topResults.hashtags.map((h) => (
                                        <Link
                                            key={h.name}
                                            href={`/Pages/Hashtag/${encodeURIComponent(h.name)}`}
                                            onClick={() => handleResultClick(h.name, 'hashtag')}
                                            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
                                        >
                                            <span className="font-extrabold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">#{h.name}</span>
                                            <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{h.count}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Top Posts */}
                        {topResults.posts.length > 0 && (
                            <section className="space-y-8">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
                                            <HiDocumentText className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">{t("Recent Signals")}</h3>
                                    </div>
                                    <button onClick={() => setActiveTab('posts')} className="text-[10px] font-black uppercase tracking-widest text-pink-500 hover:underline">{t("View All")}</button>
                                </div>
                                <div className="space-y-4">
                                    {topResults.posts.map((p) => (
                                        <div key={p?._id} onClick={() => handleResultClick(searchQuery, 'post', p._id)}>
                                            <SluchitEntry post={p} t={t} isPreview={true} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                );

            case 'users':
                if (users.length === 0) return <EmptyState />;
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        {users.map((u) => (
                            <UserCard key={u?._id} user={u} t={t} isCompact={false} />
                        ))}
                    </div>
                );

            case 'posts':
                if (posts.length === 0) return <EmptyState />;
                return (
                    <div className="space-y-6 max-w-3xl mx-auto pb-20">
                        {posts.map((p) => (
                            <SluchitEntry key={p?._id} post={p} t={t} />
                        ))}
                    </div>
                );

            case 'hashtags':
                if (hashtags.length === 0) return <EmptyState />;
                return (
                    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
                        {hashtags.map((h, index) => (
                            <Link
                                key={index}
                                href={`/Pages/Hashtag/${encodeURIComponent(h.name)}`}
                                onClick={() => handleResultClick(h.name, 'hashtag')}
                                className="group flex justify-between items-center p-6 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[2rem] hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all shadow-sm hover:shadow-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        <HiHashtag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">#{h.name}</h4>
                                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{h.count} {t("signals")}</p>
                                    </div>
                                </div>
                                <HiArrowRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" />
                            </Link>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    }

    return (
        <div className="w-full space-y-12">
            {/* Tab Navigation */}
            <div className="sticky top-0 z-30 py-4 bg-[#fafafa]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
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

export default FullSearchTabs;