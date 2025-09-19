// 'use client'

// import React, { useEffect, useMemo, useState, useCallback } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { motion, AnimatePresence } from 'framer-motion'
// import { FaPlus, FaFilter, FaUsers, FaSearch } from 'react-icons/fa'
// import { useCommunity } from '@/app/Context/CommunityContext'
// import { useAuth } from '@/app/Context/AuthContext'

// const CATEGORY_OPTIONS = [
//   'All', 'Technology', 'Art', 'Science', 'Gaming', 'Music',
//   'Food', 'Travel', 'Health', 'Business', 'Politics', 'Sports', 'Other'
// ]

// const SORT_OPTIONS = ['Newest', 'Most Members', 'A-Z']

// const Badge = ({ children, className = '' }) => (
//   <span className={`inline-block text-xs px-2 py-1 rounded-full ${className}`}>{children}</span>
// )

// export default function CommunityPage() {
//   const { communities, addCommunity, joinCommunity } = useCommunity()
//   const { user } = useAuth()

//   // UI state
//   const [activeCategory, setActiveCategory] = useState('All')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [debouncedSearch, setDebouncedSearch] = useState('')
//   const [sortBy, setSortBy] = useState('Newest')
//   const [showCreateModal, setShowCreateModal] = useState(false)

//   // form
//   const [form, setForm] = useState({ name: '', description: '', category: 'Technology' })
//   const [isCreating, setIsCreating] = useState(false)

//   // local optimistic joined state: { [communityId]: true }
//   const [joinedLocal, setJoinedLocal] = useState({})

//   // Debounce searchTerm -> debouncedSearch
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300)
//     return () => clearTimeout(t)
//   }, [searchTerm])

//   // derived categories from communities (keeps 'All')
//   const categories = useMemo(() => {
//     const cats = new Set(communities.map((c) => c.Category || c.category || 'Other'))
//     return ['All', ...Array.from(cats).slice(0, 12)]
//   }, [communities])

//   // Filter + search + sort
//   const filtered = useMemo(() => {
//     const s = debouncedSearch.toLowerCase()
//     const results = communities
//       .filter((c) => (activeCategory === 'All' ? true : (c.Category || c.category) === activeCategory))
//       .filter((c) => {
//         if (!s) return true
//         const name = (c.Name || c.name || '').toLowerCase()
//         const desc = (c.description || '').toLowerCase()
//         const cat = ((c.Category || c.category) || '').toLowerCase()
//         return name.includes(s) || desc.includes(s) || cat.includes(s)
//       })
//       .map((c) => ({ ...c, _membersCount: (c.members || []).length }))

//     if (sortBy === 'Most Members') {
//       results.sort((a, b) => b._membersCount - a._membersCount)
//     } else if (sortBy === 'A-Z') {
//       results.sort((a, b) => (a.Name || a.name || '').localeCompare(b.Name || b.name || ''))
//     } else {
//       results.sort((a, b) => new Date(b.createdAt || b.createdAt) - new Date(a.createdAt || a.createdAt))
//     }

//     return results
//   }, [communities, activeCategory, debouncedSearch, sortBy])

//   // create handler
//   const handleCreate = async (e) => {
//     e.preventDefault()
//     if (!form.name.trim() || !form.description.trim()) return
//     try {
//       setIsCreating(true)
//       await addCommunity?.(form.name.trim(), form.category, form.description.trim())
//       setForm({ name: '', description: '', category: 'Technology' })
//       setShowCreateModal(false)
//     } catch (err) {
//       console.error('Create community error', err)
//     } finally {
//       setIsCreating(false)
//     }
//   }

//   // join handler
//   const handleJoin = useCallback(
//     async (commId) => {
//       setJoinedLocal((prev) => ({ ...prev, [commId]: !prev[commId] }))
//       try {
//         await joinCommunity?.(commId)
//       } catch (err) {
//         setJoinedLocal((prev) => ({ ...prev, [commId]: !prev[commId] }))
//         console.error('Join community failed', err)
//       }
//     },
//     [joinCommunity]
//   )

