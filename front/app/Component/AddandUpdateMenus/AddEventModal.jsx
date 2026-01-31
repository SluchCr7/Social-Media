'use client';

import React, { useState } from 'react';
import { HiPlus, HiArrowPath, HiXMark, HiClock, HiMapPin, HiVideoCamera, HiBell, HiTag } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/Context/AuthContext';

const AddEventModal = React.memo(({
  newEvent,
  setNewEvent,
  setSelectedDate,
  handleAddEvent,
  selectedDate,
  isCreating
}) => {
  const { t } = useTranslation();
  const { users } = useAuth();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !newEvent.tags?.includes(tagInput.trim())) {
      setNewEvent({
        ...newEvent,
        tags: [...(newEvent.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setNewEvent({
      ...newEvent,
      tags: newEvent.tags.filter(t => t !== tag)
    });
  };

  const handleAddReminder = (minutes) => {
    const reminders = newEvent.reminders || [];
    if (!reminders.some(r => r.time === minutes)) {
      setNewEvent({
        ...newEvent,
        reminders: [...reminders, { time: minutes }]
      });
    }
  };

  const handleRemoveReminder = (minutes) => {
    setNewEvent({
      ...newEvent,
      reminders: newEvent.reminders.filter(r => r.time !== minutes)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[1000] p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              {t("Create Event")}
            </h3>
            {selectedDate && (
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mt-1">
                {selectedDate.format("DD MMMM YYYY")}
              </div>
            )}
          </div>
          <button
            onClick={() => setSelectedDate(null)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* Title */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
              {t("Title")} *
            </label>
            <input
              type="text"
              placeholder={t("Event title")}
              className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-indigo-500 transition-all font-medium"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
              {t("Description")}
            </label>
            <textarea
              placeholder={t("Event description")}
              className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-indigo-500 transition-all resize-none h-24 font-medium"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <HiClock className="w-3 h-3" />
                {t("Start Time")}
              </label>
              <input
                type="time"
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition-all"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <HiClock className="w-3 h-3" />
                {t("End Time")}
              </label>
              <input
                type="time"
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition-all"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              />
            </div>
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                {t("Type")}
              </label>
              <select
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition-all font-medium"
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              >
                <option value="birthday">🎂 {t("Birthday")}</option>
                <option value="meeting">👥 {t("Meeting")}</option>
                <option value="public">📅 {t("Public")}</option>
                <option value="custom">⭐ {t("Custom")}</option>
                <option value="reminder">🔔 {t("Reminder")}</option>
                <option value="deadline">🚩 {t("Deadline")}</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                {t("Priority")}
              </label>
              <select
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition-all font-medium"
                value={newEvent.priority}
                onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}
              >
                <option value="low">{t("Low")}</option>
                <option value="medium">{t("Medium")}</option>
                <option value="high">{t("High")}</option>
                <option value="urgent">{t("Urgent")}</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
              <HiMapPin className="w-3 h-3" />
              {t("Location")}
            </label>
            <input
              type="text"
              placeholder={t("Event location")}
              className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-indigo-500 transition-all font-medium"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />
          </div>

          {/* Virtual Meeting */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-all"
            onClick={() => setNewEvent({ ...newEvent, isVirtual: !newEvent.isVirtual })}
          >
            <input
              type="checkbox"
              checked={newEvent.isVirtual}
              onChange={(e) => setNewEvent({ ...newEvent, isVirtual: e.target.checked })}
              className="w-4 h-4 accent-indigo-500 pointer-events-none"
            />
            <HiVideoCamera className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("Virtual Meeting")}
            </span>
          </div>

          {newEvent.isVirtual && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                type="url"
                placeholder={t("Meeting link (e.g., Zoom, Teams)")}
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-indigo-500 transition-all font-medium"
                value={newEvent.meetingLink}
                onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
              />
            </motion.div>
          )}

          {/* Recurrence */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-all"
              onClick={() => setNewEvent({ ...newEvent, repeatYearly: !newEvent.repeatYearly })}
            >
              <input
                type="checkbox"
                checked={newEvent.repeatYearly}
                onChange={(e) => setNewEvent({ ...newEvent, repeatYearly: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 pointer-events-none"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Repeat Yearly")}
              </span>
            </div>

            <div>
              <select
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition-all font-medium"
                value={newEvent.repeatPattern}
                onChange={(e) => setNewEvent({ ...newEvent, repeatPattern: e.target.value })}
              >
                <option value="none">{t("No Repeat")}</option>
                <option value="daily">{t("Daily")}</option>
                <option value="weekly">{t("Weekly")}</option>
                <option value="monthly">{t("Monthly")}</option>
                <option value="yearly">{t("Yearly")}</option>
              </select>
            </div>
          </div>

          {/* Reminders */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
              <HiBell className="w-3 h-3" />
              {t("Reminders")}
            </label>
            <div className="flex flex-wrap gap-2">
              {[5, 15, 30, 60, 1440].map(minutes => (
                <button
                  key={minutes}
                  onClick={() => {
                    if (newEvent.reminders?.some(r => r.time === minutes)) {
                      handleRemoveReminder(minutes);
                    } else {
                      handleAddReminder(minutes);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${newEvent.reminders?.some(r => r.time === minutes)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                >
                  {minutes < 60 ? `${minutes}m` : minutes === 60 ? '1h' : '1d'}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
              <HiTag className="w-3 h-3" />
              {t("Tags")}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder={t("Add tag")}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-indigo-500 transition-all"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-bold text-xs hover:bg-indigo-600 transition-all"
              >
                {t("Add")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newEvent.tags?.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold flex items-center gap-2"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                    <HiXMark className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
              {t("Color")}
            </label>
            <div className="flex gap-2">
              {['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'].map(color => (
                <button
                  key={color}
                  onClick={() => setNewEvent({ ...newEvent, color })}
                  className={`w-10 h-10 rounded-xl transition-all ${newEvent.color === color ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-gray-400' : ''
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
          <button
            className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
            onClick={() => setSelectedDate(null)}
            disabled={isCreating}
          >
            {t("Cancel")}
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isCreating || !newEvent.title}
            onClick={handleAddEvent}
            className="flex-[2] py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center gap-2 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <HiArrowPath className="w-4 h-4 animate-spin" /> {t("Creating")}...
              </>
            ) : (
              <>
                <HiPlus className="w-4 h-4" /> {t("Create Event")}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
});

AddEventModal.displayName = 'AddEventModal';
export default AddEventModal;
