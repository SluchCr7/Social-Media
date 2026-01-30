'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { formatTime } from '@/app/utils/formatTime';
import { useTranslation } from 'react-i18next';
import { HiHeart, HiFolderOpen } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarPlaylist = memo(({ myPlaylist, setTrack }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[2.5rem] p-6 bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <HiHeart className="text-red-500" size={18} />
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t("Personal Core")}</h4>
        </div>
        <div className="text-[10px] font-black text-indigo-500/60 uppercase tracking-widest">{myPlaylist?.length || 0} Saved</div>
      </div>

      {myPlaylist?.length ? (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
          <AnimatePresence>
            {myPlaylist.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setTrack(s, i, myPlaylist)}
                className="group flex items-center gap-4 p-2.5 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-[#0D0D0D] border border-white/5 shrink-0 shadow-lg">
                  <Image src={s.cover} alt={s.title} fill className="object-cover transition-transform group-hover:scale-110" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-white truncate tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{s.title}</h5>
                  <p className="text-[9px] font-black text-white/20 truncate uppercase tracking-widest">{s.artist}</p>
                </div>
                <div className="text-[9px] font-mono font-bold text-white/10 group-hover:text-white/30 transition-colors">
                  {formatTime(s.duration)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
          <HiFolderOpen size={40} />
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest">Library Uninitialized</p>
            <p className="text-[8px] font-bold uppercase tracking-wider text-white/40">Capture resonances to build your core.</p>
          </div>
        </div>
      )}

      {myPlaylist?.length > 0 && (
        <div className="mt-8">
          <button className="w-full py-3 rounded-2xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all">
            Broadcast Library
          </button>
        </div>
      )}
    </div>
  );
});

SidebarPlaylist.displayName = 'SidebarPlaylist';
export default SidebarPlaylist;