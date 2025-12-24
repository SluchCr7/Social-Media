'use client';

import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ExploreSearchBar = React.memo(({ search, setSearch, placeholder = "Search for vibes..." }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-3xl mx-auto mb-12 group"
        >
            {/* Glossy Background Accent */}
            <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-[2.5rem] -z-10 group-focus-within:bg-indigo-500/10 transition-colors" />

            <div className="relative flex items-center bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-1.5 focus-within:border-indigo-500/30 focus-within:bg-white/[0.05] transition-all duration-500 backdrop-blur-xl shadow-2xl">
                <div className="pl-6 flex items-center justify-center text-white/20 group-focus-within:text-indigo-400 transition-colors">
                    <FiSearch size={22} />
                </div>

                <input
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border-none outline-none py-4 px-6 text-white font-medium placeholder:text-white/10 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-[10px]"
                />

                <AnimatePresence>
                    {search && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => setSearch('')}
                            className="mr-3 p-3 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <FiX size={18} />
                        </motion.button>
                    )}
                </AnimatePresence>

                <div className="hidden md:flex items-center gap-2 pr-4 text-white/10 font-black text-[10px] uppercase tracking-widest pointer-events-none">
                    <span className="px-2 py-1 rounded-lg border border-white/5 bg-white/5">Esc</span>
                    <span>to clear</span>
                </div>
            </div>
        </motion.div>
    );
})

ExploreSearchBar.displayName = 'ExploreSearchBar';
export default ExploreSearchBar;