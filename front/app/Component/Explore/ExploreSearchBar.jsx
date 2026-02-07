'use client';

import React, { useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMagnifyingGlass, HiXMark, HiSparkles } from 'react-icons/hi2';

const ExploreSearchBar = memo(({ search, setSearch, placeholder }) => {
    const inputRef = useRef(null);

    // Keyboard shortcut ⌘K or Ctrl+K to focus search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="max-w-4xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
            >
                {/* 🌈 Dynamic Outer Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 -z-10" />

                {/* 🛸 Search Vessel */}
                <div className="relative flex items-center bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-3xl rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-xl group-focus-within:border-indigo-500/30 group-focus-within:shadow-2xl transition-all duration-500 overflow-hidden">

                    {/* Leading Icon */}
                    <div className="pl-6">
                        <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg group-focus-within:scale-110 transition-transform duration-500">
                            <HiMagnifyingGlass className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Input Field */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={placeholder}
                        className="w-full h-16 sm:h-20 bg-transparent text-lg sm:text-xl font-bold outline-none placeholder-gray-400 dark:placeholder-white/10 text-gray-900 dark:text-white px-5 transition-all"
                    />

                    {/* Trailing Actions */}
                    <div className="pr-6 flex items-center gap-4">
                        <AnimatePresence mode="wait">
                            {search ? (
                                <motion.button
                                    key="clear"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => setSearch('')}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-rose-500 transition-colors"
                                    aria-label="Clear"
                                >
                                    <HiXMark className="w-5 h-5" />
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="hint"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] text-[10px] font-black text-gray-400 dark:text-gray-500"
                                >
                                    <span>⌘</span>
                                    <span>K</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ✨ Quick Suggestions */}
                {!search && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
                    >
                        {['#vibe', '@trending', 'discover', 'hot'].map((s, i) => (
                            <button
                                key={s}
                                onClick={() => setSearch(s)}
                                className="px-4 py-2 rounded-full border border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:translate-y-[-2px] hover:shadow-lg"
                            >
                                {s}
                            </button>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
});

ExploreSearchBar.displayName = 'ExploreSearchBar';
export default ExploreSearchBar;
