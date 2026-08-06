'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { HiXMark } from 'react-icons/hi2';

const ShowAllEvents = ({ setSelectedEvent, showDayEvents, setShowDayEvents, typeColors, typeIcons }) => {
  const { t } = useTranslation();

  if (!Array.isArray(showDayEvents) || showDayEvents.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white dark:bg-[#0B0F1A] border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 sm:p-6 w-full max-w-lg shadow-xl relative flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t("Events for")} {dayjs(showDayEvents[0]?.date).format("MMMM DD, YYYY")}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {showDayEvents.length} {showDayEvents.length === 1 ? t("event scheduled") : t("events scheduled")}
            </p>
          </div>
          <button
            onClick={() => setShowDayEvents(null)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {showDayEvents.map((ev, i) => (
            <motion.div
              key={ev._id || i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-3.5 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100/80 dark:hover:bg-white/5 transition-all cursor-pointer flex items-start gap-3"
              onClick={() => {
                setSelectedEvent(ev);
                setShowDayEvents(null);
              }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${typeColors?.[ev.type] || 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600'}`}>
                {typeIcons?.[ev.type] || '📅'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {ev.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                    {ev.startTime || dayjs(ev.date).format("HH:mm")}
                  </span>
                </div>
                {ev.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 font-medium">
                    {ev.description}
                  </p>
                )}
                {ev.repeatYearly && (
                  <span className="inline-block mt-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
                    {t("Repeats Yearly")}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 shrink-0 flex justify-end">
          <button
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            onClick={() => setShowDayEvents(null)}
          >
            {t("Close")}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShowAllEvents;