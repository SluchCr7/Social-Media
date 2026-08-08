'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { formatTime } from '@/app/utils/formatTime';
import { HiPlay, HiPause } from 'react-icons/hi2';

const SongItem = memo(({ song, index, setTrack, current, songs }) => {
  const isPlaying = current?._id === song._id;

  return (
    <button
      onClick={() => setTrack(song, index, songs)}
      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition ${isPlaying
        ? 'border-indigo-500/40 bg-indigo-500/10'
        : 'border-transparent bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/80'}`}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
        <Image src={song.cover || '/default-music.jpg'} alt={song.title} fill className="object-cover" sizes="40px" />
      </div>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${isPlaying ? 'text-indigo-400' : 'text-white'}`}>{song.title}</p>
        <p className="truncate text-xs text-zinc-500">{song.artist}</p>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <span className="text-xs text-zinc-500">{formatTime(song.duration)}</span>
        <div className={`rounded-full p-2 ${isPlaying ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
          {isPlaying ? <HiPause size={14} /> : <HiPlay size={14} />}
        </div>
      </div>
    </button>
  );
});

SongItem.displayName = 'SongItem';
export default SongItem;