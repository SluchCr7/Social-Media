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
    const rankColors = [
        'from-yellow-500 via-orange-500 to-red-500', 
        'from-slate-400 to-slate-550', 
        'from-amber-600 to-amber-750'
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -4 }}
        >
            <Link
                href={`/Pages/Hashtag/${encodeURIComponent(hashtag.name)}`}
                className="group relative flex items-center justify-between p-6 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 hover:border-indigo-500/35 hover:bg-gradient-to-br hover:from-indigo-500/[0.02] hover:to-purple-500/[0.02] transition-all duration-500 shadow-sm hover:shadow-xl overflow-hidden"
            >
                {/* Glow behind top tags */}
                {isTopThree && (
                    <div className="absolute -left-10 -top-10 w-24 h-24 bg-orange-500/5 blur-2xl rounded-full pointer-events-none" />
                )}

                {/* Rank Badge for Top 3 */}
                {isTopThree && (
                    <div className="absolute top-4 right-4">
                        <div className={`px-2.5 py-1 rounded-xl bg-gradient-to-br ${rankColors[index]} flex items-center justify-center text-white font-black text-[9px] uppercase tracking-widest shadow-md`}>
                            Rank #{index + 1}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-105">
                        <HiHashtag className="w-5 h-5" />
                        {isTopThree && (
                            <div className="absolute -top-1.5 -right-1.5">
                                <HiFire className="w-4 h-4 text-orange-500 animate-bounce" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-black text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors truncate text-base tracking-tight">
                            #{hashtag.name}
                        </div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                            {hashtag.count} {t('synchronizations')}
                        </div>
                    </div>
                </div>
                {!isTopThree && (
                    <HiChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                )}
            </Link>
        </motion.div>
    );
});

HashtagCard.displayName = 'HashtagCard';

const UserCard = memo(({ user, index, t }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group p-5 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 shadow-sm hover:shadow-lg hover:bg-gradient-to-br hover:from-purple-500/[0.01] hover:to-pink-500/[0.01] transition-all duration-500 flex items-center justify-between gap-4"
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-12 h-12 flex-shrink-0 group-hover:scale-105 transition-transform duration-550">
                    <Image
                        src={user.profilePhoto?.url || '/default-user.png'}
                        alt={user.username}
                        width={48}
                        height={48}
                        className="rounded-2xl object-cover shadow-sm border border-slate-100 dark:border-white/5"
                    />
                    {user.isVerify && (
                        <div className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-indigo-500 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-md">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <div className="font-extrabold text-sm text-slate-800 dark:text-white truncate group-hover:text-purple-650 dark:group-hover:text-purple-400 transition-colors">
                        {user.profileName || user.username}
                    </div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] truncate mt-0.5">
                        @{user.username}
                    </div>
                </div>
            </div>
            <Link
                href={`/Pages/Profile/${user._id}`}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-550 text-slate-500 dark:text-slate-400 group-hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:shadow-md"
            >
                <HiChevronRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
            {/* Trending Hashtags */}
            <div className="lg:col-span-2 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between border-b border-slate-150/40 dark:border-white/5 pb-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
                            <HiChartBar className="w-6 h-6" />
                            <div className="absolute -top-1 -right-1">
                                <HiBolt className="w-4 h-4 text-yellow-550 animate-bounce" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white uppercase leading-none">
                                {t('Trending Resonance')}
                            </h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
                                <HiArrowTrendingUp className="w-3.5 h-3.5" />
                                {t('Real-time network interactions across the grid')}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {normalizedHashtags.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {normalizedHashtags.slice(0, 8).map((h, index) => (
                            <HashtagCard
                                key={h.name}
                                hashtag={h}
                                index={index}
                                t={t}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-12 text-center rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 bg-gradient-to-br from-white/50 to-indigo-50/20 dark:from-white/[0.01] dark:to-indigo-500/5"
                    >
                        <HiSparkles className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-450 uppercase tracking-widest">
                            {t('Synchronizing network resonance tags...')}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Suggested Users */}
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-4 border-b border-slate-150/40 dark:border-white/5 pb-4"
                >
                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center text-purple-550 shadow-inner">
                        <HiUserPlus className="w-6 h-6" />
                        <div className="absolute -top-1 -right-1">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white uppercase leading-none">
                            {t('Suggested Minds')}
                        </h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                            {t('Discover active curators to follow')}
                        </p>
                    </div>
                </motion.div>

                {suggestedUsers.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {suggestedUsers.slice(0, 6).map((user, index) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                index={index}
                                t={t}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-gradient-to-br from-white/50 to-purple-50/20 dark:from-white/[0.01] dark:to-purple-500/5"
                    >
                        <HiSparkles className="w-8 h-8 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                        <p className="text-xs font-black text-slate-450 uppercase tracking-widest">
                            {t('Searching for active curators...')}
                        </p>
                    </motion.div>
                )}

                <Link
                    href="/Pages/Explore"
                    className="group flex flex-col items-center justify-center p-6 w-full rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10 text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 hover:bg-gradient-to-br hover:from-indigo-500/[0.02] hover:to-purple-500/[0.02] transition-all gap-3 mt-4"
                >
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all group-hover:scale-105">
                        <HiSparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                        {t('Explore All Curators')}
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default memo(TrendingSection);
