'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { HiMusicalNote, HiHeart } from 'react-icons/hi2';

const SidebarNowPlaying = memo(({ current }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        {t('Active Stream')}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          {current?.cover ? (
            <Image src={current.cover} alt={current.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-800">
              <HiMusicalNote size={22} className="text-zinc-600" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{current?.title || t('Standby...')}</p>
          <p className="truncate text-xs text-zinc-500">{current?.artist || t('Unknown Transmission')}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-zinc-950/80 p-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Plays</p>
          <p className="mt-1 text-sm font-semibold text-white">{current?.listenCount ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-zinc-950/80 p-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Likes</p>
          <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-white">
            <HiHeart size={13} className="text-red-500" />
            {current?.likes?.length ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
});

SidebarNowPlaying.displayName = 'SidebarNowPlaying';
export default SidebarNowPlaying;