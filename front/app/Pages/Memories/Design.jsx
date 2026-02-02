'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles, HiOutlineCalendarDays, HiBookmarkSquare, HiArrowLeft } from 'react-icons/hi2';
import SluchitEntry from '@/app/Component/SluchitEntry';
import PostSkeleton from '@/app/Skeletons/PostSkeleton';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const EmptyMemories = React.memo(({ t }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex w-full flex-col items-center justify-center py-20 px-6 text-center"
    >
        <div className="relative mb-8">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center"
            >
                <HiSparkles className="text-indigo-500 w-12 h-12" />
            </motion.div>
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-100 dark:border-white/5"
            >
                <HiBookmarkSquare className="text-purple-500 w-6 h-6" />
            </motion.div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
            {t("No memories from this day yet ✨")}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed font-medium">
            {t("But every post you share today becomes a memory tomorrow. Keep broadcasting your story!")}
        </p>

        <Link href="/Pages/NewPost">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-700 uppercase tracking-widest text-[11px]"
            >
                {t("Create a New Memory")}
            </motion.button>
        </Link>
    </motion.div>
));
EmptyMemories.displayName = 'EmptyMemories';

const MemoriesDesign = ({ memories, isLoading, t }) => {
    return (
        <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#080808] pb-20">
            {/* Header Area */}
            <div className="sticky top-14 lg:top-0 z-30 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 px-6 py-5">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                            <HiArrowLeft className="w-5 h-5 text-gray-500" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {t("Your Memories")}
                                </h1>
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">
                                {t("On this day in past years")}
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                        <HiOutlineCalendarDays className="text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-3xl mx-auto px-4 mt-8">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {[1, 2, 3].map((i) => (
                                <PostSkeleton key={i} />
                            ))}
                        </motion.div>
                    ) : memories.length > 0 ? (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-12"
                        >
                            {memories.map((post) => {
                                const yearsAgo = new Date().getFullYear() - new Date(post.createdAt).getFullYear();
                                return (
                                    <div key={post._id} className="relative group">
                                        {/* Time Indicator Line */}
                                        <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-gray-200 dark:via-white/5 to-transparent hidden md:block" />

                                        {/* Years Ago Badge */}
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-center relative z-10">
                                                <HiBookmarkSquare className="text-indigo-500 w-4 h-4" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10 transition-all group-hover:bg-indigo-500/10">
                                                {yearsAgo} {yearsAgo === 1 ? t("Year Ago") : t("Years Ago")} • {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>

                                        <SluchitEntry post={post} />
                                    </div>
                                );
                            })}

                            <div className="py-10 text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
                                    {t("End of memories for today")}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <EmptyMemories key="empty" t={t} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default React.memo(MemoriesDesign);
