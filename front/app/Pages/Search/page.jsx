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
import { motion } from 'framer-motion';

const FullSearchResults = () => {
  const searchParams = useSearchParams();

  const { users, user } = useAuth();
  const { posts } = usePost();
  const { t } = useTranslation();

  const initialSearchQuery = searchParams.get('q') || '';
  const { search, setSearch, searchResults } = useSearchLogic(initialSearchQuery, users, posts);

  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (search.trim() && search !== currentQ) {
      window.history.replaceState(null, '', `/Pages/Search?q=${encodeURIComponent(search)}`);
    }
  }, [search, searchParams]);

  return (
    <div className="relative min-h-screen px-4 sm:px-8 py-12 lg:px-16 overflow-hidden">
      {/* 🔮 Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* 🚀 Dynamic Header */}
        <header className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-gray-100 dark:border-white/5 pb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <HiSignal className="w-3 h-3 animate-pulse" />
              {t('Search Data Index')}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.9] break-words">
              {t('Results for')} <br />
              <span className="text-indigo-500">
                {search ? `"${search}"` : '...'}
              </span>
            </h1>
          </div>
        </header>

        {/* 🔍 Refined Search Bar */}
        <div className="max-w-4xl mx-auto">
          <ExploreSearchBar
            search={search}
            setSearch={setSearch}
            placeholder={t('Update signal parameters...')}
          />
        </div>

        {/* 📊 Unified Results Feed */}
        <section className="relative">
          {search.trim() ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FullSearchTabs searchResults={searchResults} searchQuery={search} user={user} t={t} />
            </motion.div>
          ) : (
            <div className="py-40 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-gray-200 dark:border-white/10">
                <HiMagnifyingGlass className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">
                {t('Enter a search query to synchronize with the grid')}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* 🔮 Support Indicator */}
      <div className="fixed bottom-12 left-12 hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/10 shadow-xl">
        <HiMagnifyingGlass className="text-indigo-500 w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
          {t('Index Operational')}
        </span>
      </div>
    </div>
  );
};

export default FullSearchResults;
