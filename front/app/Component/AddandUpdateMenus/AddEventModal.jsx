'use client';

import React from 'react';
import { HiPlus, HiArrowPath } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AddEventModal = React.memo(({
  newEvent,
  setNewEvent,
  setSelectedDate,
  handleAddEvent,
  selectedDate,
  isCreating
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
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
              {t("Initialize Event")}
            </h3>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
              {selectedDate.format("DD MMMM YYYY")} • Temporal Link
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder={t("Signal Identifier (Title)")}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white placeholder-gray-600 outline-none focus:border-indigo-500/50 transition-all font-medium"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />

            <textarea
              placeholder={t("Data Synopsis (Description)")}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white placeholder-gray-600 outline-none focus:border-indigo-500/50 transition-all resize-none h-32 font-medium"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-indigo-500/50 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              >
                <option value="birthday" className="bg-[#0A0A0A]">🎂 {t("Birthday")}</option>
                <option value="meeting" className="bg-[#0A0A0A]">👥 {t("Meeting")}</option>
                <option value="public" className="bg-[#0A0A0A]">📅 {t("Public")}</option>
                <option value="custom" className="bg-[#0A0A0A]">⭐ {t("Custom")}</option>
              </select>

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl p-4 cursor-pointer hover:bg-white/[0.05] transition-all" onClick={() => setNewEvent({ ...newEvent, repeatYearly: !newEvent.repeatYearly })}>
                <input
                  type="checkbox"
                  checked={newEvent.repeatYearly}
                  onChange={(e) => setNewEvent({ ...newEvent, repeatYearly: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 pointer-events-none"
                />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {t("Annual Sync")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all"
              onClick={() => setSelectedDate(null)}
              disabled={isCreating}
            >
              {t("Abort")}
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isCreating || !newEvent.title}
              onClick={handleAddEvent}
              className="flex-3 py-4 bg-indigo-600 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <HiArrowPath className="w-4 h-4 animate-spin" /> {t("Syncing")}...
                </>
              ) : (
                <>
                  <HiPlus className="w-4 h-4" /> {t("Commit Event")}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

AddEventModal.displayName = 'AddEventModal';
export default AddEventModal;
