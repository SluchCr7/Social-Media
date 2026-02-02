'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { HiPlay, HiHeart, HiArrowTrendingUp, HiMusicalNote } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const SongCard = memo(({ song, index, setTrack, songs }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10 }}
      className="group relative flex flex-col gap-5 p-4 rounded-[2.5rem] bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] hover:border-white/[0.1] transition-all duration-700"
    >
      {/* Immersive Artwork Container */}
      <div className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden shadow-2xl">
        <Image
          src={song.cover || "https://images.unsplash.com/photo-1514525253344-991f81ef69c2?q=80&w=1000&auto=format&fit=crop"}
          alt={song.title}
          fill
          className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
        />

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

        {/* Floating Actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTrack(song, index, songs)}
            className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)]"
          >
            <HiPlay size={32} className="ml-1" />
          </motion.button>
        </div>

        {/* Hot Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-full text-[8px] font-black text-white uppercase tracking-[0.2em] border border-white/10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Live Trend
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="px-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-black text-lg text-white tracking-tighter truncate leading-tight group-hover:text-indigo-400 transition-colors">
            {song.title}
          </h4>
          <span className="text-[10px] font-black text-indigo-500/50">0{index + 1}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
              <HiMusicalNote size={8} className="text-white/40" />
            </div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] truncate max-w-[100px]">
              {song.artist}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">
            <HiHeart size={10} className="text-indigo-500" />
            {song.likes?.length || 0}
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-indigo-500/5 blur-[80px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </motion.div>
  );
});

SongCard.displayName = 'SongCard';

const TrendingSongs = memo(({ songs, setTrack }) => {
  if (!songs || songs.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-500">
            <HiArrowTrendingUp size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Viral Waves</span>
          </div>
          <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic">
            Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">Charts</span>
          </h3>
        </div>
        <button className="hidden sm:block text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/5">
          View All Rankings
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
        {songs.map((s, i) => (
          <SongCard key={s._id} song={s} index={i} setTrack={setTrack} songs={songs} />
        ))}
      </div>
    </div>
  );
});

TrendingSongs.displayName = 'TrendingSongs';
export default TrendingSongs;