'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';

const SidebarNowPlaying = memo(({ current }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-3xl p-5 bg-white/5 dark:bg-gray-900/40 border border-white/5 backdrop-blur-xl shadow-xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full -mr-16 -mt-16" />

      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        {t("Now Playing")}
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg border border-white/10 group">
          {current?.cover ? (
            <Image src={current.cover} alt={current.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10 font-black">?</div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <FaPlay size={10} className="text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate dark:text-white">{current?.title || '—'}</div>
          <div className="text-[10px] font-bold text-indigo-500 truncate">{current?.artist || 'Unknown Visionary'}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="text-white/20">{t("Plays")}:</span>
          <span className="text-indigo-500">{current?.listenCount ?? 0}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white/20">{t("Likes")}:</span>
          <span className="text-red-500">{current?.likes?.length ?? 0}</span>
        </div>
      </div>
    </motion.div>
  );
});

SidebarNowPlaying.displayName = 'SidebarNowPlaying';
export default SidebarNowPlaying;