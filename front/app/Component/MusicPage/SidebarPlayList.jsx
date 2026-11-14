'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { formatTime } from '@/app/utils/formatTime';
import { useTranslation } from 'react-i18next';
import { Heart, FolderOpen } from 'lucide-react';

const SidebarPlaylist = memo(({ myPlaylist, setTrack }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <Heart size={13} className="text-rose-500 fill-rose-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
            {t('Saved Tracks')}
          </span>
        </div>
        <span className="text-[11px] text-zinc-600 font-medium">{myPlaylist?.length || 0}</span>
      </div>

      {/* List */}
      <div className="p-3 max-h-64 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {myPlaylist?.length ? (
          <div className="space-y-1">
            {myPlaylist.map((s, i) => (
              <button
                key={s._id}
                onClick={() => setTrack(s, i, myPlaylist)}
                className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-all hover:bg-white/[0.05] group"
              >
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-zinc-800">
                  <Image src={s.cover || '/default-music.jpg'} alt={s.title} fill className="object-cover" sizes="36px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">{s.title}</p>
                  <p className="truncate text-[11px] text-zinc-600">{s.artist}</p>
                </div>
                <span className="text-[10px] text-zinc-700 font-mono shrink-0">{formatTime(s.duration)}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FolderOpen size={22} className="mb-2 text-zinc-700" />
            <p className="text-xs font-medium text-zinc-500">{t('No saved tracks yet')}</p>
            <p className="text-[11px] text-zinc-700 mt-1">{t('Hit the bookmark icon to save tracks')}</p>
          </div>
        )}
      </div>
    </div>
  );
});

SidebarPlaylist.displayName = 'SidebarPlaylist';
export default SidebarPlaylist;
