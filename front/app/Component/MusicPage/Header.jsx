import Link from 'next/link'
import React, { memo } from 'react'
import { FaSearch } from 'react-icons/fa'


const HeaderMusic = memo(({ search, setSearch, setOpenModel, userData }) => (
  <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-black/40 border-b border-gray-200 dark:border-gray-800">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Zocial</Link>
        <div className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-gray-800/60 rounded-full px-3 py-1 border">
          <FaSearch className="text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search songs, artists, albums..."
            className="bg-transparent outline-none w-64 text-sm text-gray-700 dark:text-gray-200"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setOpenModel(true)} className="px-3 py-1 rounded-md border hover:bg-indigo-600 hover:text-white transition">Upload</button>
        <div className="hidden md:block text-sm text-gray-500">{userData?.username}</div>
      </div>
    </div>
  </header>
))

export default HeaderMusic