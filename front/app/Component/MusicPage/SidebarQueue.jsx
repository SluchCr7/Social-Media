'use client';

import React, { memo } from 'react';
import { formatTime } from '@/app/utils/formatTime';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ListMusic } from 'lucide-react';

const SidebarQueue = memo(({ queue, setTrack }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <ListMusic size={13} className="text-indigo-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
            {t('Up Next')}
          </span>
        </div>
        <span className="text-[11px] text-zinc-600 font-medium">{queue.length}</span>
      </div>

      {/* List */}
      <div className="p-3 max-h-56 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {queue.length > 0 ? (
          <div className="space-y-1">
            {queue.map((q, idx) => (
              <button
                key={q._id}
                onClick={() => setTrack(q, idx, queue)}
                className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-all hover:bg-white/[0.05] group"
              >
                <span className="text-[10px] font-mono text-zinc-700 w-4 shrink-0">{idx + 1}</span>
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-zinc-800">
                  <Image src={q.cover || '/default-music.jpg'} alt={q.title} fill className="object-cover" sizes="36px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">{q.title}</p>
                  <p className="truncate text-[11px] text-zinc-600">{q.artist}</p>
                </div>
                <span className="text-[10px] text-zinc-700 font-mono shrink-0">{formatTime(q.duration)}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ListMusic size={22} className="mb-2 text-zinc-700" />
            <p className="text-xs font-medium text-zinc-500">{t('Queue is empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
});

SidebarQueue.displayName = 'SidebarQueue';
export default SidebarQueue;
