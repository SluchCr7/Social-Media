'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { HiPlay, HiArrowTrendingUp } from 'react-icons/hi2';

const SongCard = memo(({ song, index, setTrack, songs }) => {
  return (
    <button
      onClick={() => setTrack(song, index, songs)}
      className="group flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-2 text-left transition hover:border-indigo-500/40 hover:bg-zinc-900"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
        <Image src={song.cover || '/default-music.jpg'} alt={song.title} fill className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-white">{song.title}</p>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">0{index + 1}</span>
        </div>
        <p className="truncate text-xs text-zinc-500">{song.artist}</p>
      </div>

      <div className="rounded-full bg-zinc-800 p-2 text-zinc-200 transition group-hover:bg-indigo-500 group-hover:text-white">
        <HiPlay size={14} />
      </div>
    </button>
  );
});

SongCard.displayName = 'SongCard';

const TrendingSongs = memo(({ songs, setTrack }) => {
  if (!songs || songs.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
        <HiArrowTrendingUp size={16} />
        <span>Trending now</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {songs.map((s, i) => (
          <SongCard key={s._id} song={s} index={i} setTrack={setTrack} songs={songs} />
        ))}
      </div>
    </div>
  );
});

TrendingSongs.displayName = 'TrendingSongs';
export default TrendingSongs;