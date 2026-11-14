'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Music2, Heart, Radio } from 'lucide-react';

const SidebarNowPlaying = memo(({ current }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/60">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          {t('Now Playing')}
        </span>
        {current && <Radio size={12} className="ml-auto text-indigo-400" />}
      </div>

      {/* Content */}
      <div className="p-4">
        {current ? (
          <>
            {/* Cover + Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
                {current.cover ? (
                  <Image src={current.cover} alt={current.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Music2 size={20} className="text-zinc-600" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{current.title}</p>
                <p className="truncate text-xs text-zinc-500 mt-0.5">{current.artist}</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-zinc-950/70 border border-zinc-800/50 p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Plays</p>
                <p className="text-sm font-bold text-white">{(current?.listenCount ?? 0).toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-zinc-950/70 border border-zinc-800/50 p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Likes</p>
                <div className="flex items-center gap-1.5">
                  <Heart size={12} className="text-rose-500 fill-rose-500 shrink-0" />
                  <p className="text-sm font-bold text-white">{(current?.likes?.length ?? 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-3 h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <Music2 size={22} className="text-zinc-600" />
            </div>
            <p className="text-sm font-medium text-zinc-400">{t('Standby...')}</p>
            <p className="text-xs text-zinc-600 mt-1">{t('Nothing is playing yet')}</p>
          </div>
        )}
      </div>
    </div>
  );
});

SidebarNowPlaying.displayName = 'SidebarNowPlaying';
export default SidebarNowPlaying;
