'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlay, FaHeart, FaEllipsisH } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SongCard = memo(({ song, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative flex flex-col gap-3 p-4 rounded-[2rem] bg-white/5 hover:bg-white/10 dark:bg-gray-900/40 dark:hover:bg-gray-800/60 transition-all duration-500 border border-white/5 hover:border-white/10 shadow-xl"
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden shadow-2xl">
        <Image src={song.cover} alt={song.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl"
          >
            <FaPlay size={20} className="ml-1" />
          </motion.button>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
            Trending
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex justify-between items-start px-1">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm dark:text-white truncate group-hover:text-indigo-400 transition-colors">
            {song.title}
          </h4>
          <p className="text-xs text-gray-500 font-medium truncate">
            {song.artist}
          </p>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors mt-1">
          <FaEllipsisH size={14} />
        </button>
      </div>

      {/* Stats/Action Row */}
      <div className="flex items-center justify-between px-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
          <FaHeart className="text-red-500/80" />
          <span>{song.likesCount || (Math.floor(Math.random() * 500) + 100)} Likes</span>
        </div>
      </div>
    </motion.div>
  );
});

SongCard.displayName = 'SongCard';

const TrendingSongs = memo(({ songs }) => {
  const { t } = useTranslation();

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black dark:text-white flex items-center gap-3">
            <span className="text-red-500">🔥</span> {t("Trending Now")}
          </h3>
          <p className="text-sm text-gray-500 font-medium">Top tracks making noise in the community</p>
        </div>
        <button className="text-xs font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors">
          View All Charts
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {songs.slice(0, 5).map((s, i) => (
          <SongCard key={s._id} song={s} index={i} />
        ))}
      </div>
    </div>
  );
});

TrendingSongs.displayName = 'TrendingSongs';
export default TrendingSongs;