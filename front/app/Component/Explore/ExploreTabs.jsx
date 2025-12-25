'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiFire, HiHashtag, HiPhoto, HiSignal } from 'react-icons/hi2';

const ExploreTabs = ({ allTabs, activeTab, setActiveTab }) => {
    const getIcon = (name) => {
        switch (name) {
            case 'Trending': return <HiFire className="w-4 h-4" />;
            case 'Hashtags': return <HiHashtag className="w-4 h-4" />;
            case 'Photos': return <HiPhoto className="w-4 h-4" />;
            default: return <HiSignal className="w-4 h-4" />;
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto no-scrollbar pb-4">
            {allTabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                    <motion.button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl transition-all ${isActive
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                                : 'bg-white/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        {getIcon(tab.name)}
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                            {tab.name}
                        </span>
                        {isActive && (
                            <motion.div
                                layoutId="activeTabGlow"
                                className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-2xl -z-10"
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};

export default ExploreTabs;