// 'use client';
// import React from 'react'
// import { FaPlus, FaUsers } from 'react-icons/fa'
// import { motion } from 'framer-motion'
// import CommunityCard from '@/app/Component/Community/CommunityCard'
// import CreateCommunityModal from '@/app/Component/Community/CreateCommunityModal'
// import CommunityFilter from '@/app/Component/Community/CommunityFilter'
// import { useTranslation } from 'react-i18next'


// const MaidDesign = ({
//   user,
//   categories = [],            
//   activeCategory,             
//   setActiveCategory,           
//   searchTerm,                 
//   setSearchTerm,              
//   sortBy,                     
//   setSortBy,                  
//   filtered = [],               
//   visibleCount = 6,            
//   setShowCreateModal,         
//   showCreateModal,            
//   form,                        
//   setForm,                     
//   handleCreate,                
//   isCreating                   
// }) => {
//   const {t} = useTranslation()
//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-10 bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text">

//       {/* HERO */}
//       <div className="relative bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl text-white p-6 md:p-8 overflow-hidden shadow-lg">
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
//           <div className="w-full md:w-2/3 space-y-4">
//             <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-2">
//               🌐 {t("Community Hub")}
//             </h1>
//             <p className="text-sm md:text-base opacity-95 max-w-full">
//               {t("Discover, create, and join active groups around your interests.")}
//             </p>
//             <div className="flex gap-4 flex-wrap">
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="inline-flex items-center gap-2 bg-lightMode-fg dark:bg-darkMode-fg text-lightMode-bg dark:text-darkMode-bg px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform"
//               >
//                 <FaPlus /> {t("Create Community")}
//               </button>
//             </div>
//           </div>

//           <div className="w-full md:w-1/3 flex justify-center md:justify-end">
//             <div className="w-48 h-48 rounded-xl bg-lightMode-menu dark:bg-darkMode-menu p-4 flex items-center justify-center overflow-hidden text-white text-6xl font-bold">
//               <FaUsers className="text-sky-400 animate-pulse" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* FILTER BAR */}
//       <CommunityFilter
//         categories={categories}
//         activeCategory={activeCategory}
//         setActiveCategory={setActiveCategory}
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         sortBy={sortBy}
//         setSortBy={setSortBy}
//       />

//       {/* COMMUNITY CARDS */}
//       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filtered.slice(0, visibleCount).length === 0 ? (
//           <div className="col-span-full p-8 bg-lightMode-menu dark:bg-darkMode-menu rounded-2xl shadow flex flex-col items-center justify-center gap-4">
//             <div className="w-32 h-32 bg-lightMode-bg dark:bg-darkMode-bg rounded-lg flex items-center justify-center text-4xl">
//               📭
//             </div>
//             <h3 className="text-lg font-semibold">{t("No communities found")}</h3>
//             <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2">
//               {t("Try a different filter or create a new community.")}
//             </p>
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-lg"
//             >
//               {t("Create community")}
//             </button>
//           </div>
//         ) : (
//           filtered.slice(0, visibleCount).map((comm) => (
//             <CommunityCard key={comm._id} comm={comm} />
//           ))
//         )}
//       </section>

//       {/* CREATE MODAL */}
//       <CreateCommunityModal
//         show={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         form={form}
//         setForm={setForm}
//         handleCreate={handleCreate}
//         isCreating={isCreating}
//       />
//     </div>
//   )
// }

// export default MaidDesign
'use client'
import React, { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaSearch, FaUsers, FaLock, FaGlobe } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

// -----------------------------------------------------------------------------
// Community Hub — New professional single-file React component
// - Tailwind-first design (works with your existing tailwind setup)
// - Responsive hero, two-column layout on desktop (filters + results)
// - Search, category pills, sort, featured carousel, grid with progressive reveal
// - Lightweight Create modal placeholder (hook it up to your API)
// - Accessible, keyboard-friendly controls and ARIA labels
// -----------------------------------------------------------------------------

// Usage: import CommunityHub from '.../CommunityHub_NewDesign'
// <CommunityHub {...props} />

