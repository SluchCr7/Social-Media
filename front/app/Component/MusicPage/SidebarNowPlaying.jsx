'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiMusicalNote, HiMiniHeart, HiMiniPlay } from 'react-icons/hi2';

const SidebarNowPlaying = memo(({ current }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-[2.5rem] p-6 bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl shadow-2xl relative overflow-hidden group"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        {t("Active Stream")}
      </h3>

      <div className="space-y-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 relative rounded-2xl overflow-hidden bg-[#0D0D0D] border border-white/5 shadow-2xl group/art">
            {current?.cover ? (
              <Image src={current.cover} alt={current.title} fill className="object-cover transition-transform duration-700 group-hover/art:scale-110" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-600/10">
                <HiMusicalNote size={24} className="text-indigo-500/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/art:opacity-100 flex items-center justify-center transition-all duration-300">
              <HiMiniPlay size={20} className="text-white translate-y-2 group-hover/art:translate-y-0 transition-transform" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-white truncate tracking-tight">{current?.title || t('Standby...')}</h4>
            <p className="text-[10px] font-black text-indigo-400 truncate uppercase mt-0.5 tracking-widest">
              {current?.artist || t('Unknown Transmission')}
            </p>
          </div>
        </div>

        {/* Dynamic Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Resonating</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">{current?.listenCount ?? 0}</span>
              <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Heart rate</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">{current?.likes?.length ?? 0}</span>
              <HiMiniHeart size={14} className="text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

SidebarNowPlaying.displayName = 'SidebarNowPlaying';
export default SidebarNowPlaying;