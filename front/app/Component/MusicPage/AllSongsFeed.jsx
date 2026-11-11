'use client';

import React from 'react';
import SongItem from './SongItem';
import { HiMusicalNote } from 'react-icons/hi2';

const AllSongsFeed = ({ filtered = [], current, playing, setTrack }) => {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c11] p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
          <HiMusicalNote size={16} className="text-indigo-300" />
          <span>Recent releases</span>
        </div>
        <span className="text-[11px] text-zinc-600">Tap a track to play</span>
      </div>

      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((s) => (
            <SongItem
              key={s._id}
              song={s}
              setTrack={setTrack}
              current={current}
              playing={playing}
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