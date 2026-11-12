'use client';

import React from 'react';
import { HiPencilSquare, HiTrash, HiXMark } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { getEventDay } from '@/app/utils/eventDate';
import { useTranslation } from 'react-i18next';

const EventDetailsModal = ({
  handleUpdateEvent,
  handleDeleteEvent,
  selectedEvent,
  setSelectedEvent,
  isMutating
}) => {
  const { t } = useTranslation();

  if (!selectedEvent) return null;
  const displayedDate = selectedEvent.occurrenceDate || selectedEvent.date;
  const repeatPattern =
    selectedEvent.repeatPattern && selectedEvent.repeatPattern !== 'none'
      ? selectedEvent.repeatPattern
      : selectedEvent.repeatYearly
        ? 'yearly'
        : 'none';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white dark:bg-[#0B0F1A] border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t("Event Details")}
            </h3>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {getEventDay(displayedDate).format("MMMM DD, YYYY")}
            </p>
          </div>
          <button
            onClick={() => setSelectedEvent(null)}
            disabled={isMutating}
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
              disabled={isMutating}
              className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none transition-all"
              value={selectedEvent.title || ''}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Description")}</label>
            <textarea
              disabled={isMutating}
              className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none transition-all resize-none h-24"
              value={selectedEvent.description || ''}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Date")}</label>
              <input
                type="date"
                disabled={isMutating}
                min={getEventDay(selectedEvent.originalDate || selectedEvent.date).format('YYYY-MM-DD')}
                value={getEventDay(selectedEvent.date).format('YYYY-MM-DD')}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-medium outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Category")}</label>
              <select
                disabled={isMutating}
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

          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Start time")}</label>
              <input
                type="time"
                disabled={isMutating}
                value={selectedEvent.startTime || '09:00'}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, startTime: e.target.value })}
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-medium outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("End time")}</label>
              <input
                type="time"
                disabled={isMutating}
                value={selectedEvent.endTime || '10:00'}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, endTime: e.target.value })}
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Location")}</label>
            <input
              type="text"
              disabled={isMutating}
              value={selectedEvent.location || ''}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
              className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                disabled={isMutating}
                checked={Boolean(selectedEvent.isVirtual)}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, isVirtual: e.target.checked })}
                className="accent-indigo-600"
              />
              {t("Virtual meeting")}
            </label>
            {selectedEvent.isVirtual && (
              <input
                type="url"
                disabled={isMutating}
                placeholder={t("Meeting link")}
                value={selectedEvent.meetingLink || ''}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, meetingLink: e.target.value })}
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none transition-all"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Priority")}</label>
              <select
                disabled={isMutating}
                value={selectedEvent.priority || 'medium'}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, priority: e.target.value })}
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-semibold outline-none transition-all cursor-pointer"
              >
                {['low', 'medium', 'high', 'urgent'].map((priority) => (
                  <option key={priority} value={priority}>{t(priority)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Status")}</label>
              <select
                disabled={isMutating}
                value={selectedEvent.status || 'scheduled'}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, status: e.target.value })}
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-semibold outline-none transition-all cursor-pointer"
              >
                {['scheduled', 'ongoing', 'completed', 'cancelled'].map((status) => (
                  <option key={status} value={status}>{t(status)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Repeat")}</label>
              <select
                disabled={isMutating}
                value={repeatPattern}
                onChange={(e) => setSelectedEvent({
                  ...selectedEvent,
                  repeatPattern: e.target.value,
                  repeatYearly: e.target.value === 'yearly',
                  repeatUntil: e.target.value === 'none' ? null : selectedEvent.repeatUntil,
                })}
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-semibold outline-none transition-all cursor-pointer"
              >
                {['none', 'daily', 'weekly', 'monthly', 'yearly'].map((pattern) => (
                  <option key={pattern} value={pattern}>{t(pattern)}</option>
                ))}
              </select>
            </div>
            {repeatPattern !== 'none' && (
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Repeat until")}</label>
                <input
                  type="date"
                  disabled={isMutating}
                  min={getEventDay(selectedEvent.originalDate || selectedEvent.date).format('YYYY-MM-DD')}
                  value={selectedEvent.repeatUntil ? getEventDay(selectedEvent.repeatUntil).format('YYYY-MM-DD') : ''}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, repeatUntil: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-medium outline-none transition-all"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-slate-200/80 dark:border-white/10">
          <button
            className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
            onClick={handleDeleteEvent}
            disabled={isMutating}
            title={t("Delete Event")}
          >
            <HiTrash className="w-5 h-5" />
          </button>

          <button
            onClick={handleUpdateEvent}
            disabled={isMutating || !selectedEvent.title?.trim() || !selectedEvent.date}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-xs transition-all shadow-sm"
          >
            <HiPencilSquare className="w-4 h-4" />
            <span>{isMutating ? t("Saving...") : t("Save Changes")}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetailsModal;
