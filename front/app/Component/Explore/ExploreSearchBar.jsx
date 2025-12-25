'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ExploreSearchBar = ({ search, setSearch, placeholder }) => {
    return (
        <div className="max-w-4xl mx-auto mb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group lg:scale-110"
            >
                <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-[3rem] opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all">
                    <div className="pl-8 pr-4">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={placeholder}
                        className="w-full h-20 bg-transparent text-xl font-medium outline-none placeholder-gray-400 dark:placeholder-gray-600 pr-8"
                    />

                    <div className="pr-8 flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-[9px] font-black uppercase text-gray-400 tracking-widest">
                            <span>⌘</span>
                            <span>K</span>
                        </div>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-rose-500 transition-colors"
                                aria-label="Clear Search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ExploreSearchBar;