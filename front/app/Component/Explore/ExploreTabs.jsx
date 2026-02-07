'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
    HiFire,
    HiHashtag,
    HiPhoto,
    HiNewspaper,
    HiSparkles
} from 'react-icons/hi2';

const getIcon = (name) => {
    switch (name) {
        case 'Trending': return <HiFire className="w-4 h-4" />;
        case 'Hashtags': return <HiHashtag className="w-4 h-4" />;
        case 'Photos': return <HiPhoto className="w-4 h-4" />;
        case 'News': return <HiNewspaper className="w-4 h-4" />;
        default: return <HiSparkles className="w-4 h-4" />;
    }
};

const ExploreTabs = memo(({ allTabs, activeTab, setActiveTab }) => {
    return (
        <div className="relative w-full overflow-hidden">
            {/* 🛸 Navigation Track */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-4 -mb-4 px-2 sm:px-0">
                {allTabs.map((tab, index) => {
                    const isActive = activeTab === tab.name;
                    return (
                        <motion.button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-300 group whitespace-nowrap ${isActive
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg'
                                : 'bg-white/50 dark:bg-white/[0.03] text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-white/5'
                                }`}
                        >
                            {/* Active Visual Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabPill"
                                    className="absolute inset-0 bg-gray-900 dark:bg-white rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                />
                            )}

                            <div className={`${isActive ? 'scale-110' : 'opacity-70 group-hover:opacity-100'} transition-all`}>
                                {getIcon(tab.name)}
                            </div>

                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em]">
                                {tab.name}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* 💎 Subtle Bottom Border */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent mt-6" />
        </div>
    );
});

ExploreTabs.displayName = 'ExploreTabs';
export default ExploreTabs;
