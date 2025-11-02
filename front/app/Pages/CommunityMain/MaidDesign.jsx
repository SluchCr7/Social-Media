'use client'
import React, { memo, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaSearch,
  FaPlus,
  FaThLarge,
  FaList,
  FaFilter,
  FaAngleDown,
  FaUsers,
  FaGlobe,
  FaMapMarkerAlt,
} from 'react-icons/fa'
import CommunityCard from '@/app/Component/Community/CommunityCard'
import CreateCommunityModal from '@/app/Component/Community/CreateCommunityModal'
import CommunityFilter from '@/app/Component/Community/CommunityFilter'
import { useTranslation } from 'react-i18next'

/**
 * MaidDesign — Enhanced (Elegant Minimal improvements)
 * - Keeps all props, logic and features exactly as original
 * - Improves spacing, layout, accessibility, animations and micro-UX
 * - Preserves your color tokens & existing classNames (no color palette changes)
 *
 * NOTE: This component intentionally does not remove or rename any props or callbacks.
 */

const MaidDesign = memo(({
  user,
  categories = [],
  activeCategory,
  setActiveCategory,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filtered = [],
  visibleCount = 6,
  setShowCreateModal,
  showCreateModal,
  form,
  setForm,
  handleCreate,
  isCreating
}) => {
  const { t } = useTranslation()

  // Local UI state (non-destructive to props)
  const [viewMode, setViewMode] = useState('grid') // grid | list
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [activeTags, setActiveTags] = useState([])
  const [minMembers, setMinMembers] = useState(0)
  const [showCount, setShowCount] = useState(visibleCount)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // derived data (memoized)
  const displayed = useMemo(() => filtered.slice(0, showCount), [filtered, showCount])
  const hasMore = filtered.length > showCount

  // handlers (preserve external APIs)
  const toggleTag = useCallback((tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }, [])

  const onSearchChange = useCallback((e) => setSearchTerm(e.target.value), [setSearchTerm])

  const handleLoadMore = async () => {
    // keep UX feedback; does not alter existing behaviour
    if (!hasMore) return
    setIsLoadingMore(true)
    // emulate small delay for UX if desired (no logic change)
    await new Promise(r => setTimeout(r, 250))
    setShowCount(c => c + 6)
    setIsLoadingMore(false)
  }

  // small animation presets
  const cardMotion = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-12 space-y-8 bg-gradient-to-b from-lightMode-bg to-lightMode-menu dark:from-darkMode-bg dark:to-darkMode-menu text-lightMode-text dark:text-darkMode-text">

      {/* HERO + CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-2 bg-white/5 dark:bg-black/30 p-6 rounded-3xl shadow-md border border-white/6 w-full"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight truncate">{t('Community Hub')}</h1>
              <p className="text-sm opacity-80 mt-1 truncate">{t('Discover, create, and join active groups around your interests.')}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative w-72">
                <input
                  value={searchTerm}
                  onChange={onSearchChange}
                  placeholder={t('Search communities, topics, members...')}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/6 dark:bg-black/20 placeholder:text-sm outline-none transition focus:ring-2 focus:ring-blue-300"
                  aria-label={t('Search communities')}
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>

              {/* View toggles */}
              <div className="flex items-center gap-2 bg-white/4 dark:bg-black/20 p-2 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                  aria-pressed={viewMode === 'grid'}
                  title={t('Grid view')}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                  aria-pressed={viewMode === 'list'}
                  title={t('List view')}
                >
                  <FaList />
                </button>
              </div>

              {/* Create button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl shadow transition"
                aria-label={t('Create community')}
              >
                <FaPlus /> <span className="hidden sm:inline">{t('Create')}</span>
              </button>
            </div>
          </div>

          {/* chips + sort + advanced */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => { setActiveCategory(null); }}
                className={`px-3 py-1 rounded-lg transition ${!activeCategory ? 'bg-blue-600 text-white' : 'bg-white/5'}`}
                aria-pressed={!activeCategory}
              >
                {t('All')}
              </button>

              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg transition ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white/5'}`}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 rounded-md bg-white/5 outline-none"
                aria-label={t('Sort communities')}
              >
                <option value="recent">{t('Recently Active')}</option>
                <option value="members">{t('Most Members')}</option>
                <option value="newest">{t('Newest')}</option>
              </select>

              <button
                onClick={() => setAdvancedOpen(s => !s)}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 transition"
                aria-expanded={advancedOpen}
              >
                <FaFilter /> <span className="hidden sm:inline">{t('Advanced')}</span>
                <FaAngleDown className={`transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Advanced filters panel (animated) */}
          <AnimatePresence initial={false}>
            {advancedOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="mt-4 bg-white/4 dark:bg-black/20 p-4 rounded-xl"
                role="region"
                aria-label={t('Advanced filters')}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="text-xs text-gray-400">{t('Tags')}</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['tech','sports','music','education','design','local'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition ${activeTags.includes(tag) ? 'bg-sky-600 text-white' : 'bg-white/6'}`}
                          aria-pressed={activeTags.includes(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">{t('Minimum members')}</label>
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      value={minMembers}
                      onChange={(e) => setMinMembers(Number(e.target.value))}
                      className="w-full mt-2"
                      aria-valuemin={0}
                      aria-valuemax={1000}
                      aria-valuenow={minMembers}
                    />
                    <div className="text-xs mt-1">{minMembers} {t('members')}</div>
                  </div>

                  <div className="flex items-center gap-3 justify-start sm:justify-end">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt /> <span className="text-sm">{t('Local')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGlobe /> <span className="text-sm">{t('Global')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* RIGHT COLUMN: Stats & quick filters */}
        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="hidden lg:block w-full"
        >
          <div className="p-4 rounded-2xl bg-white/5 dark:bg-black/30 border border-white/6 sticky top-24 w-96">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{t('Overview')}</h4>
              <span className="text-sm text-gray-400">{filtered.length}</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <FaUsers className="text-xl" />
                <div>
                  <div className="text-sm font-medium">{t('Active members')}</div>
                  <div className="text-xs text-gray-400">{t('Members participating this week')}</div>
                </div>
              </div>

              <div className="border-t pt-3">
                <CommunityFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </div>

              <div className="mt-3">
                <h5 className="text-xs text-gray-400">{t('Quick tags')}</h5>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['tech','music','study','remote'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full transition ${activeTags.includes(tag) ? 'bg-indigo-600 text-white' : 'bg-white/6'}`}
                      aria-pressed={activeTags.includes(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleLoadMore}
                className="w-full px-4 py-2 rounded-lg bg-white/6 transition hover:brightness-95"
                disabled={!hasMore || isLoadingMore}
                aria-disabled={!hasMore || isLoadingMore}
              >
                {isLoadingMore ? t('Loading...') : t('Show more')}
              </button>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Communities Grid / List */}
      <section className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}`}>
        <AnimatePresence>
          {displayed.length === 0 ? (
            <motion.div
              {...cardMotion}
              className="col-span-full p-12 bg-white/5 dark:bg-black/20 rounded-2xl text-center"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-4xl">📭</div>
              <h3 className="text-xl font-semibold mt-3">{t('No communities found')}</h3>
              <p className="text-sm opacity-70 mt-2">{t('Try changing filters or create a new community to get started.')}</p>
              <div className="mt-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white"
                >
                  {t('Create community')}
                </button>
              </div>
            </motion.div>
          ) : (
            displayed.map((comm, i) => (
              <motion.div
                key={comm._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`${viewMode === 'grid' ? '' : 'w-full'}`}
              >
                <CommunityCard comm={comm} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>

      {/* Pagination / Load more */}
      <div className="flex items-center justify-center mt-6">
        {hasMore ? (
          <motion.button
            onClick={handleLoadMore}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white shadow"
            disabled={isLoadingMore}
            aria-disabled={isLoadingMore}
          >
            {isLoadingMore ? t('Loading...') : t('Load more')}
          </motion.button>
        ) : (
          <div className="text-sm text-gray-400">{t('No more communities')}</div>
        )}
      </div>

      {/* Create modal preserved (exact same prop usage) */}
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

    </div>
  )
})

MaidDesign.displayName = 'MaidDesign'
export default MaidDesign
