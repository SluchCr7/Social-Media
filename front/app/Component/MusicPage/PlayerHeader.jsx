'use client';

import { React, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Bookmark, Share2, Maximize2 } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 w-full">
      {/* Title + Artist */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-white truncate">
          {current?.title || t('Silence...')}
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-indigo-300 truncate">{current?.artist || t('Unknown Artist')}</span>
          <span className="h-1 w-1 rounded-full bg-white/20 shrink-0" />
          <span className="text-sm text-zinc-500 truncate">{current?.album || 'Single'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Like */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => current?._id && likeMusic(current?._id)}
          aria-label={isLiked ? t('Unlike track') : t('Like track')}
          title={isLiked ? t('Unlike') : t('Like')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
            isLiked
              ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_16px_rgba(239,68,68,0.35)]'
              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-rose-500/50 hover:text-rose-400 hover:bg-zinc-700'
          }`}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={2} />
        </motion.button>

        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => current?._id && saveMusicInPlayList(current?._id)}
          aria-label={isSaved ? t('Remove from saved tracks') : t('Save track')}
          title={isSaved ? t('Saved') : t('Save')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
            isSaved
              ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_16px_rgba(99,102,241,0.35)]'
              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-zinc-700'
          }`}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} strokeWidth={2} />
        </motion.button>

        {/* Share */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => current?._id && shareMusicAsPost(current._id)}
          aria-label={t('Share track')}
          title={t('Share')}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all border bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-700"
        >
          <Share2 size={18} strokeWidth={2} />
        </motion.button>

        <div className="w-px h-6 bg-white/10 mx-0.5 hidden sm:block" />

        {/* Expand */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setExpanded(true)}
          aria-label={t('Open expanded player')}
          title={t('Fullscreen')}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-zinc-900 hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-black/30"
        >
          <Maximize2 size={16} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
});

PlayerHeader.displayName = 'PlayerHeader';
export default PlayerHeader;
