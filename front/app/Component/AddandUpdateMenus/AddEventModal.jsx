'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Clock, 
  MapPin, 
  Video, 
  Bell, 
  Tag, 
  Calendar as CalendarIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-3">
    {Icon && <Icon size={14} className="text-slate-400" />}
    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{title}</h3>
  </div>
);

const AddEventModal = ({
  newEvent,
  setNewEvent,
  setSelectedDate,
  handleAddEvent,
  selectedDate,
  isCreating
}) => {
  const { t } = useTranslation();
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

  if (!selectedDate) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-xl bg-white dark:bg-[#0B0F1A] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CalendarIcon size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{t("Create New Event")}</h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {selectedDate.format("MMMM DD, YYYY")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedDate(null)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Event Title")}</label>
              <input
                type="text"
                placeholder={t("What's the event name?")}
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none transition-all"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Description")}</label>
              <textarea
                placeholder={t("Add event details or notes...")}
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium h-24 resize-none outline-none transition-all"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
          </div>

          {/* Time & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <SectionHeader icon={Clock} title={t("Time Range")} />
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  className="flex-1 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-medium outline-none transition-all"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
                <span className="text-slate-400 text-xs">→</span>
                <input
                  type="time"
                  className="flex-1 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-medium outline-none transition-all"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <SectionHeader icon={MapPin} title={t("Location")} />
              <input
                type="text"
                placeholder={t("Add location...")}
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-medium outline-none transition-all"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>
          </div>

          {/* Category & Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Type & Priority")}</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-semibold outline-none transition-all cursor-pointer"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                >
                  <option value="birthday">{t("Birthday")}</option>
                  <option value="meeting">{t("Meeting")}</option>
                  <option value="public">{t("Public")}</option>
                  <option value="custom">{t("Custom")}</option>
                  <option value="reminder">{t("Reminder")}</option>
                  <option value="deadline">{t("Deadline")}</option>
                </select>

                <select
                  className="flex-1 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-2.5 text-xs font-semibold outline-none transition-all cursor-pointer"
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

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Meeting Settings")}</label>
              <div 
                onClick={() => setNewEvent({ ...newEvent, isVirtual: !newEvent.isVirtual })}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  newEvent.isVirtual 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30' 
                    : 'bg-slate-100 dark:bg-white/5 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Video size={15} className={newEvent.isVirtual ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
                  <span className="text-xs font-semibold">{t("Virtual Meeting Link")}</span>
                </div>
                <div className={`w-8 h-4.5 rounded-full p-0.5 transition-all ${newEvent.isVirtual ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-white/20'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${newEvent.isVirtual ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Reminders & Tags */}
          <div className="space-y-4">
            <div>
              <SectionHeader icon={Bell} title={t("Reminders")} />
              <div className="flex flex-wrap gap-1.5">
                {[5, 15, 30, 60].map(minutes => {
                  const active = newEvent.reminders?.some(r => r.time === minutes);
                  return (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => active ? handleRemoveReminder(minutes) : handleAddReminder(minutes)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-300'
                      }`}
                    >
                      {minutes}m
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <SectionHeader icon={Tag} title={t("Tags")} />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("Add tag...")}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl px-3 py-2 text-xs font-medium outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
                >
                  {t("Add")}
                </button>
              </div>
              {newEvent.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {newEvent.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-white/10 rounded-lg text-xs font-medium flex items-center gap-1.5">
                      <span>#{tag}</span>
                      <X size={12} className="cursor-pointer hover:text-rose-500" onClick={() => handleRemoveTag(tag)} />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-200/80 dark:border-white/10 flex items-center justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            onClick={() => setSelectedDate(null)}
            disabled={isCreating}
          >
            {t("Cancel")}
          </button>
          <Button
            className="rounded-xl px-5 py-2 text-xs font-bold"
            isLoading={isCreating}
            disabled={!newEvent.title}
            onClick={handleAddEvent}
          >
            <Plus size={15} className="mr-1.5" />
            {t("Save Event")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddEventModal;
