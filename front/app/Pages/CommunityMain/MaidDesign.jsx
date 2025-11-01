'use client'
import React, { memo } from 'react'
import { FaPlus, FaUsers } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import CommunityCard from '@/app/Component/Community/CommunityCard'
import CreateCommunityModal from '@/app/Component/Community/CreateCommunityModal'
import CommunityFilter from '@/app/Component/Community/CommunityFilter'
import { useTranslation } from 'react-i18next'

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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-10 
                    bg-gradient-to-b from-lightMode-bg to-lightMode-menu 
                    dark:from-darkMode-bg dark:to-darkMode-menu 
                    text-lightMode-text dark:text-darkMode-text relative">

      {/* LIGHT GLOW EFFECT */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/2 w-[600px] h-[600px] 
                        bg-sky-400/30 dark:bg-sky-700/20 
                        rounded-full blur-3xl translate-x-[-50%]"></div>
      </div>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-600 
                   rounded-3xl text-white p-8 md:p-10 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      >
        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight flex items-center gap-2">
              🌐 {t('Community Hub')}
            </h1>
            <p className="text-sm md:text-base opacity-90 max-w-xl leading-relaxed">
              {t('Discover, create, and join active groups around your interests.')}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm 
                         px-5 py-3 rounded-xl font-semibold text-white border border-white/20 
                         hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              <FaPlus /> {t('Create Community')}
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full md:w-1/3 flex justify-center md:justify-end"
          >
            <div className="w-48 h-48 rounded-2xl bg-white/10 backdrop-blur-md 
                            flex items-center justify-center text-7xl font-bold shadow-lg">
              <FaUsers className="text-white/80 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* FILTER BAR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="sticky top-4 z-20"
      >
        <CommunityFilter
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </motion.div>

      {/* COMMUNITY CARDS */}
      <motion.section
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filtered.slice(0, visibleCount).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="col-span-full p-12 bg-white/5 dark:bg-darkMode-menu 
                         rounded-3xl shadow-inner flex flex-col items-center justify-center gap-5 border border-white/10"
            >
              <div className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl bg-white/10">
                📭
              </div>
              <h3 className="text-xl font-semibold">{t('No communities found')}</h3>
              <p className="text-sm opacity-70 text-center max-w-sm">
                {t('Try a different filter or create a new community.')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowCreateModal(true)}
                className="mt-3 px-5 py-2 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700"
              >
                {t('Create community')}
              </motion.button>
            </motion.div>
          ) : (
            filtered.slice(0, visibleCount).map((comm, i) => (
              <motion.div
                key={comm._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CommunityCard comm={comm} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.section>

      {/* CREATE MODAL */}
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
MaidDesign.displayName = 'MaidDesign';

export default MaidDesign