//   const isJoined = (comm) => {
//     const joinedInServer = comm.members?.includes?.(user?._id)
//     if (typeof joinedInServer === 'boolean') return joinedInServer
//     return Boolean(joinedLocal[comm._id])
//   }

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-10">
//       {/* HERO */}
//       <div className="relative bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl text-white p-6 md:p-8 overflow-hidden shadow-lg">
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
//           <div className="w-full md:w-2/3">
//             <h1 className="text-3xl md:text-4xl font-extrabold">🌐 Community Hub</h1>
//             <p className="mt-2 text-sm md:text-base opacity-95 max-w-full">
//               Discover, create and join active groups around your interests. Follow communities to keep up with
//               conversations and meet like-minded people.
//             </p>
//             <div className="mt-4 flex flex-wrap gap-3">
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="inline-flex items-center gap-2 bg-white text-sky-600 px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform"
//                 aria-label="Create Community"
//               >
//                 <FaPlus /> Create Community
//               </button>
//               <Link href="#communities">
//                 <span className="inline-flex items-center gap-2 text-sm text-white/90 hover:underline cursor-pointer">Browse communities</span>
//               </Link>
//             </div>
//           </div>

//           <div className="w-full md:w-1/3 flex justify-center md:justify-end">
//             <div className="w-48 h-48 rounded-xl bg-white/10 p-4 flex items-center justify-center overflow-hidden">
//               <Image
//                 src={"/Find.svg"}
//                 alt='find_img'
//                 width={500}
//                 height={500}
//                 className='w-full h-full object-contain'
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between flex-wrap">
//         {/* Chips */}
//         <div className="flex gap-2 flex-wrap">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setActiveCategory(cat)}
//               className={`text-xs px-3 py-1.5 rounded-full border transition select-none whitespace-nowrap shadow-sm
//                 ${activeCategory === cat ? 'bg-sky-600 text-white border-sky-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'}`}
//               aria-pressed={activeCategory === cat}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
//           <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 flex-1 min-w-[160px]">
//             <FaSearch className="text-gray-500" />
//             <input
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search communities..."
//               className="bg-transparent outline-none text-sm w-full"
//               aria-label="Search communities"
//             />
//           </div>

//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="p-2 rounded-lg border text-sm bg-white dark:bg-gray-900 min-w-[120px]"
//             aria-label="Sort communities"
//           >
//             {SORT_OPTIONS.map((s) => (
//               <option key={s} value={s}>{s}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Cards */}
//       <section id="communities" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filtered.length === 0 ? (
//           <div className="col-span-full p-8 bg-white dark:bg-gray-900 rounded-2xl shadow flex flex-col items-center justify-center gap-4">
//             <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">📭</div>
//             <h3 className="text-lg font-semibold">No communities found</h3>
//             <p className="text-sm text-gray-500">Try a different filter or create a new community.</p>
//             <button onClick={() => setShowCreateModal(true)} className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-lg">Create community</button>
//           </div>
//         ) : (
//           filtered.map((comm) => (
//             <motion.article
//               key={comm._id}
//               whileHover={{ y: -6 }}
//               className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden border border-transparent hover:shadow-lg transition"
//             >
//               <Link href={`/Pages/Community/${comm._id}`}>
//                 <a className="block relative w-full h-36">
//                   <Image
//                     src={comm?.Cover?.url || comm?.cover?.url || '/placeholder-cover.png'}
//                     alt={comm.Name}
//                     fill
//                     style={{ objectFit: 'cover' }}
//                     sizes="(max-width: 768px) 100vw, 33vw"
//                   />
//                 </a>
//               </Link>

//               <div className="pt-10 pb-6 px-5 text-center">
//                 <div className="-mt-14 mx-auto w-20 h-20 relative rounded-full overflow-hidden shadow-md">
//                   <Image
//                     src={comm?.Picture?.url || comm?.picture?.url || '/placeholder-avatar.png'}
//                     alt={comm.Name}
//                     fill
//                     style={{ objectFit: 'cover' }}
//                   />
//                 </div>

//                 <h3 className="mt-3 text-lg font-semibold text-gray-800 dark:text-gray-100">{comm.Name}</h3>
//                 <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{comm.description}</p>

