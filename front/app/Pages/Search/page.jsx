'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { usePost } from '@/app/Context/PostContext';
import { useSearchLogic } from '../../Custome/useSearchLogic';
import { useTranslation } from 'react-i18next';
import { HiMagnifyingGlass, HiSignal } from 'react-icons/hi2';
import { useSearchParams } from 'next/navigation';

// Component Imports
import ExploreSearchBar from '../../Component/Explore/ExploreSearchBar';
import FullSearchTabs from '../../Component/FullSearchTabs';
import TrendingSection from '../../Component/Search/TrendingSection';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/app/Context/UserContext';

const FullSearchResults = () => {
  const searchParams = useSearchParams();

  const { users, user } = useAuth();
  const { posts } = usePost();
  const { suggestedUsers } = useUser();
  const { t } = useTranslation();

  const initialSearchQuery = searchParams.get('q') || '';
  const { search, setSearch, searchResults, topHashtags } = useSearchLogic(initialSearchQuery, users, posts);

  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (search.trim() && search !== currentQ) {
      window.history.replaceState(null, '', `/Pages/Search?q=${encodeURIComponent(search)}`);
    } else if (!search.trim() && currentQ) {
      window.history.replaceState(null, '', `/Pages/Search`);
    }
  }, [search, searchParams]);

  return (
    <div className="relative w-full min-h-screen px-4 sm:px-8 py-12 lg:px-16 overflow-hidden bg-[#fafafa] dark:bg-[#050505]">
      {/* 🔮 Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full space-y-16">
        {/* 🚀 Dynamic Header */}
        <header className="space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <HiSignal className="w-3 h-3 animate-pulse" />
              {t('Search Data Index')}
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.8] break-words">
              {search ? (
                <>
                  {t('Results for')} <br />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    &quot;{search}&quot;
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
            </h1>
          </div>

          {/* 🔍 Refined Search Bar */}
          <div className="w-full pt-8">
            <ExploreSearchBar
              search={search}
              setSearch={setSearch}
              placeholder={t('Synchronize with the network...')}
            />
          </div>
        </header>

        {/* 📊 Unified Results Feed */}
        <section className="relative">
          <AnimatePresence mode="wait">
            {search.trim() ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <FullSearchTabs searchResults={searchResults} searchQuery={search} user={user} t={t} />
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
