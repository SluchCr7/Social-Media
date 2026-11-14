'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { TrendingUp, Play } from 'lucide-react';

const SongCard = memo(({ song, index, setTrack, songs }) => {
  return (
    <button
      onClick={() => setTrack(song, index, songs)}
      className="group relative flex items-center gap-3 rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-3 text-left transition-all hover:border-indigo-500/30 hover:bg-zinc-800/80"
    >
      {/* Rank number */}
      <span className="absolute top-2.5 left-2.5 text-[10px] font-black text-zinc-700 leading-none select-none">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Cover */}
      <div className="relative ml-5 h-11 w-11 shrink-0 overflow-hidden rounded-xl">
        <Image src={song.cover || '/default-music.jpg'} alt={song.title} fill className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <Play size={14} className="text-white ml-0.5" />
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors">{song.title}</p>
        <p className="truncate text-xs text-zinc-500 mt-0.5">{song.artist}</p>
      </div>

      {/* Play button hint */}
      <div className="shrink-0 w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:border-indigo-500 group-hover:text-indigo-400 transition-all">
        <Play size={12} className="ml-0.5" />
      </div>
    </button>
  );
});

SongCard.displayName = 'SongCard';

const TrendingSongs = memo(({ songs, setTrack }) => {
  if (!songs || songs.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15">
          <TrendingUp size={14} className="text-indigo-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">Trending Now</h3>
        <span className="text-xs text-zinc-600">· {songs.length} tracks</span>
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
