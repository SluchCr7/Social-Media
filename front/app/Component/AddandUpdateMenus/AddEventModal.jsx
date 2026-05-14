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
  RotateCw,
  Calendar as CalendarIcon,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    {Icon && <Icon size={16} className="text-gray-400" />}
    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{title}</h3>
  </div>
);

const AddEventModal = React.memo(({
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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-full max-w-2xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">{t("Create Event")}</h2>
            <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs">
              <CalendarIcon size={12} />
              <span>{selectedDate.format("MMMM DD, YYYY")}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedDate(null)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
          
          {/* Title & Description */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">{t("Event Title")}</label>
              <input
                type="text"
                placeholder={t("What's the occasion?")}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-2xl p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all outline-none"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">{t("Description")}</label>
              <textarea
                placeholder={t("Add some details...")}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-2xl p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 h-28 resize-none transition-all outline-none"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
          </div>

          {/* Time & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
               <SectionHeader icon={Clock} title={t("Schedule")} />
               <div className="flex items-center gap-3">
                 <input
                   type="time"
                   className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                   value={newEvent.startTime}
                   onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                 />
                 <span className="text-gray-400">→</span>
                 <input
                   type="time"
                   className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                   value={newEvent.endTime}
                   onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                 />
               </div>
             </div>

             <div className="space-y-4">
               <SectionHeader icon={MapPin} title={t("Location")} />
               <input
                 type="text"
                 placeholder={t("Where's it happening?")}
                 className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all outline-none"
                 value={newEvent.location}
                 onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
               />
             </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{t("Category & Priority")}</h3>
              <div className="flex gap-3">
                <select
                  className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                >
                  <option value="birthday">🎂 {t("Birthday")}</option>
                  <option value="meeting">👥 {t("Meeting")}</option>
                  <option value="public">📅 {t("Public")}</option>
                  <option value="reminder">🔔 {t("Reminder")}</option>
                </select>
                <select
                  className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  value={newEvent.priority}
                  onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}
                >
                  <option value="low">{t("Low")}</option>
                  <option value="medium">{t("Medium")}</option>
                  <option value="high">{t("High")}</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{t("Meeting Options")}</h3>
              <div 
                onClick={() => setNewEvent({ ...newEvent, isVirtual: !newEvent.isVirtual })}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${newEvent.isVirtual ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-threads-border'}`}
              >
                <div className="flex items-center gap-3">
                  <Video size={16} className={newEvent.isVirtual ? 'text-indigo-500' : 'text-gray-400'} />
                  <span className="text-sm font-medium">{t("Virtual Meeting")}</span>
                </div>
                <div className={`w-10 h-5 rounded-full p-1 transition-all ${newEvent.isVirtual ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-white/10'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-all ${newEvent.isVirtual ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Reminders & Tags */}
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <SectionHeader icon={Bell} title={t("Reminders")} />
              <div className="flex flex-wrap gap-2">
                {[5, 15, 30, 60].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => {
                      if (newEvent.reminders?.some(r => r.time === minutes)) {
                        handleRemoveReminder(minutes);
                      } else {
                        handleAddReminder(minutes);
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${newEvent.reminders?.some(r => r.time === minutes)
                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                        : 'bg-transparent text-gray-400 border-gray-100 dark:border-white/5 hover:border-gray-300'
                      }`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeader icon={Tag} title={t("Tags")} />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("Add tag...")}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all outline-none"
                />
                <Button size="sm" onClick={handleAddTag} className="rounded-xl px-6">{t("Add")}</Button>
              </div>
              {newEvent.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newEvent.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-xs font-semibold flex items-center gap-2">
                      {tag}
                      <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveTag(tag)} />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex gap-4">
          <button
            className="px-8 py-3 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white font-semibold text-sm transition-colors"
            onClick={() => setSelectedDate(null)}
            disabled={isCreating}
          >
            {t("Cancel")}
          </button>
          <Button
            className="flex-1 rounded-full py-4 text-sm font-bold tracking-tight"
            isLoading={isCreating}
            disabled={!newEvent.title}
            onClick={handleAddEvent}
          >
            <Plus size={18} className="mr-2" />
            {t("Create Event")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
});

AddEventModal.displayName = 'AddEventModal';
export default AddEventModal;
