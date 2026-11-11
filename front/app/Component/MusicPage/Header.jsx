'use client';

import Link from 'next/link';
import React, { memo } from 'react';
import { HiMagnifyingGlass, HiCloudArrowUp, HiMusicalNote, HiXMark } from 'react-icons/hi2';
import Image from 'next/image';

const HeaderMusic = memo(({ search, setSearch, setOpenModel, userData }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 rounded-2xl px-1 py-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400 text-zinc-950">
              <HiMusicalNote size={19} />
            </div>
            <div>
              <span className="block text-sm font-semibold leading-4 text-white">Sound</span>
              <span className="text-[10px] tracking-wide text-zinc-500">MUSIC SPACE</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex">
            <Link href="/" className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200">Home</Link>
            <Link href="/Pages/Music" className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Discover</Link>
          </nav>
        </div>

        <div className="order-3 w-full max-w-xl flex-1 md:order-none">
          <label className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2.5 text-zinc-400 transition focus-within:border-indigo-300/40 focus-within:text-indigo-300">
            <HiMagnifyingGlass size={16} />
            <input
              aria-label="Search tracks and artists"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tracks, artists, albums…"
              className="min-w-0 w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} aria-label="Clear search" className="rounded-full p-1 text-zinc-500 hover:text-white">
                <HiXMark size={16} />
              </button>
            )}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenModel(true)}
            className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-indigo-100"
          >
            <HiCloudArrowUp size={16} />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-2 py-1.5">
            <div className="hidden text-right sm:block">
              <p className="max-w-28 truncate text-xs font-medium text-white">{userData?.username || 'Your space'}</p>
              <p className="text-[10px] text-zinc-500">Listening now</p>
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