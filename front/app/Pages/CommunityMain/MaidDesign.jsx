'use client'
import React, { memo, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaSearch,
  FaPlus,
  FaSortAmountDown,
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

// Redesigned MaidDesign: modern, responsive, with enhanced filters, view modes, and UX improvements.
// Preserves all props and features from the original component.

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

  // Local UI state
  const [viewMode, setViewMode] = useState('grid') // grid | list
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [activeTags, setActiveTags] = useState([])
  const [minMembers, setMinMembers] = useState(0)
  const [showCount, setShowCount] = useState(visibleCount)

  // derived
  const displayed = useMemo(() => filtered.slice(0, showCount), [filtered, showCount])
  const hasMore = filtered.length > showCount

  // tag toggle helper
  const toggleTag = (tag) => setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  // Search input local handler (keeps parent's setSearchTerm API)
  const onSearchChange = (e) => setSearchTerm(e.target.value)

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-12 space-y-8 bg-gradient-to-b from-lightMode-bg to-lightMode-menu dark:from-darkMode-bg dark:to-darkMode-menu text-lightMode-text dark:text-darkMode-text">

      {/* Hero + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-6 items-start">
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="lg:col-span-2 bg-white/5 dark:bg-black/30 p-6 rounded-3xl shadow-md border border-white/6 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{t('Community Hub')}</h1>
              <p className="text-sm opacity-80 mt-1">{t('Discover, create, and join active groups around your interests.')}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <input value={searchTerm} onChange={onSearchChange} placeholder={t('Search communities, topics, members...')} className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/6 dark:bg-black/20 placeholder:text-sm outline-none" />
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>

              <div className="flex items-center gap-2 bg-white/4 dark:bg-black/20 p-2 rounded-xl">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`} title="Grid view"><FaThLarge /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400'}`} title="List view"><FaList /></button>
              </div>

              <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl shadow">
                <FaPlus /> {t('Create')}
              </button>
            </div>
          </div>

          {/* chips + sort + advanced */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => { setActiveCategory(null); }} className={`px-3 py-1 rounded-lg ${!activeCategory ? 'bg-blue-600 text-white' : 'bg-white/5'}`}>{t('All')}</button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 rounded-lg ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white/5'}`}>{cat}</button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1 rounded-md bg-white/5">
                <option value="recent">{t('Recently Active')}</option>
                <option value="members">{t('Most Members')}</option>
                <option value="newest">{t('Newest')}</option>
              </select>

              <button onClick={() => setAdvancedOpen(s => !s)} className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5">
                <FaFilter /> <span className="hidden sm:inline">{t('Advanced')}</span> <FaAngleDown className={`transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Advanced filters panel */}
          <AnimatePresence>
            {advancedOpen && (
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2}} className="mt-4 bg-white/4 dark:bg-black/20 p-4 rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="text-xs text-gray-400">{t('Tags')}</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['tech','sports','music','education','design','local'].map(tag => (
                        <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1 rounded-full text-sm ${activeTags.includes(tag) ? 'bg-sky-600 text-white' : 'bg-white/6'}`}>{tag}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">{t('Minimum members')}</label>
                    <input type="range" min={0} max={1000} value={minMembers} onChange={(e) => setMinMembers(Number(e.target.value))} className="w-full mt-2" />
                    <div className="text-xs mt-1">{minMembers} {t('members')}</div>
                  </div>

                  <div className="flex items-center gap-3">
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

        {/* Right column: Stats & quick filters */}
        <motion.aside initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.45}} className="hidden lg:block w-full">
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
                <CommunityFilter categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortBy={sortBy} setSortBy={setSortBy} />
              </div>

              <div className="mt-3">
                <h5 className="text-xs text-gray-400">{t('Quick tags')}</h5>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['tech','music','study','remote'].map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1 rounded-full ${activeTags.includes(tag) ? 'bg-indigo-600 text-white' : 'bg-white/6'}`}>{tag}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button onClick={() => setShowCount(c => c + 6)} className="w-full px-4 py-2 rounded-lg bg-white/6">{t('Show more')}</button>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Communities Grid / List */}
      <section className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}`}>
        <AnimatePresence>
          {displayed.length === 0 ? (
            <motion.div initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} className="col-span-full p-12 bg-white/5 dark:bg-black/20 rounded-2xl text-center">
              <div className="text-4xl">📭</div>
              <h3 className="text-xl font-semibold mt-3">{t('No communities found')}</h3>
              <p className="text-sm opacity-70 mt-2">{t('Try changing filters or create a new community to get started.')}</p>
              <div className="mt-4">
                <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 rounded-lg bg-sky-600 text-white">{t('Create community')}</button>
              </div>
            </motion.div>
          ) : (
            displayed.map((comm, i) => (
              <motion.div key={comm._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay: i*0.03}} className={`${viewMode === 'grid' ? '' : 'w-full'}`}>
                <CommunityCard comm={comm} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>

      {/* Pagination / Load more */}
      <div className="flex items-center justify-center mt-6">
        {hasMore ? (
          <button onClick={() => setShowCount(c => c + 6)} className="px-6 py-2 rounded-lg bg-blue-600 text-white">{t('Load more')}</button>
        ) : (
          <div className="text-sm text-gray-400">{t('No more communities')}</div>
        )}
      </div>

      {/* Create modal preserved */}
      <AnimatePresence>{showCreateModal && <CreateCommunityModal show={showCreateModal} onClose={() => setShowCreateModal(false)} form={form} setForm={setForm} handleCreate={handleCreate} isCreating={isCreating} />}</AnimatePresence>

    </div>
  )
})

MaidDesign.displayName = 'MaidDesign'
export default MaidDesign
