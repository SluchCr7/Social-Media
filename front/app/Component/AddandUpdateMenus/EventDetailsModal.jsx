'use client';

import React from 'react';
import { HiPencilSquare, HiTrash, HiXMark } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';

const EventDetailsModal = ({
  handleUpdateEvent,
  handleDeleteEvent,
  selectedEvent,
  setSelectedEvent
}) => {
  const { t } = useTranslation();

  if (!selectedEvent) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white dark:bg-[#0B0F1A] border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t("Event Details")}
            </h3>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {dayjs(selectedEvent.date).format("MMMM DD, YYYY")}
            </p>
          </div>
          <button
            onClick={() => setSelectedEvent(null)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Title")}</label>
            <input
              type="text"
              className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none transition-all"
              value={selectedEvent.title || ''}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Description")}</label>
            <textarea
              className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none transition-all resize-none h-24"
              value={selectedEvent.description || ''}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Category")}</label>
              <select
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-semibold outline-none transition-all cursor-pointer"
                value={selectedEvent.type || 'custom'}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, type: e.target.value })}
              >
                <option value="birthday">{t("Birthday")}</option>
                <option value="meeting">{t("Meeting")}</option>
                <option value="public">{t("Public")}</option>
                <option value="custom">{t("Custom")}</option>
                <option value="reminder">{t("Reminder")}</option>
                <option value="deadline">{t("Deadline")}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Recurrence")}</label>
              <div 
                className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 rounded-xl p-2.5 cursor-pointer" 
                onClick={() => setSelectedEvent({ ...selectedEvent, repeatYearly: !selectedEvent.repeatYearly })}
              >
                <input
                  type="checkbox"
                  checked={selectedEvent.repeatYearly || false}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, repeatYearly: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 pointer-events-none"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("Repeat Yearly")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-slate-200/80 dark:border-white/10">
          <button
            className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
            onClick={handleDeleteEvent}
            title={t("Delete Event")}
          >
            <HiTrash className="w-5 h-5" />
          </button>

          <button
            onClick={handleUpdateEvent}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-xs transition-all shadow-sm"
          >
            <HiPencilSquare className="w-4 h-4" />
            <span>{t("Save Changes")}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetailsModal;
