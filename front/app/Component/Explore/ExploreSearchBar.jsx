'use client';

import React, { useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

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
        <div className="w-full">
            <div className="relative flex items-center bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all overflow-hidden">
                {/* Search Icon */}
                <div className="pl-4 text-slate-400">
                    <HiMagnifyingGlass className="w-5 h-5" />
                </div>

                {/* Input Field */}
                <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-12 sm:h-14 bg-transparent text-sm sm:text-base font-semibold outline-none placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white px-3 transition-all"
                />

                {/* Trailing Controls */}
                <div className="pr-4 flex items-center gap-2">
                    <AnimatePresence mode="wait">
                        {search ? (
                            <motion.button
                                key="clear"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => setSearch('')}
                                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-rose-500 transition-colors"
                                aria-label="Clear"
                            >
                                <HiXMark className="w-4 h-4" />
                            </motion.button>
                        ) : (
                            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[10px] font-bold text-slate-400">
                                <span>⌘K</span>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
});

ExploreSearchBar.displayName = 'ExploreSearchBar';
export default ExploreSearchBar;
