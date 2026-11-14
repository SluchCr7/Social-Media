'use client';

import React from 'react';
import SongItem from './SongItem';
import { Music2 } from 'lucide-react';

const AllSongsFeed = ({ filtered = [], current, playing, setTrack }) => {
  return (
    <div className="space-y-1">
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-14 text-center">
          <Music2 size={28} className="mb-3 text-zinc-700" />
          <p className="text-sm font-semibold text-zinc-400">No tracks found</p>
          <p className="mt-1 text-xs text-zinc-600">Try a different search or genre.</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(AllSongsFeed);
