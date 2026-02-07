'use client';

import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useSearch } from '@/app/Context/SearchContext';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';
import {
  HiMagnifyingGlass,
  HiSignal,
  HiClock,
  HiXMark,
  HiAdjustmentsHorizontal,
  HiSparkles,
  HiArrowTrendingUp
} from 'react-icons/hi2';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import ExploreSearchBar from '../../Component/Explore/ExploreSearchBar';
import FullSearchTabs from '../../Component/FullSearchTabs';
import TrendingSection from '../../Component/Search/TrendingSection';

const FullSearchResults = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { suggestedUsers } = useUser();
  const { t } = useTranslation();

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchHistory,
    loading,
    addToHistory,
    removeFromHistory,
    clearHistory
  } = useSearch();

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance'); // relevance, recent, popular

  // Sync URL query with search state
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams, setSearchQuery, searchQuery]);

  // Update URL when search changes
  useEffect(() => {
    if (searchQuery.trim()) {
      window.history.replaceState(null, '', `/Pages/Search?q=${encodeURIComponent(searchQuery)}`);
      if (searchQuery.trim().length > 2) {
        addToHistory(searchQuery, 'text');
      }
    } else if (!searchQuery.trim() && searchParams.get('q')) {
      window.history.replaceState(null, '', `/Pages/Search`);
    }
  }, [searchQuery, searchParams, addToHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
      // Escape to clear search
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [searchQuery, setSearchQuery]);

  // Mock top hashtags (will come from explore context later)
  const topHashtags = useMemo(() => [
    ['Technology', 245],
    ['Design', 189],
    ['AI', 167],
    ['Web3', 142],
    ['Startup', 128],
    ['Coding', 115],
    ['Creative', 98],
    ['Innovation', 87]
  ], []);

  // Calculate search stats
  const searchStats = useMemo(() => {
    if (!searchResults) return null;
    const { users = [], hashtags = [], posts = [] } = searchResults;
    return {
      total: users.length + hashtags.length + posts.length,
      users: users.length,
      hashtags: hashtags.length,
      posts: posts.length
    };
  }, [searchResults]);

  const handleClearHistory = useCallback(() => {
    if (window.confirm(t('Are you sure you want to clear your search history?'))) {
      clearHistory?.();
    }
  }, [clearHistory, t]);

  return (
    <div className="relative w-full min-h-screen px-3 sm:px-8 py-6 sm:py-12 lg:px-16 overflow-hidden bg-[#fafafa] dark:bg-[#050505]">
      {/* 🔮 Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-500/5 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full space-y-16">
        {/* 🚀 Enhanced Dynamic Header */}
        <header className="space-y-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between flex-wrap gap-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <HiSignal className="w-3 h-3 animate-pulse" />
                {t('Search Data Index')}
              </div>

              {/* Search Stats */}
              {searchStats && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider text-gray-500"
                >
                  <div className="flex items-center gap-2">
                    <HiArrowTrendingUp className="w-3 h-3" />
                    <span>{searchStats.total} {t('Results')}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.8] break-words"
            >
              {searchQuery ? (
                <>
                  {t('Results for')} <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    &quot;{searchQuery}&quot;
                  </span>
                </>
              ) : (
                <>
                  {t('Grid')} <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {t('Discovery')}
                  </span>
                </>
              )}
            </motion.h1>
          </div>

          {/* 🔍 Enhanced Search Bar with Filters */}
          <div className="w-full pt-8 space-y-4">
            <ExploreSearchBar
              search={searchQuery}
              setSearch={setSearchQuery}
              placeholder={t('Synchronize with the network...')}
            />

            {/* Filter Toggle (shown when there are results) */}
            {searchQuery && searchResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 flex-wrap"
              >
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${showFilters
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-indigo-500/30'
                    }`}
                >
                  <HiAdjustmentsHorizontal className="w-4 h-4" />
                  {t('Filters')}
                </button>

                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  {['relevance', 'recent', 'popular'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${sortBy === option
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                          : 'bg-white/40 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-white/10'
                        }`}
                    >
                      {t(option)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* 🕒 Enhanced Search History */}
          {!searchQuery.trim() && searchHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HiClock className="w-5 h-5 text-gray-400" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    {t('Recent Searches')}
                  </h3>
                </div>
                {clearHistory && (
                  <button
                    onClick={handleClearHistory}
                    className="text-[10px] font-black uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors"
                  >
                    {t('Clear')}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {searchHistory.slice(0, 10).map((item, index) => (
                  <motion.button
                    key={item._id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (index * 0.05) }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchQuery(item.query)}
                    className="group relative px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center gap-2 shadow-sm hover:shadow-xl"
                  >
                    <HiMagnifyingGlass className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {item.query}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 rounded-full hover:bg-red-500/10"
                    >
                      <HiXMark className="w-3 h-3 text-red-500" />
                    </button>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </header>

        {/* 📊 Enhanced Unified Results Feed */}
        <section className="relative">
          <AnimatePresence mode="wait">
            {searchQuery.trim() ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                      </div>
                      <p className="text-sm font-black uppercase tracking-wider text-gray-400">
                        {t('Searching...')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <FullSearchTabs
                    searchResults={searchResults}
                    searchQuery={searchQuery}
                    user={user}
                    t={t}
                    sortBy={sortBy}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="discovery"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="space-y-16"
              >
                <TrendingSection
                  topHashtags={topHashtags}
                  suggestedUsers={suggestedUsers}
                  t={t}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* 🔮 Enhanced Support Indicator */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-12 left-12 hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/10 shadow-xl z-50"
      >
        <div className="relative">
          <HiMagnifyingGlass className="text-indigo-500 w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
          {t('Index Operational')}
        </span>
      </motion.div>

      {/* Keyboard Shortcut Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-12 right-12 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/10 shadow-xl z-50"
      >
        <kbd className="px-2 py-1 text-[9px] font-black bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded">⌘K</kbd>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
          {t('Quick Search')}
        </span>
      </motion.div>
    </div>
  );
};

export default FullSearchResults;
