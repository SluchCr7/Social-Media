'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { formatTime } from '@/app/utils/formatTime';
import { Play, Pause } from 'lucide-react';

const SongItem = memo(({ song, setTrack, current, playing }) => {
  const isCurrent = current?._id === song._id;

  return (
    <button
      onClick={() => setTrack(song)}
      aria-label={`Play ${song.title} by ${song.artist}`}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
        isCurrent
          ? 'bg-indigo-500/10 border border-indigo-500/20'
          : 'border border-transparent hover:bg-white/[0.04] hover:border-white/[0.06]'
      }`}
    >
      {/* Cover */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={song.cover || '/default-music.jpg'}
          alt={song.title}
          fill
          className="object-cover"
          sizes="40px"
        />
        {/* Play overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } bg-black/50`}>
          {isCurrent && playing
            ? <Pause size={12} className="text-white" />
            : <Play size={12} className="text-white ml-0.5" />
          }
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isCurrent ? 'text-indigo-300' : 'text-zinc-100 group-hover:text-white'}`}>
          {song.title}
        </p>
        <p className="truncate text-xs text-zinc-500">{song.artist}</p>
      </div>

      {/* Duration + Playing indicator */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        {isCurrent && playing && (
          <div className="flex items-end gap-0.5 h-4">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-0.5 rounded-full bg-indigo-400 animate-pulse"
                style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
        <span className="text-xs text-zinc-600 font-mono">{formatTime(song.duration)}</span>
      </div>
    </button>
  );
});

SongItem.displayName = 'SongItem';
export default SongItem;
