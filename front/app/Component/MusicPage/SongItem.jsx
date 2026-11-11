'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { formatTime } from '@/app/utils/formatTime';
import { HiPlay, HiPause } from 'react-icons/hi2';

const SongItem = memo(({ song, setTrack, current, playing }) => {
  const isCurrent = current?._id === song._id;

  return (
    <button
      onClick={() => setTrack(song)}
      aria-label={`Play ${song.title} by ${song.artist}`}
      className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors ${isCurrent
        ? 'border-indigo-300/20 bg-indigo-300/[0.07]'
        : 'border-transparent hover:border-white/[0.08] hover:bg-white/[0.035]'}`}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
        <Image src={song.cover || '/default-music.jpg'} alt={song.title} fill className="object-cover" sizes="40px" />
      </div>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isCurrent ? 'text-indigo-200' : 'text-zinc-100'}`}>{song.title}</p>
        <p className="truncate text-xs text-zinc-500">{song.artist}</p>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <span className="text-xs text-zinc-500">{formatTime(song.duration)}</span>
        <div className={`rounded-full p-2 ${isCurrent ? 'bg-indigo-300 text-zinc-950' : 'bg-white/[0.06] text-zinc-400 group-hover:text-white'}`}>
          {isCurrent && playing ? <HiPause size={14} /> : <HiPlay size={14} />}
        </div>
      </div>
    </button>
  );
});

SongItem.displayName = 'SongItem';
export default SongItem;