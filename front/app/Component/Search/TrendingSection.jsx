'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiHashtag, HiUserPlus, HiChartBar } from 'react-icons/hi2';

const TrendingSection = ({ topHashtags = [], suggestedUsers = [], t }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-[1400px] mx-auto">
            {/* Trending Hashtags */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                        <HiChartBar className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
                            {t('Network Resonance')}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {t('Top performing hashtags across the grid')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topHashtags.slice(0, 8).map(([tag, count], index) => (
                        <motion.div
                            key={tag}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                                className="group flex items-center justify-between p-6 rounded-[2rem] bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300 shadow-sm hover:shadow-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-inner">
                                        <HiHashtag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-black text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                                            #{tag}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            {count} {t('synchronizations')}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-gray-100 dark:text-white/5 group-hover:text-indigo-500/20 transition-colors">
                                    0{index + 1}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Suggested Users */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                        <HiUserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
                            {t('Nodes')}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {t('Suggested discovery')}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {suggestedUsers.slice(0, 5).map((user, index) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (index * 0.1) }}
                            className="p-5 rounded-3xl bg-white/50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                        >
                            <img
                                src={user.profilePhoto?.url || '/default-user.png'}
                                alt={user.username}
                                className="w-12 h-12 rounded-2xl object-cover shadow-lg"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="font-black text-sm text-gray-900 dark:text-white truncate">
                                    {user.profileName || user.username}
                                </div>
                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">
                                    @{user.username}
                                </div>
                            </div>
                            <Link
                                href={`/Pages/Profile/${user._id}`}
                                className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                            >
                                {t('Connect')}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <Link
                    href="/Pages/Explore"
                    className="flex items-center justify-center p-4 w-full rounded-2xl border border-dashed border-gray-200 dark:border-white/10 text-gray-400 hover:text-indigo-500 hover:border-indigo-500/50 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                >
                    {t('Discover More Nodes')}
                </Link>
            </div>
        </div>
    );
};

export default TrendingSection;
