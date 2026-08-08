'use client';

import Link from 'next/link';
import React, { memo } from 'react';
import { HiMagnifyingGlass, HiCloudArrowUp } from 'react-icons/hi2';
import Image from 'next/image';

const HeaderMusic = memo(({ search, setSearch, setOpenModel, userData }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
              Z
            </div>
            <span className="text-sm font-semibold text-white">Music</span>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex">
            <Link href="/" className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200">Home</Link>
            <Link href="/Pages/Music" className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Discover</Link>
          </nav>
        </div>

        <div className="flex-1 max-w-xl">
          <label className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-zinc-400 focus-within:border-indigo-500 focus-within:text-indigo-400">
            <HiMagnifyingGlass size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tracks or artists"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenModel(true)}
            className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-indigo-500 hover:text-white"
          >
            <HiCloudArrowUp size={16} />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-1">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-white">{userData?.username || 'User'}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Studio</p>
            </div>
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-zinc-700">
              <Image
                width={40}
                height={40}
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