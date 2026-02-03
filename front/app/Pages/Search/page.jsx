'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useSearch } from '@/app/Context/SearchContext';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';
import { HiMagnifyingGlass, HiSignal, HiClock, HiXMark } from 'react-icons/hi2';
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
  const { t } = useTranslation();

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchHistory,
    loading,
    addToHistory,
    removeFromHistory
  } = useSearch();

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
      // Add to history when user stops typing (debounced automatically in context)
      if (searchQuery.trim().length > 2) {
        addToHistory(searchQuery, 'text');
      }
    } else if (!searchQuery.trim() && searchParams.get('q')) {
      window.history.replaceState(null, '', `/Pages/Search`);
    }
  }, [searchQuery, searchParams, addToHistory]);

  // Mock top hashtags for now (will come from explore context later)
  const topHashtags = [
    ['Technology', 245],
    ['Design', 189],
    ['AI', 167],
    ['Web3', 142],
    ['Startup', 128],
    ['Coding', 115],
    ['Creative', 98],
    ['Innovation', 87]
  ];

  return (
    <div className="relative w-full min-h-screen px-3 sm:px-8 py-6 sm:py-12 lg:px-16 overflow-hidden bg-[#fafafa] dark:bg-[#050505]">
      {/* 🔮 Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full space-y-16">
        {/* 🚀 Dynamic Header */}
        <header className="space-y-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <HiSignal className="w-3 h-3 animate-pulse" />
              {t('Search Data Index')}
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
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    &quot;{searchQuery}&quot;
                  </span>
                </>
              ) : (
                <>
                  {t('Grid')} <br />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {t('Discovery')}
                  </span>
                </>
              )}
            </motion.h1>
          </div>

          {/* 🔍 Refined Search Bar */}
          <div className="w-full pt-8">
            <ExploreSearchBar
              search={searchQuery}
              setSearch={setSearchQuery}
              placeholder={t('Synchronize with the network...')}
            />
          </div>

          {/* 🕒 Search History */}
          {!searchQuery.trim() && searchHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-4">
                <HiClock className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  {t('Recent Searches')}
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {searchHistory.slice(0, 10).map((item, index) => (
                  <motion.button
                    key={item._id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (index * 0.05) }}
                    onClick={() => setSearchQuery(item.query)}
                    className="group relative px-4 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-indigo-500/50 transition-all flex items-center gap-2"
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

        {/* 📊 Unified Results Feed */}
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
                      <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                      <p className="text-sm font-black uppercase tracking-wider text-gray-400">
                        {t('Searching...')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <FullSearchTabs searchResults={searchResults} searchQuery={searchQuery} user={user} t={t} />
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

      {/* 🔮 Support Indicator */}
      <div className="fixed bottom-12 left-12 hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/10 shadow-xl z-50">
        <HiMagnifyingGlass className="text-indigo-500 w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
          {t('Index Operational')}
        </span>
      </div>
    </div>
  );
};

export default FullSearchResults;