//                 <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
//                   <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">{comm.Category || comm.Category}</Badge>
//                   <Badge className={`${comm.isPrivate ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-green-100 text-green-700 dark:bg-green-900/30'}`}>{comm.isPrivate ? 'Private' : 'Public'}</Badge>
//                   <span className="flex items-center gap-1 text-sm text-gray-500"><FaUsers /> {comm.members?.length || 0}</span>
//                 </div>

//                 <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
//                   <Link href={`/Pages/Community/${comm._id}`}>
//                     <a className="px-4 py-2 rounded-lg border border-sky-600 text-sky-600">View</a>
//                   </Link>
//                 </div>
//               </div>
//             </motion.article>
//           ))
//         )}
//       </section>

//       {/* Create Modal */}
//       <AnimatePresence>
//         {showCreateModal && (
//           <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//             <motion.div initial={{ y: 10, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, scale: 0.98 }} transition={{ type: 'spring', stiffness: 200 }} className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg p-6 mx-4 sm:mx-0 shadow-xl">
//               <h3 className="text-xl font-semibold text-sky-600 flex items-center gap-2"><FaPlus /> Create community</h3>

//               <form onSubmit={handleCreate} className="mt-4 space-y-4">
//                 <div>
//                   <label className="text-sm text-gray-600 dark:text-gray-300">Name</label>
//                   <input
//                     value={form.name}
//                     onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
//                     required
//                     className="w-full mt-1 p-3 rounded-lg border bg-white dark:bg-gray-800"
//                     placeholder="e.g. Frontend Devs"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm text-gray-600 dark:text-gray-300">Category</label>
//                   <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full mt-1 p-3 rounded-lg border bg-white dark:bg-gray-800">
//                     {CATEGORY_OPTIONS.filter(Boolean).map((c) => (
//                       <option key={c} value={c}>{c}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm text-gray-600 dark:text-gray-300">Description</label>
//                   <textarea
//                     value={form.description}
//                     onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
//                     required
//                     rows={4}
//                     className="w-full mt-1 p-3 rounded-lg border bg-white dark:bg-gray-800"
//                     placeholder="Short description about what the community is for"
//                   />
//                 </div>

//                 <div className="flex justify-end items-center gap-3 flex-wrap">
//                   <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
//                   <button type="submit" disabled={isCreating} className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold">{isCreating ? 'Creating...' : 'Create'}</button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }



'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaUsers, FaSearch } from 'react-icons/fa'
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

