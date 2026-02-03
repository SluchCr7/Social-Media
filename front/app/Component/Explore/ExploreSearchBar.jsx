'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMagnifyingGlass, HiXMark, HiSparkles } from 'react-icons/hi2';

const ExploreSearchBar = ({ search, setSearch, placeholder }) => {
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
        <div className="max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
            >
                {/* 🔮 Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-[4rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 -z-10" />

                {/* 🔍 Search Container */}
                <div className="relative flex items-center bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-3xl rounded-[3rem] border border-gray-200 dark:border-white/10 shadow-2xl transition-all duration-500 group-focus-within:border-indigo-500/50 group-focus-within:shadow-indigo-500/20 group-focus-within:scale-[1.01]">

                    {/* Left Icon (Search Circle) */}
                    <div className="pl-6 pr-2">
                        <motion.div
                            whileHover={{ rotate: 15 }}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-xl shadow-indigo-500/30"
                        >
                            <HiMagnifyingGlass className="w-7 h-7 text-white" />
                        </motion.div>
                    </div>

                    {/* Input Field */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={placeholder}
                        className="w-full h-24 bg-transparent text-xl font-bold outline-none placeholder-gray-400 dark:placeholder-gray-700 text-gray-900 dark:text-white px-6 transition-all"
                    />

                    {/* Right Actions */}
                    <div className="pr-8 flex items-center gap-5">
                        {/* Keyboard Shortcut Hint */}
                        {!search && (
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100/50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.2em] border border-gray-200 dark:border-white/10">
                                <span className="text-sm">⌘</span>
                                <span>K</span>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {search ? (
                                <motion.button
                                    key="clear"
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 45 }}
                                    onClick={() => setSearch('')}
                                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white hover:shadow-xl hover:shadow-rose-500/40 transition-all active:scale-95"
                                    aria-label="Clear Search"
                                >
                                    <HiXMark className="w-6 h-6" />
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="ai"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20"
                                >
                                    <HiSparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">INDEX</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* 🚀 Smart Suggestions */}
                <AnimatePresence>
                    {!search && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 flex items-center justify-center gap-4 flex-wrap"
                        >
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mr-2">Suggestions:</span>
                            {['#trending', '@sluchit', 'web3 discovery', 'music gear'].map((suggestion, i) => (
                                <motion.button
                                    key={suggestion}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + (i * 0.05) }}
                                    onClick={() => setSearch(suggestion)}
                                    className="px-5 py-2.5 rounded-full bg-white dark:bg-white/[0.02] hover:bg-indigo-600 hover:text-white text-[11px] font-bold text-gray-600 dark:text-gray-400 transition-all border border-gray-100 dark:border-white/5 hover:border-indigo-600 shadow-sm"
                                >
                                    {suggestion}
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ExploreSearchBar;