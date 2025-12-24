'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { formatTime } from '@/app/utils/formatTime';
import { FaPlay, FaPause, FaHeart, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SongItem = memo(({ song, index, setTrack, current, songs }) => {
  const isPlaying = current?._id === song._id;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      onClick={() => setTrack(song, index, songs)}
      className={`group relative flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer 
                 ${isPlaying
          ? 'bg-indigo-600/10 dark:bg-indigo-500/10 border-indigo-500/20 shadow-lg'
          : 'hover:bg-white/5 dark:hover:bg-gray-800/40 border-transparent'} border`}
    >
      {/* Index or Icon */}
      <div className="w-6 text-center text-xs font-bold text-gray-500 group-hover:hidden">
        {index + 1}
      </div>
      <div className="w-6 hidden group-hover:flex items-center justify-center text-indigo-500">
        {isPlaying ? <FaPause size={12} className="animate-pulse" /> : <FaPlay size={10} />}
      </div>

      {/* Artwork */}
      <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-md">
        <Image src={song.cover} alt={song.title} fill className="object-cover" />
        {isPlaying && (
          <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center backdrop-blur-[1px]">
            <div className="flex gap-0.5 items-end">
              <motion.div animate={{ height: [4, 12, 6] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-white" />
              <motion.div animate={{ height: [8, 4, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-white" />
              <motion.div animate={{ height: [10, 6, 12] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-0.5 bg-white" />
            </div>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="flex-1 min-w-0">
        <div className={`font-bold text-sm truncate ${isPlaying ? 'text-indigo-500' : 'dark:text-white'}`}>
          {song.title}
        </div>
        <div className="text-xs text-gray-500 font-medium truncate italic">
          {song.artist}
        </div>
      </div>

      {/* Stats/Metas */}
      <div className="hidden md:block w-32 text-[10px] font-black uppercase tracking-widest text-gray-500 overflow-hidden text-right">
        {song.album || 'Single'}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-gray-500 hover:text-red-500 transition-colors">
          <FaHeart size={14} />
        </button>
        <button className="text-gray-500 hover:text-indigo-400 transition-colors">
          <FaPlus size={14} />
        </button>
        <div className="text-xs font-mono text-gray-400">
          {formatTime(song.duration)}
        </div>
      </div>

      {/* Duration (Static) */}
      <div className="text-xs font-mono text-gray-400 group-hover:hidden w-10 text-right">
        {formatTime(song.duration)}
      </div>
    </motion.div>
  );
});

SongItem.displayName = 'SongItem';
export default SongItem;