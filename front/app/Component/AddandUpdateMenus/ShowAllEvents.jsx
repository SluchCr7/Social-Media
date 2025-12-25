'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { HiSignal, HiXMark } from 'react-icons/hi2';

const ShowAllEvents = ({ setSelectedEvent, showDayEvents, setShowDayEvents, typeColors, typeIcons }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[1000] p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-10 w-full max-w-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

        <div className="flex items-center justify-between mb-10 shrink-0">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
              {t("Temporal Matrix")}
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
              <HiSignal className="w-3 h-3 animate-pulse" />
              {showDayEvents?.length} {t("Signals Detected")}
            </div>
          </div>
          <button
            onClick={() => setShowDayEvents(null)}
            className="w-12 h-12 rounded-[1.25rem] bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all group"
          >
            <HiXMark className="w-6 h-6 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {showDayEvents.map((ev, i) => (
            <motion.div
              key={ev._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`group p-6 rounded-[2rem] border border-transparent hover:border-white/10 bg-white/[0.03] transition-all cursor-pointer relative overflow-hidden`}
              onClick={() => {
                setSelectedEvent(ev);
                setShowDayEvents(null);
              }}
            >
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${typeColors?.[ev.type] || 'bg-indigo-500/20'}`}>
                  {typeIcons?.[ev.type] || '✨'}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                      {ev.title}
                    </h4>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {dayjs(ev.date).format("HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                    {ev.description || t("No supplementary data available.")}
                  </p>
                </div>
              </div>

              {ev.repeatYearly && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/10 border-b border-l border-amber-500/20 rounded-bl-xl text-[8px] font-black text-amber-500 uppercase tracking-widest">
                  Annual Resonance
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 shrink-0">
          <button
            className="w-full py-4 rounded-2xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all border border-transparent hover:border-white/10"
            onClick={() => setShowDayEvents(null)}
          >
            {t("Terminate Session")}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(ShowAllEvents);