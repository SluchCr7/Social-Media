'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    HiFire,
    HiHashtag,
    HiPhoto,
    HiNewspaper,
    HiSparkles
} from 'react-icons/hi2';

const ExploreTabs = ({ allTabs, activeTab, setActiveTab }) => {
    const getIcon = (name) => {
        switch (name) {
            case 'Trending': return <HiFire className="w-5 h-5" />;
            case 'Hashtags': return <HiHashtag className="w-5 h-5" />;
            case 'Photos': return <HiPhoto className="w-5 h-5" />;
            case 'News': return <HiNewspaper className="w-5 h-5" />;
            default: return <HiSparkles className="w-5 h-5" />;
        }
    };

    return (
        <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 blur-3xl rounded-full" />

            {/* Tabs Container */}
            <div className="relative flex items-center justify-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {allTabs.map((tab, index) => {
                    const isActive = activeTab === tab.name;
                    return (
                        <motion.button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative flex items-center gap-3 px-8 py-5 rounded-2xl transition-all ${isActive
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-500/40'
                                : 'bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-indigo-500/30'
                                }`}
                        >
                            {/* Active Glow */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabGlow"
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-2xl rounded-2xl -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Icon */}
                            <div className={`${isActive ? 'text-white' : ''}`}>
                                {getIcon(tab.name)}
                            </div>

                            {/* Label */}
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                {tab.name}
                            </span>

                            {/* Active Indicator Dot */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabDot"
                                    className="w-2 h-2 rounded-full bg-white"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Bottom Separator */}
            <div className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />
        </div>
    );
};

export default ExploreTabs;