'use client';

import Link from 'next/link';
import React, { memo } from 'react';
import { HiMagnifyingGlass, HiCloudArrowUp, HiBell } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import Image from 'next/image';

const HeaderMusic = memo(({ search, setSearch, setOpenModel, userData }) => {
  return (
    <header className="sticky top-0 z-[100] w-full backdrop-blur-xl bg-black/60 border-b border-white/[0.05]">
      <div className="max-w-[1700px] mx-auto px-8 py-4 flex items-center justify-between gap-10">

        {/* Brand Identity */}
        <div className="flex items-center gap-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-md opacity-30 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <span className="text-black font-black text-xl italic tracking-tighter">Z</span>
              </div>
            </div>
            <span className="hidden sm:block text-xl font-black text-white tracking-tighter uppercase">
              Music <span className="text-indigo-500">Core</span>
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Home</Link>
            <Link href="/Pages/Music" className="text-xs font-black uppercase tracking-widest text-white underline decoration-indigo-500 decoration-2 underline-offset-8">Discovery</Link>
            <Link href="#" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Playlists</Link>
          </nav>
        </div>

        {/* Search Engine - Minimalist Style */}
        <div className="flex-1 max-w-xl relative group">
          <HiMagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rhythms, visions, or artists..."
            className="w-full bg-white/[0.03] border border-white/[0.05] focus:border-indigo-500/50 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none transition-all placeholder:text-white/10"
          />
        </div>

        {/* User Actions & Profile */}
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenModel(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5"
          >
            <HiCloudArrowUp size={16} />
            <span className="hidden md:inline">Distribute Track</span>
          </motion.button>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-white/40 hover:text-white transition-colors">
              <HiBell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full ring-4 ring-black" />
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-2">
              <div className="text-right">
                <div className="text-xs font-bold text-white uppercase tracking-tighter leading-none mb-1">{userData?.username || 'Pilot'}</div>
                <div className="text-[8px] text-gray-500 uppercase tracking-[0.2em] font-black">Digital Node</div>
              </div>
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-indigo-500/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-gray-900 shadow-xl">
                  <Image width={500} height={500} src={userData?.profilePhoto?.url || '/default-avatar.png'} alt="user" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

HeaderMusic.displayName = 'HeaderMusic';
export default HeaderMusic;