export default function CommunityPage() {
  const { communities, addCommunity, joinCommunity } = useCommunity()
  const { user } = useAuth()

  // UI state
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState('Newest')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // form
  const [form, setForm] = useState({ name: '', description: '', category: 'Technology', cover: null, avatar: null })
  const [isCreating, setIsCreating] = useState(false)

  // local optimistic joined state
  const [joinedLocal, setJoinedLocal] = useState({})

  // lazy loading
  const [visibleCount, setVisibleCount] = useState(6)
  const loadMore = () => setVisibleCount((v) => v + 6)

  // Debounce searchTerm
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300)
    return () => clearTimeout(t)
  }, [searchTerm])

  // derived categories
  const categories = useMemo(() => {
    const cats = new Set(communities.map((c) => c.Category || c.category || 'Other'))
    return ['All', ...Array.from(cats).slice(0, 12)]
  }, [communities])

  // Filter + search + sort
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
      results.sort((a, b) => b._members - a._members)
    } else if (sortBy === 'A-Z') {
      results.sort((a, b) => (a.Name || a.name || '').localeCompare(b.Name || b.name || ''))
    } else {
      results.sort((a, b) => new Date(b.createdAt || b.createdAt) - new Date(a.createdAt || a.createdAt))
    }

    return results
  }, [communities, activeCategory, debouncedSearch, sortBy])

  // Create handler
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


  const isJoined = (comm) => {
    const joinedInServer = comm.members?.includes?.(user?._id)
    if (typeof joinedInServer === 'boolean') return joinedInServer
    return Boolean(joinedLocal[comm._id])
  }

  // Infinite scroll effect
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-10">

      {/* HERO */}
      <div className="relative bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl text-white p-6 md:p-8 overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold">🌐 Community Hub</h1>
            <p className="text-sm md:text-base opacity-95 max-w-full">
              Discover, create, and join active groups around your interests.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-white text-sky-600 px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform"
              >
                <FaPlus /> Create Community
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <div className="w-48 h-48 rounded-xl bg-white/10 p-4 flex items-center justify-center overflow-hidden">
              <Image src={"/Find.svg"} alt='find_img' width={500} height={500} className='w-full h-full object-contain'/>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between flex-wrap sticky top-20 bg-white dark:bg-gray-50 z-10 p-2 rounded-md shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              className={`text-xs px-3 py-1.5 rounded-full border transition select-none whitespace-nowrap shadow-sm
                ${activeCategory === cat ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 flex-1 min-w-[160px]">
            <FaSearch className="text-gray-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search communities..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 rounded-lg border text-sm bg-white min-w-[120px]"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Community Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.slice(0, visibleCount).length === 0 ? (
          <div className="col-span-full p-8 bg-white rounded-2xl shadow flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">📭</div>
            <h3 className="text-lg font-semibold">No communities found</h3>
            <p className="text-sm text-gray-500">Try a different filter or create a new community.</p>
            <button onClick={() => setShowCreateModal(true)} className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-lg">Create community</button>
          </div>
        ) : (
          filtered.slice(0, visibleCount).map((comm) => (
            <motion.article
              key={comm._id}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-transparent hover:shadow-lg transition"
            >
              <Link href={`/Pages/Community/${comm._id}`}>
                <a className="block relative w-full h-36">
                  <Image
                    src={comm?.Cover?.url || comm?.cover?.url || '/placeholder-cover.png'}
                    alt={comm.Name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </a>
              </Link>

              <div className="pt-10 pb-6 px-5 text-center">
                <div className="-mt-14 mx-auto w-20 h-20 relative rounded-full overflow-hidden shadow-md">
                  <Image
                    src={comm?.Picture?.url || comm?.picture?.url || '/placeholder-avatar.png'}
                    alt={comm.Name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                <h3 className="mt-3 text-lg font-semibold text-gray-800">{comm.Name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{comm.description}</p>

                <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                  <Badge className="bg-gray-100 text-gray-700">{comm.Category}</Badge>
                  <Badge className={`${comm.isPrivate ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{comm.isPrivate ? 'Private' : 'Public'}</Badge>
                  <span className="flex items-center gap-1 text-sm text-gray-500"><FaUsers /> {comm.members?.length || 0}</span>
                </div>

                <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                  <Link href={`/Pages/Community/${comm._id}`}>
                    <a className="px-4 py-2 rounded-lg border border-sky-600 text-sky-600">View</a>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </section>

      {/* Create Community Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ y: 10, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, scale: 0.98 }} transition={{ type: 'spring', stiffness: 200 }} className="bg-white rounded-2xl w-full max-w-lg p-6 mx-4 sm:mx-0 shadow-xl">
              <h3 className="text-xl font-semibold text-sky-600 flex items-center gap-2"><FaPlus /> Create community</h3>

              <form onSubmit={handleCreate} className="mt-4 space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                    className="w-full mt-1 p-3 rounded-lg border"
                    placeholder="e.g. Frontend Devs"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full mt-1 p-3 rounded-lg border">
                    {CATEGORY_OPTIONS.filter(Boolean).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    required
                    rows={4}
                    className="w-full mt-1 p-3 rounded-lg border"
                    placeholder="Short description about what the community is for"
                  />
                </div>

                {/* Live Preview */}
                <div className="mt-2 border rounded-lg p-3 bg-gray-50">
                  <h4 className="font-semibold">Preview:</h4>
                  <p className="text-sm text-gray-700">{form.name || 'Community Name'}</p>
                  <p className="text-xs text-gray-500">{form.description || 'Community Description'}</p>
                </div>

                <div className="flex justify-end items-center gap-3 flex-wrap">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                  <button type="submit" disabled={isCreating} className="px-6 py-2 rounded-lg bg-sky-600 text-white font-semibold">{isCreating ? 'Creating...' : 'Create'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
