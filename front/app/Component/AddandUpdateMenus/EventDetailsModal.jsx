'use client';

import React from 'react';
import { HiPencilSquare, HiTrash, HiXMark } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';

const EventDetailsModal = React.memo(({
  handleUpdateEvent,
  handleDeleteEvent,
  selectedEvent,
  setSelectedEvent
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[1000] p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-10 w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
              {t("Event Protocol")}
            </h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-500 transition-all"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">
              Temporal Index: {dayjs(selectedEvent.date).format("DD MMM YYYY")}
            </div>

            <input
              type="text"
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white placeholder-gray-600 outline-none focus:border-indigo-500/50 transition-all font-medium"
              value={selectedEvent.title}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
            />

            <textarea
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white placeholder-gray-600 outline-none focus:border-indigo-500/50 transition-all resize-none h-32 font-medium"
              rows={3}
              value={selectedEvent.description}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-indigo-500/50 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                value={selectedEvent.type}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, type: e.target.value })}
              >
                <option value="birthday" className="bg-[#0A0A0A]">🎂 {t("Birthday")}</option>
                <option value="meeting" className="bg-[#0A0A0A]">👥 {t("Meeting")}</option>
                <option value="public" className="bg-[#0A0A0A]">📅 {t("Public")}</option>
                <option value="custom" className="bg-[#0A0A0A]">⭐ {t("Custom")}</option>
              </select>

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl p-4 cursor-pointer" onClick={() => setSelectedEvent({ ...selectedEvent, repeatYearly: !selectedEvent.repeatYearly })}>
                <input
                  type="checkbox"
                  checked={selectedEvent.repeatYearly || false}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, repeatYearly: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 pointer-events-none"
                />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {t("Annual Sync")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button
              className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all group"
              onClick={handleDeleteEvent}
              title={t("Delete Signal")}
            >
              <HiTrash className="w-5 h-5" />
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateEvent}
              className="flex-1 py-4 bg-indigo-600 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20"
            >
              <HiPencilSquare className="w-4 h-4" />
              {t("Update Core")}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

EventDetailsModal.displayName = 'EventDetailsModal';
export default EventDetailsModal;