export default function CommunityHub({
  user,
  categories = [],
  activeCategory,
  setActiveCategory = () => {},
  searchTerm,
  setSearchTerm = () => {},
  sortBy,
  setSortBy = () => {},
  filtered = [],
  visibleCount = 9,
  setShowCreateModal = () => {},
  showCreateModal = false,
  form = {},
  setForm = () => {},
  handleCreate = async () => {},
  isCreating = false,
}) {
  const { t } = useTranslation()
  const [localSearch, setLocalSearch] = useState(searchTerm || '')
  const [localSort, setLocalSort] = useState(sortBy || 'popular')

  // Debounce search locally and notify parent
  useEffect(() => {
    const id = setTimeout(() => setSearchTerm(localSearch), 300)
    return () => clearTimeout(id)
  }, [localSearch, setSearchTerm])

  useEffect(() => setSortBy(localSort), [localSort, setSortBy])

  const featured = useMemo(() => filtered.slice(0, 3), [filtered])
  const rest = useMemo(() => filtered.slice(3, 3 + visibleCount), [filtered, visibleCount])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-8">

      {/* Decorative soft background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-10 -top-10 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-sky-400/20 to-indigo-500/10 blur-3xl" />
      </div>

      {/* HERO */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-indigo-600 via-sky-500 to-purple-600 text-white rounded-3xl p-8 md:p-10 shadow-lg overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <span>{t('Community Hub')}</span>
            </h1>
            <p className="mt-2 text-sm md:text-base max-w-2xl opacity-90">
              {t("Discover, join and build communities — curated, local and global groups for every interest.")}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white border border-white/20 hover:bg-white/20 transition"
                aria-label={t('Create community')}
              >
                <FaPlus /> {t('Create')}
              </button>

              <Link href="/communities/explore" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-sm hover:bg-white/20">
                {t('Explore all')}
              </Link>
            </div>

          </div>

          <div className="w-full lg:w-72">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">
                  <FaUsers />
                </div>
                <div>
                  <div className="text-sm font-semibold">{filtered.length}</div>
                  <div className="text-xs opacity-80">{t('communities')}</div>
                </div>
              </div>

              {/* featured carousel */}
              {featured.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {featured.map((f) => (
                    <div key={f._id} className="h-14 rounded-lg overflow-hidden relative bg-gradient-to-br from-sky-300 to-indigo-400">
                      {f.Cover?.url ? (
                        <Image src={f.Cover.url} alt={f.Name} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-white font-bold">{(f.Name || 'C').charAt(0)}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>
      </motion.header>

      {/* MAIN: Filters column + results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Filters (left) */}
        <aside className="lg:col-span-1 sticky top-20 self-start">
          <div className="bg-lightMode-menu dark:bg-darkMode-menu p-4 rounded-2xl shadow-sm">
            <label htmlFor="search" className="sr-only">{t('Search communities')}</label>
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded-md">
              <FaSearch className="text-lightMode-text2 dark:text-darkMode-text2" />
              <input
                id="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={t('Search communities...')}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">{t('Categories')}</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`text-xs px-3 py-1.5 rounded-full ${activeCategory ? 'bg-transparent border' : 'bg-sky-600 text-white'}`}
                >
                  {t('All')}
                </button>

                {categories?.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full ${activeCategory === cat ? 'bg-sky-600 text-white' : 'bg-lightMode-menu dark:bg-darkMode-menu border'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">{t('Sort')}</h4>
              <select value={localSort} onChange={(e) => setLocalSort(e.target.value)} className="w-full p-2 rounded-md bg-transparent border">
                <option value="popular">{t('Popular')}</option>
                <option value="newest">{t('Newest')}</option>
                <option value="members">{t('Most members')}</option>
              </select>
            </div>

            <div className="mt-4 text-xs opacity-80">
              {t('Tip')}: {t('Use search + categories to quickly find active communities.')}
            </div>
          </div>
        </aside>

        {/* Results (right) */}
        <main className="lg:col-span-3">

          {/* Top bar with counts and compact controls */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="text-sm opacity-80">{filtered.length} {t('results')}</div>
            <div className="flex items-center gap-3">
              <button className="px-3 py-1 rounded-md bg-lightMode-menu dark:bg-darkMode-menu">{t('Grid')}</button>
              <button className="px-3 py-1 rounded-md bg-lightMode-menu dark:bg-darkMode-menu">{t('List')}</button>
            </div>
          </div>

          {/* Cards grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {rest.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full p-8 rounded-2xl bg-white/5 text-center">
                  <div className="text-3xl">📭</div>
                  <div className="mt-2 font-semibold">{t('No communities found')}</div>
                  <div className="mt-2 text-sm opacity-80">{t('Try different filters or create a community')}</div>
                </motion.div>
              ) : (
                rest.map((comm, i) => (
                  <motion.div key={comm._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <CommunityCard comm={comm} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </section>

          {/* Show more / pagination */}
          {filtered.length > 3 + visibleCount && (
            <div className="mt-6 flex items-center justify-center">
              <button onClick={() => { /* parent may increase visibleCount */ }} className="px-4 py-2 rounded-lg bg-sky-600 text-white">{t('Show more')}</button>
            </div>
          )}

        </main>
      </div>

      {/* Create community modal placeholder (simple accessible modal) */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="z-50 w-full max-w-2xl bg-white dark:bg-darkMode-bg rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-2">{t('Create community')}</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleCreate(form); }} className="space-y-3">
                <input value={form.Name || ''} onChange={(e) => setForm({ ...form, Name: e.target.value })} placeholder={t('Community name')} className="w-full p-3 rounded-md border" />
                <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t('Short description')} className="w-full p-3 rounded-md border" rows={3} />
                <div className="flex items-center gap-3 justify-end">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-md bg-lightMode-menu">{t('Cancel')}</button>
                  <button type="submit" disabled={isCreating} className="px-4 py-2 rounded-md bg-sky-600 text-white">{isCreating ? t('Creating...') : t('Create')}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

// ------------------------- Community Card (small, re-usable) -------------------------
function CommunityCard({ comm }) {
  const { t } = useTranslation()
  return (
    <article className="bg-lightMode-menu dark:bg-darkMode-menu rounded-2xl shadow-md overflow-hidden border hover:shadow-lg transition relative">
      <Link href={`/Pages/Community/${comm._id}`} className="block relative w-full h-36">
        {comm.Cover?.url ? (
          <Image src={comm.Cover.url} alt={comm.Name} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-sky-300 to-indigo-400 flex items-center justify-center text-white text-2xl font-bold">
            {(comm.Name || 'C').charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-black/6" />
      </Link>

      <div className="pt-10 pb-6 px-5 text-center">
        <div className="-mt-14 mx-auto w-20 h-20 relative rounded-full overflow-hidden shadow-md bg-gray-200 flex items-center justify-center">
          {comm.Picture?.url ? (
            <Image src={comm.Picture.url} alt={comm.Name} fill style={{ objectFit: 'cover' }} />
          ) : (
            <FaUsers className="text-3xl text-gray-400" />
          )}
        </div>

        <h3 className="mt-3 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{comm.Name}</h3>
        <p className="mt-1 text-sm text-lightMode-text2 dark:text-darkMode-text2 line-clamp-2">{comm.description}</p>

        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs px-2 py-1 rounded-full bg-lightMode-bg dark:bg-darkMode-bg">{comm.Category}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${comm.isPrivate ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-green-100 text-green-700 dark:bg-green-900/30'}`}>
            {comm.isPrivate ? (<><FaLock className="inline mr-1" />{t('Private')}</>) : (<><FaGlobe className="inline mr-1" />{t('Public')}</>) }
          </span>
          <span className="flex items-center gap-1 text-sm text-lightMode-text2 dark:text-darkMode-text2"><FaUsers /> {comm.members?.length || 0}</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <Link href={`/Pages/Community/${comm._id}`} className="px-4 py-2 rounded-lg border border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition">
            {t('View')}
          </Link>
        </div>
      </div>
    </article>
  )
}
