'use client';

import React from 'react';
import SongItem from './SongItem';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaMusic, FaFilter } from 'react-icons/fa';

const AllSongsFeed = ({ filtered, current, setTrack, songs }) => {
  const { t } = useTranslation();

  return (
    <div className="relative rounded-[2.5rem] p-8 bg-white/5 dark:bg-gray-900/40 border border-white/5 backdrop-blur-3xl shadow-2xl overflow-hidden">
      {/* Ambient background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full -mr-32 -mt-32" />

      {/* Header Area */}
      <div className="relative flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <FaMusic className="text-indigo-500" />
          </div>
          <div>
            <h3 className="text-2xl font-black dark:text-white leading-tight">{t("All Songs")}</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{filtered.length} Tracks Found</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest border border-white/5">
          <FaFilter />
          <span>Filter</span>
        </button>
      </div>

      {/* List Container */}
      <div className="relative space-y-2 max-h-[1200px] overflow-y-auto pr-2 custom-scrollbar">
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
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-white flex items-center justify-center mb-4">
              <FaMusic size={32} />
            </div>
            <p className="font-bold tracking-widest uppercase text-xs">No matching rhythms found</p>
          </div>
        )}
      </div>

      {/* Subtle Footer helper */}
      <div className="mt-8 flex items-center justify-center">
        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          End of Library
        </div>
      </div>
    </div>
  );
};

export default AllSongsFeed;