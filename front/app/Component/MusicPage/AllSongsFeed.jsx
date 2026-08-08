'use client';

import React from 'react';
import SongItem from './SongItem';
import { HiMusicalNote } from 'react-icons/hi2';

const AllSongsFeed = ({ filtered, current, setTrack, songs }) => {
  return (
    <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/70 p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-2 text-sm text-zinc-400">
        <HiMusicalNote size={16} className="text-indigo-400" />
        <span>Recent releases</span>
      </div>

      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((s, i) => (
            <SongItem
              key={s._id}
              song={s}
              index={i}
              setTrack={setTrack}
              current={current}
              songs={songs}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-12 text-center">
            <HiMusicalNote size={28} className="mb-3 text-zinc-600" />
            <p className="text-sm font-semibold text-zinc-300">No tracks found</p>
            <p className="mt-1 text-xs text-zinc-500">Try a different search or genre.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AllSongsFeed);