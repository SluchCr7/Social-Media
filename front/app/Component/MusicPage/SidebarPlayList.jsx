'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { formatTime } from '@/app/utils/formatTime';
import { useTranslation } from 'react-i18next';
import { HiHeart, HiFolderOpen } from 'react-icons/hi2';

const SidebarPlaylist = memo(({ myPlaylist, setTrack }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
          <HiHeart size={14} className="text-red-500" />
          {t('Personal Core')}
        </div>
        <span className="text-xs text-zinc-500">{myPlaylist?.length || 0} saved</span>
      </div>

      {myPlaylist?.length ? (
        <div className="space-y-2">
          {myPlaylist.map((s, i) => (
            <button
              key={s._id}
              onClick={() => setTrack(s, i, myPlaylist)}
              className="flex w-full items-center gap-3 rounded-2xl border border-transparent bg-zinc-950/70 px-2 py-2 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                <Image src={s.cover || '/default-music.jpg'} alt={s.title} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{s.title}</p>
                <p className="truncate text-xs text-zinc-500">{s.artist}</p>
              </div>
              <span className="text-[10px] text-zinc-500">{formatTime(s.duration)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-8 text-center">
          <HiFolderOpen size={24} className="mb-2 text-zinc-600" />
          <p className="text-sm font-semibold text-zinc-300">Your saved tracks will appear here</p>
        </div>
      )}
    </div>
  );
});

SidebarPlaylist.displayName = 'SidebarPlaylist';
export default SidebarPlaylist;