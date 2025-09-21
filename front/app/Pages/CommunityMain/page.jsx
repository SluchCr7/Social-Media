'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaUsers, FaSearch, FaLock, FaGlobe } from 'react-icons/fa'
import { useCommunity } from '@/app/Context/CommunityContext'
import { useAuth } from '@/app/Context/AuthContext'

const CATEGORY_OPTIONS = [
  'All', 'Technology', 'Art', 'Science', 'Gaming', 'Music',
  'Food', 'Travel', 'Health', 'Business', 'Politics', 'Sports', 'Other'
]

const SORT_OPTIONS = ['Newest', 'Most Members', 'A-Z']

const Badge = ({ children, className = '' }) => (
  <span className={`inline-block text-xs px-2 py-1 rounded-full ${className}`}>{children}</span>
)

// ================= CommunityCard Component =================
const CommunityCard = ({ comm }) => (
  <motion.article
    whileHover={{ y: -6 }}
    className="bg-lightMode-menu dark:bg-darkMode-menu rounded-2xl shadow-md overflow-hidden border border-transparent hover:shadow-lg transition relative"
  >
    <Link href={`/Pages/Community/${comm._id}`} className="block relative w-full h-36">
      {comm.Cover?.url || comm.cover?.url ? (
        <Image
          src={comm.Cover?.url || comm.cover?.url}
          alt={comm.Name}
          fill
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-sky-300 to-indigo-400 flex items-center justify-center text-white text-2xl font-bold">
          {comm.Name?.charAt(0) || 'C'}
        </div>
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-black/10 opacity-0 hover:opacity-10 transition" />
    </Link>

    <div className="pt-10 pb-6 px-5 text-center">
      <div className="-mt-14 mx-auto w-20 h-20 relative rounded-full overflow-hidden shadow-md bg-gray-200 flex items-center justify-center">
        {comm.Picture?.url || comm.picture?.url ? (
          <Image
            src={comm.Picture?.url || comm.picture?.url}
            alt={comm.Name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <FaUsers className="text-3xl text-gray-400" />
        )}
      </div>

      <h3 className="mt-3 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{comm.Name}</h3>
      <p className="mt-1 text-sm text-lightMode-text2 dark:text-darkMode-text2 line-clamp-2">{comm.description}</p>

      <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
        <Badge className="bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text">{comm.Category}</Badge>
        <Badge className={`${comm.isPrivate ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-green-100 text-green-700 dark:bg-green-900/30'}`}>
          {comm.isPrivate ? <><FaLock className="inline mr-1" />Private</> : <><FaGlobe className="inline mr-1" />Public</>}
        </Badge>
        <span className="flex items-center gap-1 text-sm text-lightMode-text2 dark:text-darkMode-text2"><FaUsers /> {comm.members?.length || 0}</span>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
        <Link href={`/Pages/Community/${comm._id}`} className="px-4 py-2 rounded-lg border border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition">
          View
        </Link>
      </div>
    </div>
  </motion.article>
)

// ================= CreateCommunityModal Component =================
const CreateCommunityModal = ({ show, onClose, form, setForm, handleCreate, isCreating }) => (
  <AnimatePresence>
    {show && (
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ y: 10, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, scale: 0.98 }} transition={{ type: 'spring', stiffness: 200 }} className="bg-lightMode-bg dark:bg-darkMode-bg rounded-2xl w-full max-w-lg p-6 mx-4 sm:mx-0 shadow-xl">
          <h3 className="text-xl font-semibold text-sky-600 flex items-center gap-2"><FaPlus /> Create Community</h3>

          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                className="w-full mt-1 p-3 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text"
                placeholder="e.g. Frontend Devs"
              />
            </div>

            <div>
              <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">Category</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full mt-1 p-3 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text">
                {CATEGORY_OPTIONS.filter(Boolean).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-lightMode-text2 dark:text-darkMode-text2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                required
                rows={4}
                className="w-full mt-1 p-3 rounded-lg border bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text"
                placeholder="Short description about what the community is for"
              />
            </div>

            <div className="mt-2 border rounded-lg p-3 bg-lightMode-menu dark:bg-darkMode-menu">
              <h4 className="font-semibold">Preview:</h4>
              <p className="text-sm text-lightMode-text dark:text-darkMode-text">{form.name || 'Community Name'}</p>
              <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2">{form.description || 'Community Description'}</p>
            </div>

            <div className="flex justify-end items-center gap-3 flex-wrap">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition">Cancel</button>
              <button type="submit" disabled={isCreating} className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold">{isCreating ? 'Creating...' : 'Create'}</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

// ================= Search & Filter Component =================
const CommunityFilter = ({ categories, activeCategory, setActiveCategory, searchTerm, setSearchTerm, sortBy, setSortBy }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between flex-wrap sticky top-20 bg-lightMode-bg dark:bg-darkMode-bg z-10 p-2 rounded-md shadow-sm">
    <div className="flex gap-2 flex-wrap">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          whileHover={{ scale: 1.05 }}
          className={`text-xs px-3 py-1.5 rounded-full border transition select-none whitespace-nowrap shadow-sm
            ${activeCategory === cat ? 'bg-sky-600 text-white border-sky-600' : 'bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text border-gray-200 dark:border-gray-700'}`}
        >
          {cat}
        </motion.button>
      ))}
    </div>

    <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
      <div className="flex items-center gap-2 bg-lightMode-menu dark:bg-darkMode-menu rounded-lg px-3 py-2 flex-1 min-w-[160px]">
        <FaSearch className="text-lightMode-text2 dark:text-darkMode-text2" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search communities..."
          className="bg-transparent outline-none text-sm w-full placeholder-lightMode-text2 dark:placeholder-darkMode-text2"
        />
      </div>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="p-2 rounded-lg border text-sm bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text min-w-[120px]"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  </div>
)

// ================= Main CommunityPage =================
export default function CommunityPage() {
  const { communities, addCommunity } = useCommunity()
  const { user } = useAuth()

  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState('Newest')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [form, setForm] = useState({ name: '', description: '', category: 'Technology', cover: null, avatar: null })
  const [isCreating, setIsCreating] = useState(false)

  const [visibleCount, setVisibleCount] = useState(6)
  const loadMore = () => setVisibleCount((v) => v + 6)

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300)
    return () => clearTimeout(t)
  }, [searchTerm])

  const categories = useMemo(() => {
    const cats = new Set(communities.map((c) => c.Category || c.category || 'Other'))
    return ['All', ...Array.from(cats).slice(0, 12)]
  }, [communities])

  const filtered = useMemo(() => {
    const s = debouncedSearch.toLowerCase()
    const results = communities
      .filter((c) => (activeCategory === 'All' ? true : (c.Category || c.category) === activeCategory))
      .filter((c) => {
        if (!s) return true
        const name = (c.Name || c.name || '').toLowerCase()
        const desc = (c.description || '').toLowerCase()
        const cat = ((c.Category || c.category) || '').toLowerCase()
        return name.includes(s) || desc.includes(s) || cat.includes(s)
      })
      .map((c) => ({ ...c, _membersCount: (c.members || []).length }))

    if (sortBy === 'Most Members') {
      results.sort((a, b) => b._membersCount - a._membersCount)
    } else if (sortBy === 'A-Z') {
      results.sort((a, b) => (a.Name || a.name || '').localeCompare(b.Name || b.name || ''))
    } else {
      results.sort((a, b) => new Date(b.createdAt || b.createdAt) - new Date(a.createdAt || a.createdAt))
    }

    return results
  }, [communities, activeCategory, debouncedSearch, sortBy])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.description.trim()) return
    try {
      setIsCreating(true)
      await addCommunity?.(form.name.trim(), form.category, form.description.trim(), form.cover, form.avatar)
      setForm({ name: '', description: '', category: 'Technology', cover: null, avatar: null })
      setShowCreateModal(false)
    } catch (err) {
      console.error('Create community error', err)
    } finally {
      setIsCreating(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMore()
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-10 bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text">

      {/* HERO */}
      <div className="relative bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl text-white p-6 md:p-8 overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-2">🌐 Community Hub</h1>
            <p className="text-sm md:text-base opacity-95 max-w-full">
              Discover, create, and join active groups around your interests.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-lightMode-fg dark:bg-darkMode-fg text-lightMode-bg dark:text-darkMode-bg px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform"
              >
                <FaPlus /> Create Community
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <div className="w-48 h-48 rounded-xl bg-lightMode-menu dark:bg-darkMode-menu p-4 flex items-center justify-center overflow-hidden text-white text-6xl font-bold">
              <FaUsers className="text-sky-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <CommunityFilter
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Community Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.slice(0, visibleCount).length === 0 ? (
          <div className="col-span-full p-8 bg-lightMode-menu dark:bg-darkMode-menu rounded-2xl shadow flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 bg-lightMode-bg dark:bg-darkMode-bg rounded-lg flex items-center justify-center text-4xl">📭</div>
            <h3 className="text-lg font-semibold">No communities found</h3>
            <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2">Try a different filter or create a new community.</p>
            <button onClick={() => setShowCreateModal(true)} className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-lg">Create community</button>
          </div>
        ) : (
          filtered.slice(0, visibleCount).map((comm) => <CommunityCard key={comm._id} comm={comm} />)
        )}
      </section>

      {/* Create Community Modal */}
      <CreateCommunityModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        form={form}
        setForm={setForm}
        handleCreate={handleCreate}
        isCreating={isCreating}
      />
    </div>
  )
}
