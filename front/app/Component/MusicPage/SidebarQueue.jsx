'use client';

import React, { memo } from 'react'
import { formatTime } from '@/app/utils/formatTime'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { HiQueueList } from 'react-icons/hi2'
import { motion, AnimatePresence } from 'framer-motion'

const SidebarQueue = memo(({ queue, setTrack }) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-[2.5rem] p-6 bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HiQueueList className="text-indigo-500" size={18} />
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t("Frequency Queue")}</h4>
        </div>
        <div className="text-[10px] font-black text-indigo-500/60 uppercase tracking-widest bg-indigo-500/5 px-2 py-1 rounded-lg border border-indigo-500/10">
          {queue.length} Signals
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
        <AnimatePresence>
          {queue.length > 0 ? (
            queue.map((q, idx) => (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex items-center gap-4 cursor-pointer hover:bg-white/[0.03] p-2.5 rounded-2xl border border-transparent hover:border-white/5 transition-all"
                onClick={() => setTrack(q, idx, queue)}
              >
                <div className="w-10 h-10 relative rounded-xl overflow-hidden bg-[#0D0D0D] border border-white/5 shrink-0">
                  <Image src={q.cover} alt={q.title} fill className="object-cover transition-transform group-hover:scale-110" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-white truncate tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{q.title}</h5>
                  <p className="text-[9px] font-black text-white/20 truncate uppercase tracking-widest">{q.artist}</p>
                </div>
                <div className="text-[9px] font-mono font-bold text-white/10 group-hover:text-white/30 transition-colors">
                  {formatTime(q.duration)}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-10 text-center space-y-3 opacity-20">
              <HiQueueList size={32} className="mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-widest">Spectral Void</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <button className="w-full py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all border border-white/5">
          Clear Timeline
        </button>
      </div>
    </div>
  )
})

SidebarQueue.displayName = 'SidebarQueue'
export default SidebarQueue;