'use client';

import {React, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { HiHeart, HiBookmark, HiShare, HiArrowsPointingOut } from 'react-icons/hi2';
import { motion } from 'framer-motion';
const PlayerHeader = memo(({ current, likeMusic, shareMusicAsPost, saveMusicInPlayList, userData, myPlaylist, setExpanded }) => {
  const { t } = useTranslation();
  const isLiked = current?.likes?.some((likedUser) =>
    (likedUser?._id || likedUser)?.toString() === userData?._id?.toString()
  );
  const isSaved = myPlaylist?.some((song) =>
    (song?._id || song)?.toString() === current?._id?.toString()
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
      <div className="space-y-1">
        <h2 className="mb-2 max-w-2xl break-words text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          {current?.title || t('Silence...')}
        </h2>
        <div className="flex items-center gap-3">
          <span className="truncate text-sm font-medium text-indigo-200">{current?.artist || t('Unknown Artist')}</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span className="truncate text-sm text-zinc-400">{current?.album || 'Single'}</span>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-3">
        {/* زر الإعجاب */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => current?._id && likeMusic(current?._id)}
          aria-label={isLiked ? t('Unlike track') : t('Like track')}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
            isLiked 
              ? 'bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
              : 'bg-zinc-800/80 border-zinc-700/65 text-white hover:text-red-400 hover:bg-zinc-700 shadow-md'
          }`}
        >
          <HiHeart size={20} fill={isLiked ? "currentColor" : "none"} />
        </motion.button>

        {/* زر الحفظ */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => current?._id && saveMusicInPlayList(current?._id)}
          aria-label={isSaved ? t('Remove from saved tracks') : t('Save track')}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
            isSaved 
              ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
              : 'bg-zinc-800/80 border-zinc-700/65 text-white hover:text-indigo-400 hover:bg-zinc-700 shadow-md'
          }`}
        >
          <HiBookmark size={20} fill={isSaved ? "currentColor" : "none"} />
        </motion.button>

        {/* زر المشاركة */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => current?._id && shareMusicAsPost(current._id)}
          aria-label={t('Share track')}
          className="w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-800/80 border border-zinc-700/65 text-white hover:bg-zinc-700 transition-all shadow-md"
        >
          <HiShare size={20} />
        </motion.button>

        <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block" />

        {/* زر التكبير */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setExpanded(true)}
          aria-label={t('Open expanded player')}
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