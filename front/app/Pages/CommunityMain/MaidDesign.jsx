'use client';

import React, { memo, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiMagnifyingGlass,
  HiPlus,
  HiSquares2X2,
  HiListBullet,
  HiAdjustmentsHorizontal,
  HiChevronDown,
  HiUsers,
  HiGlobeAlt,
  HiSignal,
} from 'react-icons/hi2';
import CommunityCard from '@/app/Component/Community/CommunityCard';
import CreateCommunityModal from '@/app/Component/Community/CreateCommunityModal';
import { useTranslation } from 'react-i18next';

const MaidDesign = memo(({
  categories = [],
  activeCategory,
  setActiveCategory,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filtered = [],
  isLoading,
  error,
  onRetry,
  setShowCreateModal,
  showCreateModal,
  form,
  setForm,
  handleCreate,
  isCreating
}) => {
  const { t } = useTranslation();

  // Local UI state
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [activeTags, setActiveTags] = useState([]);
  const [minMembers, setMinMembers] = useState(0);
  const [showCount, setShowCount] = useState(6);

  const refined = useMemo(
    () => filtered.filter((community) => {
      const tags = (community.tags || []).map((tag) => tag.toLowerCase());
      const memberCount = community._membersCount || 0;
      return memberCount >= minMembers && activeTags.every((tag) => tags.includes(tag));
    }),
    [filtered, activeTags, minMembers]
  );
  const displayed = useMemo(() => refined.slice(0, showCount), [refined, showCount]);
  const hasMore = refined.length > showCount;

  React.useEffect(() => {
    setShowCount(6);
  }, [refined]);

  const toggleTag = useCallback((tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }, []);

  const handleLoadMore = () => {
    if (!hasMore) return;
    setShowCount(c => c + 6);
  };

  return (
    <div className="relative min-h-screen px-3 sm:px-8 py-6 sm:py-12 lg:px-16 space-y-8 sm:space-y-12 overflow-hidden w-full">
      {/* 🎭 Animated Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* 🚀 Hero Navigation Section */}
      <section className="space-y-8">
        <header className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-gray-100 dark:border-white/5 pb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <HiSignal className="w-3 h-3 animate-pulse" />
              {t('Find your people')}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.9]">
              {t('Communities')} <br />
              <span className="text-indigo-500">{t('that feel like home')}</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              {t('Discover groups built around your interests, join the conversation, and create a space of your own.')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80 group">
              <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('Search communities...')}
                aria-label={t('Search communities')}
                className="w-full pl-12 pr-6 py-3 sm:py-4 rounded-[1.5rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 focus:border-indigo-500/50 outline-none transition-all shadow-xl shadow-gray-200/20 dark:shadow-none font-medium"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 px-6 py-3 sm:px-8 sm:py-4 rounded-[1.5rem] text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-500/30 active:bg-indigo-700"
            >
              <HiPlus className="w-5 h-5" />
              {t('Create a community')}
            </motion.button>
          </div>
        </header>

        {/* 🛠 Interactive Filters Deck */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
            <button
              onClick={() => setActiveCategory('All')}
              aria-pressed={!activeCategory || activeCategory === 'All'}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!activeCategory || activeCategory === 'All' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10'}`}
            >
              {t('All Streams')}
            </button>
            {categories.filter((cat) => cat !== 'All').map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10'}`}
              >
                {t(cat)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="sr-only" htmlFor="community-sort">{t('Sort communities')}</label>
            <select
              id="community-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-sm outline-none"
            >
              <option value="Newest">{t('Newest')}</option>
              <option value="Most Members">{t('Most members')}</option>
              <option value="A-Z">{t('A-Z')}</option>
            </select>
            <div className="flex items-center bg-white/50 dark:bg-white/5 p-1 rounded-2xl border border-gray-100 dark:border-white/5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-white/10 shadow-sm text-indigo-500' : 'text-gray-400'}`}
              >
                <HiSquares2X2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-white/10 shadow-sm text-indigo-500' : 'text-gray-400'}`}
              >
                <HiListBullet className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${advancedOpen ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white/50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-500'}`}
            >
              <HiAdjustmentsHorizontal className="w-4 h-4" />
              {t('Advanced')}
              <HiChevronDown className={`w-3 h-3 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* 🏺 Advanced Tuning Panel */}
        <AnimatePresence>
          {advancedOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-8 bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('Topic Resonance')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {['tech', 'sports', 'music', 'art', 'local', 'gaming'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeTags.includes(tag) ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:border-indigo-500/30'}`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('Node Magnitude')}</h4>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={minMembers}
                    onChange={(e) => setMinMembers(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="text-xl font-black text-indigo-500 leading-none">{minMembers}+ <span className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">{t('Members')}</span></div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('Visibility')}</h4>
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-300">
                    <HiGlobeAlt className="w-5 h-5 text-indigo-500" />
                    {t('Public and private groups')}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 🔮 Communities Transmission Feed */}
      {isLoading ? (
        <section aria-label={t('Loading communities')} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-72 rounded-3xl bg-white/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 animate-pulse" />
          ))}
        </section>
      ) : error && filtered.length === 0 ? (
        <section role="alert" className="py-20 text-center rounded-3xl border border-red-500/20 bg-red-500/5">
          <p className="text-gray-700 dark:text-gray-200 mb-5">{error}</p>
          <button onClick={onRetry} className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold">{t('Try again')}</button>
        </section>
      ) : (
      <section className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'flex flex-col gap-6'}`}>
        <AnimatePresence mode="popLayout">
          {displayed.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <HiSignal className="w-10 h-10 text-indigo-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('No communities found')}</h3>
                <p className="text-gray-500 max-w-sm">{t('Try another search or category, or create a community to get started.')}</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20"
              >
                {t('Create a community')}
              </button>
            </motion.div>
          ) : (
            displayed.map((comm, i) => (
              <motion.div
                key={comm._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <CommunityCard comm={comm} viewMode={viewMode} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>
      )}

      {/* 🔄 Telemetry (Load More) */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoadMore}
            className="flex items-center gap-3 px-10 py-4 rounded-[2rem] bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-indigo-500/30 transition-all"
          >
            {t('Load more communities')}
          </motion.button>
        </div>
      )}

      {/* 🎭 Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateCommunityModal
            show={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            form={form}
            setForm={setForm}
            handleCreate={handleCreate}
            isCreating={isCreating}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-8 hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/10 shadow-xl">
        <HiUsers className="text-indigo-500 w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
          {refined.length} {t('communities')}
        </span>
      </div>
    </div>
  );
});

MaidDesign.displayName = 'MaidDesign';
export default MaidDesign;
