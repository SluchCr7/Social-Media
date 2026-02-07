'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    HiHashtag,
    HiUserPlus,
    HiChartBar,
    HiChevronRight,
    HiSparkles,
    HiArrowTrendingUp,
    HiFire,
    HiBolt
} from 'react-icons/hi2';
import Image from 'next/image';

const HashtagCard = memo(({ hashtag, index, t }) => {
    const isTopThree = index < 3;
    const rankColors = ['from-yellow-500 to-orange-500', 'from-gray-400 to-gray-500', 'from-amber-600 to-amber-700'];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -4 }}
        >
            <Link
                href={`/Pages/Hashtag/${encodeURIComponent(hashtag.name)}`}
                className="group relative flex items-center justify-between p-6 rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-indigo-500/30 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 overflow-hidden"
            >
                {/* Rank Badge for Top 3 */}
                {isTopThree && (
                    <div className="absolute top-3 right-3">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${rankColors[index]} flex items-center justify-center text-white font-black text-xs shadow-lg`}>
                            #{index + 1}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-5 flex-1">
                    <div className="relative w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-12 group-hover:scale-110">
                        <HiHashtag className="w-6 h-6" />
                        {isTopThree && (
                            <div className="absolute -top-1 -right-1">
                                <HiFire className="w-4 h-4 text-orange-500 animate-pulse" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-lg text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors truncate">
                            #{hashtag.name}
                        </div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse" />
                            {hashtag.count} {t('synchronizations')}
                        </div>
                    </div>
                </div>
                <HiChevronRight className="w-5 h-5 text-gray-200 dark:text-gray-800 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
        </motion.div>
    );
});

HashtagCard.displayName = 'HashtagCard';

const UserCard = memo(({ user, index, t }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (index * 0.1), type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="group p-5 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-500/5 hover:to-pink-500/5 transition-all duration-500 flex items-center gap-4"
        >
            <div className="relative w-14 h-14 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                <Image
                    src={user.profilePhoto?.url || '/default-user.png'}
                    alt={user.username}
                    width={56}
                    height={56}
                    className="rounded-2xl object-cover shadow-lg border-2 border-transparent group-hover:border-purple-500/30 transition-all"
                />
                {user.isVerify && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-black" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-extrabold text-sm text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {user.profileName || user.username}
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] truncate">
                    @{user.username}
                </div>
            </div>
            <Link
                href={`/Pages/Profile/${user._id}`}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-500/30"
            >
                <HiChevronRight className="w-5 h-5" />
            </Link>
        </motion.div>
    );
});

UserCard.displayName = 'UserCard';

const TrendingSection = ({ topHashtags = [], suggestedUsers = [], t }) => {
    const normalizedHashtags = topHashtags.map(h =>
        Array.isArray(h) ? { name: h[0], count: h[1] } : h
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full max-w-7xl mx-auto">
            {/* Trending Hashtags */}
            <div className="lg:col-span-2 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-2"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-500 shadow-inner">
                            <HiChartBar className="w-7 h-7" />
                            <div className="absolute -top-1 -right-1">
                                <HiBolt className="w-4 h-4 text-yellow-500 animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase leading-none mb-1">
                                {t('Network Resonance')}
                            </h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <HiArrowTrendingUp className="w-3 h-3" />
                                {t('Top performing hashtags across the grid')}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {normalizedHashtags.slice(0, 8).map((h, index) => (
                        <HashtagCard
                            key={h.name}
                            hashtag={h}
                            index={index}
                            t={t}
                        />
                    ))}
                </div>

                {normalizedHashtags.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-12 text-center rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10 bg-gradient-to-br from-gray-50/50 to-indigo-50/30 dark:from-white/[0.01] dark:to-indigo-500/5"
                    >
                        <HiSparkles className="w-12 h-12 text-gray-200 dark:text-gray-800 mx-auto mb-4" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                            {t('Waiting for network trends...')}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Suggested Users */}
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-4"
                >
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-500 shadow-inner">
                        <HiUserPlus className="w-7 h-7" />
                        <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase leading-none mb-1">
                            {t('Nodes')}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            {t('Suggested discovery')}
                        </p>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    {suggestedUsers.slice(0, 6).map((user, index) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            index={index}
                            t={t}
                        />
                    ))}
                </div>

                {suggestedUsers.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 text-center rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10 bg-gradient-to-br from-gray-50/50 to-purple-50/30 dark:from-white/[0.01] dark:to-purple-500/5"
                    >
                        <HiSparkles className="w-10 h-10 text-gray-200 dark:text-gray-800 mx-auto mb-3" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            {t('No minds found in this sector.')}
                        </p>
                    </motion.div>
                )}

                <Link
                    href="/Pages/Explore"
                    className="group flex flex-col items-center justify-center p-8 w-full rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10 text-gray-400 hover:text-indigo-500 hover:border-indigo-500/50 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 transition-all gap-4"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all group-hover:scale-110">
                        <HiSparkles className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        {t('Explore All Network Nodes')}
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default memo(TrendingSection);
