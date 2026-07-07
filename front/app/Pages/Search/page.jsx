'use client';

import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useSearch } from '@/app/Context/SearchContext';
import { useUser } from '@/app/Context/UserContext';
import { useExplore } from '@/app/Context/ExploreContext';
import { useTranslation } from 'react-i18next';
import {
  HiMagnifyingGlass,
  HiSignal,
  HiClock,
  HiXMark,
  HiAdjustmentsHorizontal,
  HiSparkles,
  HiArrowTrendingUp,
  HiCalendar,
  HiPhoto,
  HiShieldCheck,
  HiArrowPath
} from 'react-icons/hi2';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import ExploreSearchBar from '../../Component/Explore/ExploreSearchBar';
import FullSearchTabs from '../../Component/FullSearchTabs';
import TrendingSection from '../../Component/Search/TrendingSection';

const FullSearchResults = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { suggestedUsers } = useUser();
  const { trendingHashtags, suggestedUsers: exploreSuggestedUsers } = useExplore();
  const { t } = useTranslation();

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchHistory,
    loading,
    addToHistory,
    removeFromHistory,
    clearAllHistory,
    sortBy,
    setSortBy,
    dateRange,
    setDateRange,
    hasMedia,
    setHasMedia,
    verifiedOnly,
    setVerifiedOnly,
    pagination
  } = useSearch();

  const [showFilters, setShowFilters] = useState(false);

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

  // Calculate search stats
  const searchStats = useMemo(() => {
    if (!searchResults) return null;
    const { users = [], hashtags = [], posts = [], communities = [] } = searchResults;
    return {
      total: users.length + hashtags.length + posts.length + communities.length,
      users: users.length,
      hashtags: hashtags.length,
      posts: posts.length,
      communities: communities.length
    };
  }, [searchResults]);

  const handleClearHistory = useCallback(() => {
    if (window.confirm(t('Are you sure you want to clear your search history?'))) {
      clearAllHistory?.();
    }
  }, [clearAllHistory, t]);

  const resetFilters = useCallback(() => {
    setSortBy('relevance');
    setDateRange('all');
    setHasMedia(false);
    setVerifiedOnly(false);
  }, [setSortBy, setDateRange, setHasMedia, setVerifiedOnly]);

  return (
    <div className="relative w-full min-h-screen px-4 sm:px-10 py-8 lg:px-20 overflow-hidden bg-slate-50/30 dark:bg-black text-gray-900 dark:text-white">
      {/* 🌌 Ultra Premium Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-15%] w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/10 to-violet-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* 🚀 Header Section */}
        <header className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <HiSignal className="w-3.5 h-3.5 animate-pulse" />
              <span>{t('Search Index Operational')}</span>
            </motion.div>

            {searchStats && searchQuery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-white/5"
              >
                {searchStats.total} {t('Entities Found')}
              </motion.div>
            )}
          </div>

          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none"
            >
              {searchQuery ? (
                <>
                  {t('Results for')} <br />
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                </>
              ) : (
                <>
                  {t('Global')} <br />
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {t('Search Engine')}
                  </span>
                </>
              )}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-lg"
            >
              {t('Search posts, creators, communities, and trending hashtags with advanced intelligence network filters.')}
            </motion.p>
          </div>

          {/* 🔍 Search Input & Action Center */}
          <div className="space-y-6 pt-4">
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <ExploreSearchBar
                  search={searchQuery}
                  setSearch={setSearchQuery}
                  placeholder={t('Search users, posts, hashtags...')}
                />
              </div>

              {/* Advanced Filters Button */}
              {searchQuery.trim() && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-16 px-6 rounded-[2rem] border transition-all duration-300 flex items-center gap-3 font-bold text-sm ${
                    showFilters || sortBy !== 'relevance' || dateRange !== 'all' || hasMedia || verifiedOnly
                      ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-indigo-500/30'
                  }`}
                >
                  <HiAdjustmentsHorizontal className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('Filters')}</span>
                </motion.button>
              )}
            </div>

            {/* 🛠 Interactive Filters Drawer */}
            <AnimatePresence>
              {showFilters && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 backdrop-blur-xl shadow-xl space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                      <div className="flex items-center gap-2.5">
                        <HiAdjustmentsHorizontal className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-800 dark:text-white">
                          {t('Search Filters')}
                        </h3>
                      </div>
                      <button
                        onClick={resetFilters}
                        className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-1"
                      >
                        <HiArrowPath className="w-3.5 h-3.5" />
                        {t('Reset Filters')}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Sort Order */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          {t('Sort By')}
                        </label>
                        <div className="flex flex-col gap-2">
                          {[
                            { id: 'relevance', label: t('Relevance') },
                            { id: 'recent', label: t('Most Recent') },
                            { id: 'popular', label: t('Popularity') }
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setSortBy(opt.id)}
                              className={`w-full text-left px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                                sortBy === opt.id
                                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-extrabold'
                                  : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date Uploaded */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block flex items-center gap-1.5">
                          <HiCalendar className="w-3.5 h-3.5" />
                          {t('Date Posted')}
                        </label>
                        <div className="flex flex-col gap-2">
                          {[
                            { id: 'all', label: t('All Time') },
                            { id: 'day', label: t('Last 24 Hours') },
                            { id: 'week', label: t('Last Week') },
                            { id: 'month', label: t('Last Month') },
                            { id: 'year', label: t('Last Year') }
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setDateRange(opt.id)}
                              className={`w-full text-left px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                                dateRange === opt.id
                                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 font-extrabold'
                                  : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Content Type / Verification */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          {t('Target Criteria')}
                        </label>
                        <div className="space-y-3">
                          {/* Has Media Toggle */}
                          <div
                            onClick={() => setHasMedia(!hasMedia)}
                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
                                <HiPhoto className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                {t('Has Media Only')}
                              </span>
                            </div>
                            <div className={`w-11 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${
                              hasMedia ? 'bg-pink-500' : 'bg-slate-300 dark:bg-white/15'
                            }`}>
                              <div className={`w-4 h-4 rounded-full bg-white transition-all transform duration-300 ${
                                hasMedia ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </div>
                          </div>

                          {/* Verified Users Toggle */}
                          <div
                            onClick={() => setVerifiedOnly(!verifiedOnly)}
                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                                <HiShieldCheck className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                {t('Verified Accounts Only')}
                              </span>
                            </div>
                            <div className={`w-11 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${
                              verifiedOnly ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-white/15'
                            }`}>
                              <div className={`w-4 h-4 rounded-full bg-white transition-all transform duration-300 ${
                                verifiedOnly ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 🕒 Search History Section */}
          {!searchQuery.trim() && searchHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-5xl"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <HiClock className="w-4.5 h-4.5 text-slate-400" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {t('Recent Searches')}
                  </h3>
                </div>
                <button
                  onClick={handleClearHistory}
                  className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 transition-colors"
                >
                  {t('Clear All')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {searchHistory.slice(0, 10).map((item, index) => (
                  <motion.button
                    key={item._id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSearchQuery(item.query)}
                    className="group relative px-4 py-2.5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <HiMagnifyingGlass className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {item.query}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 p-1 rounded-full hover:bg-rose-500/10 text-rose-500"
                    >
                      <HiXMark className="w-3 h-3" />
                    </button>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </header>

        {/* 📊 Unified Results Feed */}
        <section className="relative">
          <AnimatePresence mode="wait">
            {searchQuery.trim() ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {loading && pagination[sortBy === 'relevance' ? 'posts' : 'posts']?.page === 1 ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                      <div className="absolute inset-1 rounded-full border-4 border-purple-500/10 border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {t('Loading search matches...')}
                    </p>
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="pt-4"
              >
                <TrendingSection
                  topHashtags={trendingHashtags || []}
                  suggestedUsers={exploreSuggestedUsers?.length > 0 ? exploreSuggestedUsers : suggestedUsers}
                  t={t}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* 🔮 Support Hint Indicators */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-8 left-8 hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-lg z-40"
      >
        <div className="relative">
          <HiSparkles className="text-indigo-500 w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {t('AI Network Synchronized')}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 hidden lg:flex items-center gap-2 px-4.5 py-2.5 rounded-2xl bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-lg z-40"
      >
        <kbd className="px-1.5 py-0.5 text-[9px] font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded select-none">⌘K</kbd>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {t('Focus Search')}
        </span>
      </motion.div>
    </div>
  );
};

export default FullSearchResults;
