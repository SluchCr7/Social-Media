'use client';

import Link from 'next/link';
import React, { memo } from 'react';
import { Search, Upload, Music2, X } from 'lucide-react';
import Image from 'next/image';

const HeaderMusic = memo(({ search, setSearch, setOpenModel, userData }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-[#08080f]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-400 transition-colors">
              <Music2 size={18} strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <span className="block text-sm font-bold leading-4 text-white">Music</span>
              <span className="text-[10px] tracking-widest text-zinc-600 uppercase">Space</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex ml-2">
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all"
            >
              Home
            </Link>
            <Link
              href="/Pages/Music"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 transition-all"
            >
              Discover
            </Link>
          </nav>
        </div>

        {/* Search */}
        <div className="order-3 w-full max-w-md flex-1 md:order-none">
          <label className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-zinc-500 transition-all focus-within:border-indigo-500/40 focus-within:text-indigo-400 focus-within:bg-zinc-900">
            <Search size={15} className="shrink-0" />
            <input
              aria-label="Search tracks and artists"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tracks, artists, albums…"
              className="min-w-0 w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="shrink-0 rounded-md p-0.5 text-zinc-600 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </label>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenModel(true)}
            className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-zinc-900 transition-all hover:bg-indigo-500 hover:text-white shadow-md shadow-black/20"
          >
            <Upload size={15} />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* User avatar chip */}
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5">
            <div className="hidden text-right sm:block">
              <p className="max-w-24 truncate text-xs font-semibold text-zinc-200">{userData?.username || 'Your space'}</p>
              <p className="text-[10px] text-zinc-600">Listener</p>
            </div>
            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-zinc-700 shrink-0">
              <Image
                width={28}
                height={28}
                src={userData?.profilePhoto?.url || '/default-avatar.png'}
                alt="user"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

HeaderMusic.displayName = 'HeaderMusic';
export default HeaderMusic;
