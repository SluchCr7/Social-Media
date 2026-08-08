'use client';

import React, { memo } from 'react';
import { formatTime } from '@/app/utils/formatTime';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { HiQueueList } from 'react-icons/hi2';

const SidebarQueue = memo(({ queue, setTrack }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
          <HiQueueList size={14} className="text-indigo-400" />
          {t('Frequency Queue')}
        </div>
        <span className="text-xs text-zinc-500">{queue.length} queued</span>
      </div>

      <div className="space-y-2">
        {queue.length > 0 ? (
          queue.map((q, idx) => (
            <button
              key={q._id}
              onClick={() => setTrack(q, idx, queue)}
              className="flex w-full items-center gap-3 rounded-2xl border border-transparent bg-zinc-950/70 px-2 py-2 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                <Image src={q.cover || '/default-music.jpg'} alt={q.title} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{q.title}</p>
                <p className="truncate text-xs text-zinc-500">{q.artist}</p>
              </div>
              <span className="text-[10px] text-zinc-500">{formatTime(q.duration)}</span>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-8 text-center">
            <HiQueueList size={24} className="mb-2 text-zinc-600" />
            <p className="text-sm font-semibold text-zinc-300">Queue is empty</p>
          </div>
        )}
      </div>
    </div>
  );
});

SidebarQueue.displayName = 'SidebarQueue';
export default SidebarQueue;