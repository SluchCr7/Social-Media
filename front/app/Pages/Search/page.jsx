'use client';

import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useSearch } from '@/app/Context/SearchContext';
import { useUser } from '@/app/Context/UserContext';
import { useExplore } from '@/app/Context/ExploreContext';
import { useTranslation } from 'react-i18next';
import {
  HiMagnifyingGlass,
  HiClock,
  HiXMark,
  HiAdjustmentsHorizontal,
  HiCalendar,
  HiPhoto,
  HiShieldCheck,
  HiArrowPath
} from 'react-icons/hi2';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/app/hooks/useDebounce';

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
  const debouncedQuery = useDebounce(searchQuery, 400);

  // Sync URL query with search state
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams, setSearchQuery, searchQuery]);

  // Update URL & add to history (debounced)
  useEffect(() => {
    if (debouncedQuery.trim()) {
      window.history.replaceState(null, '', `/Pages/Search?q=${encodeURIComponent(debouncedQuery)}`);
      if (debouncedQuery.trim().length > 2) {
        addToHistory(debouncedQuery, 'text');
      }
    } else if (!debouncedQuery.trim() && searchParams.get('q')) {
      window.history.replaceState(null, '', `/Pages/Search`);
    }
  }, [debouncedQuery, searchParams, addToHistory]);

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
    <div className="relative w-full min-h-screen px-4 sm:px-8 lg:px-16 py-6 bg-slate-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Modern Header & Search Section */}
        <header className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {searchQuery ? (
                <span className="flex items-center gap-2">
                  <span>{t('Search Results for')}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">&ldquo;{searchQuery}&rdquo;</span>
                </span>
              ) : (
                <span>{t('Search & Discover')}</span>
              )}
            </h1>

            {searchStats && searchQuery && (
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-white/10">
                {searchStats.total} {t('Results')}
              </span>
            )}
          </div>

          {/* Search Input Bar & Filters Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1">
              <ExploreSearchBar
                search={searchQuery}
                setSearch={setSearchQuery}
                placeholder={t('Search users, posts, hashtags, communities...')}
              />
            </div>

            {searchQuery.trim() && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 px-5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  showFilters || sortBy !== 'relevance' || dateRange !== 'all' || hasMedia || verifiedOnly
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-white/5 border-slate-200/80 dark:border-white/10 hover:border-indigo-500/50'
                }`}
              >
                <HiAdjustmentsHorizontal className="w-4 h-4" />
                <span>{t('Filters')}</span>
              </motion.button>
            )}
          </div>

          {/* Interactive Filters Panel */}
          <AnimatePresence>
            {showFilters && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <HiAdjustmentsHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        {t('Search Filters')}
                      </h3>
                    </div>
                    <button
                      onClick={resetFilters}
                      className="text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                    >
                      <HiArrowPath className="w-3.5 h-3.5" />
                      {t('Reset')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Sort Order */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {t('Sort By')}
                      </label>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { id: 'relevance', label: t('Relevance') },
                          { id: 'recent', label: t('Most Recent') },
                          { id: 'popular', label: t('Popularity') }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setSortBy(opt.id)}
                            className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                              sortBy === opt.id
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold'
                                : 'bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Posted */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                        <HiCalendar className="w-3 h-3" />
                        {t('Date Posted')}
                      </label>
                      <div className="flex flex-col gap-1.5">
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
                            className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                              dateRange === opt.id
                                ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold'
                                : 'bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Criteria Toggles */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {t('Target Criteria')}
                      </label>
                      <div className="space-y-2">
                        {/* Has Media */}
                        <div
                          onClick={() => setHasMedia(!hasMedia)}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 cursor-pointer hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <HiPhoto className="w-4 h-4 text-pink-500" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {t('Has Media Only')}
                            </span>
                          </div>
                          <div className={`w-9 h-5 rounded-full transition-all flex items-center px-0.5 ${
                            hasMedia ? 'bg-pink-500' : 'bg-slate-300 dark:bg-white/20'
                          }`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                              hasMedia ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </div>
                        </div>

                        {/* Verified Users */}
                        <div
                          onClick={() => setVerifiedOnly(!verifiedOnly)}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 cursor-pointer hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <HiShieldCheck className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {t('Verified Only')}
                            </span>
                          </div>
                          <div className={`w-9 h-5 rounded-full transition-all flex items-center px-0.5 ${
                            verifiedOnly ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-white/20'
                          }`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                              verifiedOnly ? 'translate-x-4' : 'translate-x-0'
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

          {/* Search History Section */}
          {!searchQuery.trim() && searchHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <HiClock className="w-4 h-4" />
                  <span>{t('Recent Searches')}</span>
                </div>
                <button
                  onClick={handleClearHistory}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                >
                  {t('Clear All')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 10).map((item, index) => (
                  <div
                    key={item._id || index}
                    onClick={() => setSearchQuery(item.query)}
                    className="group px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all flex items-center gap-2 text-xs font-medium cursor-pointer shadow-sm"
                  >
                    <HiMagnifyingGlass className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <span>{item.query}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-rose-500/10 text-rose-500"
                    >
                      <HiXMark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </header>

        {/* Results Feed Container */}
        <section className="relative">
          <AnimatePresence mode="wait">
            {searchQuery.trim() ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {loading && pagination[sortBy === 'relevance' ? 'posts' : 'posts']?.page === 1 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                    <p className="text-xs font-bold text-slate-400">
                      {t('Loading search results...')}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
    </div>
  );
};

export default FullSearchResults;
