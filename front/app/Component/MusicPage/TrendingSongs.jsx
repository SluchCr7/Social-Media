'use client';

import Image from 'next/image';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HiPlay, HiHeart, HiArrowTrendingUp } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const SongCard = memo(({ song, index, setTrack, songs }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col gap-4 p-5 rounded-[2.5rem] bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition-all duration-500 shadow-2xl"
    >
      {/* Immersive Artwork Container */}
      <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-5px_rgba(0,0,0,0.5)]">
        <Image
          src={song.cover}
          alt={song.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTrack(song, index, songs)}
            className="w-16 h-16 rounded-3xl bg-white text-black flex items-center justify-center shadow-2xl"
          >
            <HiPlay size={28} className="ml-1" />
          </motion.button>
        </div>

        {/* Hot Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-indigo-600/80 backdrop-blur-xl px-3 py-1.5 rounded-xl text-[8px] font-black text-white uppercase tracking-[0.2em] border border-white/10 flex items-center gap-2">
            <HiArrowTrendingUp size={12} />
            Hot Signal
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="px-2 space-y-1">
        <h4 className="font-bold text-base text-white tracking-tight truncate transition-colors group-hover:text-indigo-400">
          {song.title}
        </h4>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest truncate">
            {song.artist}
          </p>
          <div className="flex items-center gap-1.5 text-[9px] font-black text-white/20 uppercase tracking-widest">
            <HiHeart className="text-red-500" />
            {song.likesCount || 0}
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500/0 via-purple-500/0 to-pink-500/0 rounded-[2.5rem] -z-10 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-700" />
    </motion.div>
  );
});

SongCard.displayName = 'SongCard';

const TrendingSongs = memo(({ songs, setTrack }) => {
  const { t } = useTranslation();

  // Get top 5 by likes or just slice
  const topTracks = useMemo(() => {
    return [...songs].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0)).slice(0, 5);
  }, [songs]);

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between px-2">
        <div className="space-y-1">
          <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
            Digital <span className="text-indigo-500">Charts</span>
          </h3>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Top 5 Broadcasts by Resonance</p>
        </div>
        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-colors border-b-2 border-indigo-500 pb-1">
          Global Rankings
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {topTracks.map((s, i) => (
          <SongCard key={s._id} song={s} index={i} setTrack={setTrack} songs={songs} />
        ))}
      </div>
    </div>
  );
});

TrendingSongs.displayName = 'TrendingSongs';
export default TrendingSongs;