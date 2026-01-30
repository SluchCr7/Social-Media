'use client';

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { HiHeart, HiBookmark, HiShare, HiArrowsPointingOut } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const PlayerHeader = memo(({ current, likeMusic, shareMusicAsPost, saveMusicInPlayList, userData, myPlaylist, setExpanded }) => {
  const { t } = useTranslation();
  const isLiked = current?.likes?.some(user => (user?._id === userData?._id || user === userData?._id));
  const isSaved = myPlaylist?.some(s => s?._id === current?._id);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
      <div className="space-y-1">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-2 drop-shadow-lg">
          {current?.title || t('Silence...')}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-indigo-400 uppercase tracking-widest">{current?.artist || t('Unknown Transmission')}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-sm font-bold text-white/40 uppercase tracking-widest">{current?.album || 'Core Collection'}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => current?._id && likeMusic(current?._id)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${isLiked ? 'bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-red-500 hover:bg-white/[0.05]'}`}
        >
          <HiHeart size={20} fill={isLiked ? "currentColor" : "none"} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => current?._id && saveMusicInPlayList(current?._id)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${isSaved ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-indigo-500 hover:bg-white/[0.05]'}`}
        >
          <HiBookmark size={20} fill={isSaved ? "currentColor" : "none"} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => shareMusicAsPost(current?._id)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/5 text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
        >
          <HiShare size={20} />
        </motion.button>

        <div className="w-px h-8 bg-white/5 mx-1" />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setExpanded(true)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white text-black hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-black/40"
        >
          <HiArrowsPointingOut size={20} />
        </motion.button>
      </div>
    </div>
  );
});

PlayerHeader.displayName = 'PlayerHeader';
export default PlayerHeader;