'use client';

import Link from 'next/link';
import React, { memo } from 'react';
import { FaSearch, FaCloudUploadAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HeaderMusic = memo(({ search, setSearch, setOpenModel, userData }) => {
  return (
    <header className="sticky top-0 z-[100] w-full backdrop-blur-md bg-white/40 dark:bg-black/40 border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
        {/* Logo & Brand */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-black text-xl italic">Z</span>
          </div>
          <span className="hidden sm:block text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
            Zocial <span className="text-indigo-500">Music</span>
          </span>
        </Link>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-2xl relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for tracks, artists, or vibes..."
            className="w-full bg-white/60 dark:bg-gray-800/60 border border-transparent focus:border-indigo-500/50 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all shadow-sm focus:shadow-indigo-500/10 dark:text-white placeholder:text-gray-400"
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <kbd className="hidden md:inline-flex items-center gap-1 h-5 px-1.5 font-sans text-[10px] font-medium text-gray-400 bg-gray-50 dark:bg-gray-900 border border-white/10 rounded">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenModel(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all"
          >
            <FaCloudUploadAlt />
            <span className="hidden md:inline">Upload Track</span>
          </motion.button>

          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold dark:text-white leading-tight">{userData?.username}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Premium User</div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img src={userData?.profilePhoto?.url || '/default-avatar.png'} alt="user" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

HeaderMusic.displayName = 'HeaderMusic';
export default HeaderMusic;