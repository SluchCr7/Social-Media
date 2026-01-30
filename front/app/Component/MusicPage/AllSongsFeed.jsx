'use client';

import React from 'react';
import SongItem from './SongItem';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMusicalNote, HiAdjustmentsHorizontal } from 'react-icons/hi2';

const AllSongsFeed = ({ filtered, current, setTrack, songs }) => {
  const { t } = useTranslation();

  return (
    <div className="relative rounded-[3.5rem] p-10 bg-white/[0.02] border border-white/[0.05] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* 🎭 Decorative background patterns */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full -mr-[10%] -mt-[10%]" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-purple-600/5 blur-[120px] rounded-full -ml-[5%] -mb-[5%]" />

      {/* Modern Header Section */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
            <HiMusicalNote size={28} className="text-white opacity-40" />
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{t("Sonic Library")}</h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{filtered.length} Frequencies Synchronized</span>
              <span className="w-1 h-1 rounded-full bg-indigo-500" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Verified Assets</span>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.05] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/20 transition-all">
          <HiAdjustmentsHorizontal size={18} />
          <span>Filter Signals</span>
        </button>
      </div>

      {/* Smooth Scrollable Container */}
      <div className="relative space-y-4 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
        {filtered.length > 0 ? (
          filtered.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.02 }}
            >
              <SongItem
                song={s}
                index={i}
                setTrack={setTrack}
                current={current}
                songs={songs}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-24 h-24 rounded-full border border-dashed border-white/10 flex items-center justify-center animate-pulse">
              <HiMusicalNote size={32} className="text-white/10" />
            </div>
            <div className="space-y-2">
              <p className="font-black tracking-[0.3em] uppercase text-xs text-white/20">Empty Spectrum</p>
              <p className="text-white/10 text-[10px] font-bold uppercase tracking-widest">No matching frequencies detected in current sector</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Functional Footer */}
      <div className="mt-12 flex justify-center border-t border-white/5 pt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">End of Synchronized Wavefront</p>
      </div>
    </div>
  );
};

export default AllSongsFeed;