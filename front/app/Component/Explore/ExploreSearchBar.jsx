'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiMagnifyingGlass, HiXMark, HiSparkles } from 'react-icons/hi2';

const ExploreSearchBar = ({ search, setSearch, placeholder }) => {
    return (
        <div className="max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-[3rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

                {/* Search Container */}
                <div className="relative flex items-center bg-white/80 dark:bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-gray-200 dark:border-white/10 shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 transition-all group-focus-within:border-indigo-500/50 group-focus-within:shadow-indigo-500/20">

                    {/* Left Icon */}
                    <div className="pl-8 pr-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <HiMagnifyingGlass className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={placeholder}
                        className="w-full h-24 bg-transparent text-xl font-semibold outline-none placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white pr-4"
                    />

                    {/* Right Actions */}
                    <div className="pr-8 flex items-center gap-4">
                        {/* Keyboard Shortcut */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-xl text-[9px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest border border-gray-200 dark:border-white/10">
                            <span className="text-sm">⌘</span>
                            <span>K</span>
                        </div>

                        {/* Clear Button */}
                        {search && (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                onClick={() => setSearch('')}
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white hover:shadow-xl hover:shadow-rose-500/30 transition-all active:scale-95"
                                aria-label="Clear Search"
                            >
                                <HiXMark className="w-6 h-6" />
                            </motion.button>
                        )}

                        {/* AI Indicator */}
                        {!search && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                                <HiSparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">AI</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Suggestions Hint */}
                {!search && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 flex items-center justify-center gap-3 flex-wrap"
                    >
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Try:</span>
                        {['#trending', '@creators', 'tech news', 'design'].map((suggestion, i) => (
                            <button
                                key={suggestion}
                                onClick={() => setSearch(suggestion)}
                                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-indigo-500 hover:text-white text-xs font-bold text-gray-600 dark:text-gray-400 transition-all border border-gray-200 dark:border-white/10 hover:border-indigo-500"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ExploreSearchBar;