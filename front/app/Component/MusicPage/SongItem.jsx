'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { formatTime } from '@/app/utils/formatTime';
import { HiPlay, HiPause, HiHeart, HiPlusCircle, HiEllipsisHorizontal } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const SongItem = memo(({ song, index, setTrack, current, songs }) => {
  const isPlaying = current?._id === song._id;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => setTrack(song, index, songs)}
      className={`group relative flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer 
                 ${isPlaying
          ? 'bg-indigo-600/10 border-indigo-500/20 shadow-xl'
          : 'hover:bg-white/[0.03] border-transparent'} border border-white/[0.02]`}
    >
      {/* Visual Indicator / Play State */}
      <div className="w-10 h-10 relative shrink-0">
        <div className="absolute inset-0 flex items-center justify-center">
          {!isPlaying && <span className="text-[10px] font-black text-white/20 group-hover:hidden">{index + 1}</span>}
          <div className={`transition-all duration-300 ${isPlaying ? 'flex' : 'hidden group-hover:flex'} items-center justify-center text-indigo-500`}>
            {isPlaying ? <HiPause size={18} /> : <HiPlay size={18} className="ml-1" />}
          </div>
        </div>

        {/* Artwork with Pulse Effect if playing */}
        <div className={`w-10 h-10 rounded-xl overflow-hidden bg-gray-900 border border-white/5 transition-transform duration-500 ${isPlaying ? 'scale-90 rotate-3' : 'group-hover:scale-105'}`}>
          <Image src={song.cover} alt={song.title} width={40} height={40} className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Track info Cell */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-bold truncate tracking-tight transition-colors ${isPlaying ? 'text-indigo-400' : 'text-white/90 group-hover:text-white'}`}>
          {song.title}
        </h4>
        <p className="text-[10px] font-black text-white/30 truncate uppercase tracking-widest mt-0.5">
          {song.artist}
        </p>
      </div>

      {/* Album Cell - Desktop Only */}
      <div className="hidden md:block w-40 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 truncate px-4 group-hover:text-white/40 transition-colors">
        {song.album || 'Digital Single'}
      </div>

      {/* Actions Cell */}
      <div className="flex items-center gap-2 pr-2">
        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <button className="p-2 text-white/20 hover:text-red-500 transition-colors">
            <HiHeart size={16} />
          </button>
          <button className="p-2 text-white/20 hover:text-indigo-500 transition-colors">
            <HiPlusCircle size={16} />
          </button>
          <button className="p-2 text-white/20 hover:text-white transition-colors">
            <HiEllipsisHorizontal size={18} />
          </button>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] font-mono font-bold text-white/30 w-12 text-right group-hover:hidden">
          {formatTime(song.duration)}
        </span>
      </div>

      {/* Progress Line (Left Side) */}
      {isPlaying && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
      )}
    </motion.div>
  );
});

SongItem.displayName = 'SongItem';
export default SongItem;