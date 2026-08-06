'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  HiChevronLeft,
  HiChevronRight,
  HiPlus,
  HiCake,
  HiUsers,
  HiBell,
  HiFlag,
  HiArrowDownTray,
  HiFunnel,
  HiMagnifyingGlass,
  HiVideoCamera,
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { useDebounce } from '@/app/hooks/useDebounce';

// Use Next.js dynamic imports with ssr: false
const AddEventModal = dynamic(() => import('@/app/Component/AddandUpdateMenus/AddEventModal'), { ssr: false });
const EventDetailsModal = dynamic(() => import('@/app/Component/AddandUpdateMenus/EventDetailsModal'), { ssr: false });
const ShowAllEvents = dynamic(() => import('@/app/Component/AddandUpdateMenus/ShowAllEvents'), { ssr: false });

const DesignCalender = React.memo(({
  setNewEvent, newEvent,
  currentDate, days, isToday, setSelectedDate, typeIcons, setCurrentDate, showDayEvents, selectedEvent, setSelectedEvent,
  setShowDayEvents, loading, events, typeColors, priorityColors, handleAddEvent, handleUpdateEvent, handleDeleteEvent, selectedDate,
  setIsCreating, isCreating, viewMode, setViewMode, filterType, setFilterType, filterPriority, setFilterPriority
}) => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const dayKey = useCallback((d) => d.format('YYYY-MM-DD'), []);

  // Filter events by debounced search
  const visibleEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    if (!debouncedSearchQuery.trim()) return events;

    const queryLower = debouncedSearchQuery.toLowerCase().trim();
    return events.filter(ev =>
      ev.title?.toLowerCase().includes(queryLower) ||
      ev.description?.toLowerCase().includes(queryLower) ||
      ev.location?.toLowerCase().includes(queryLower) ||
      ev.tags?.some(tag => tag.toLowerCase().includes(queryLower))
    );
  }, [events, debouncedSearchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const counts = {
      birthday: 0,
      meeting: 0,
      public: 0,
      custom: 0,
      reminder: 0,
      deadline: 0,
      total: visibleEvents.length,
      upcoming: 0,
      today: 0
    };

    const today = dayjs();
    visibleEvents.forEach(ev => {
      if (counts[ev.type] !== undefined) counts[ev.type]++;

      const eventDate = dayjs(ev.date);
      if (eventDate.isAfter(today)) counts.upcoming++;
      if (eventDate.isSame(today, 'day')) counts.today++;
    });

    return counts;
  }, [visibleEvents]);

  const jumpMonth = useCallback((dir) => {
    if (!currentDate || !currentDate.add) return;
    setCurrentDate(currentDate.add(dir, 'month'));
  }, [currentDate, setCurrentDate]);

  const handleExportJSON = useCallback(() => {
    try {
      const blob = new Blob([JSON.stringify(events || [], null, 2)], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `events-${currentDate ? currentDate.format('YYYY-MM') : 'export'}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error('Export failed', err);
    }
  }, [events, currentDate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        setSelectedDate(dayjs());
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        jumpMonth(-1);
      } else if (e.key === 'ArrowRight' && e.altKey) {
        jumpMonth(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jumpMonth, setSelectedDate]);

  return (
    <div className="relative w-full min-h-screen p-3 sm:p-6 lg:p-8 overflow-hidden bg-slate-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Clean Modern Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-9 bg-indigo-600 rounded-full" />
            <div>
              <motion.h1
                key={currentDate?.format?.('MMMM YYYY')}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-black tracking-tight"
              >
                {currentDate?.format?.('MMMM YYYY')}
              </motion.h1>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                <button 
                  onClick={() => setCurrentDate(dayjs())}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t('Today')}
                </button>
                <span>•</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{stats.total} {t('Events')}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{stats.upcoming} {t('Upcoming')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-none">
              <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('Search events...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 text-xs font-medium outline-none transition-all"
              />
            </div>

            {/* Navigation & Actions */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => jumpMonth(-1)}
                className="p-2 rounded-lg hover:bg-white dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all"
                title={t('Previous Month')}
              >
                <HiChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => jumpMonth(1)}
                className="p-2 rounded-lg hover:bg-white dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all"
                title={t('Next Month')}
              >
                <HiChevronRight className="w-4 h-4" />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDate(dayjs())}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <HiPlus className="w-4 h-4" />
              <span>{t('New Event')}</span>
            </motion.button>
          </div>
        </header>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid Container */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-3 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t(day)}
                  </div>
                ))}
              </div>

              {/* Month Days Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentDate?.format?.('MM-YYYY')}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-7 gap-px bg-slate-200/70 dark:bg-white/10"
                >
                  {days?.map((day, idx) => {
                    const dayStr = dayKey(day);
                    const dayEvents = visibleEvents.filter(ev => dayjs(ev.date).format('YYYY-MM-DD') === dayStr);
                    const isTodayFlag = isToday(day);
                    const preview = dayEvents.slice(0, 2);
                    const moreCount = Math.max(0, dayEvents.length - preview.length);
                    const isCurrentMonth = day.isSame(currentDate, 'month');

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDate(day)}
                        className={`group min-h-[95px] sm:min-h-[125px] p-2 bg-white dark:bg-[#0B0F1A] transition-all cursor-pointer relative flex flex-col justify-between
                          ${!isCurrentMonth ? 'opacity-40 bg-slate-50/50 dark:bg-black/30' : 'hover:bg-slate-50/80 dark:hover:bg-white/[0.02]'}
                          ${isTodayFlag ? 'bg-indigo-50/40 dark:bg-indigo-500/10' : ''}`}
                      >
                        <div>
                          {/* Day Header */}
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isTodayFlag
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-700 dark:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-white/10'
                            }`}>
                              {day.date()}
                            </span>

                            {/* Mobile indicators */}
                            {dayEvents.length > 0 && (
                              <div className="flex space-x-1 sm:hidden">
                                {dayEvents.slice(0, 3).map((ev, i) => (
                                  <div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: ev.color || '#6366f1' }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Desktop Event Chips */}
                          <div className="hidden sm:block space-y-1">
                            {preview.map((ev) => (
                              <div
                                key={ev._id}
                                onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}
                                className={`
                                  px-2 py-1 rounded-md text-[10px] font-semibold truncate border transition-all cursor-pointer hover:scale-[1.01]
                                  ${typeColors?.[ev.type] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}
                                  ${ev.priority === 'urgent' ? 'border-l-2 border-l-rose-500' : ''}
                                `}
                              >
                                <div className="flex items-center gap-1">
                                  {ev.isVirtual && <HiVideoCamera className="w-3 h-3 text-indigo-500 flex-shrink-0" />}
                                  {ev.priority === 'urgent' && <HiFlag className="w-3 h-3 text-rose-500 flex-shrink-0" />}
                                  <span className="truncate">{ev.title}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* More Events Counter */}
                        {moreCount > 0 && (
                          <div className="hidden sm:block text-[9px] font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                            +{moreCount} {t('more')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Quick Metrics */}
            <div className="p-5 bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">{t('Overview')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                  <HiCake className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1" />
                  <div className="text-lg font-black text-slate-900 dark:text-white">{stats.birthday}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{t('Birthdays')}</div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                  <HiUsers className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1" />
                  <div className="text-lg font-black text-slate-900 dark:text-white">{stats.meeting}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{t('Meetings')}</div>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
                  <HiBell className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-1" />
                  <div className="text-lg font-black text-slate-900 dark:text-white">{stats.reminder}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{t('Reminders')}</div>
                </div>
                <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-100 dark:border-rose-500/20">
                  <HiFlag className="w-4 h-4 text-rose-600 dark:text-rose-400 mb-1" />
                  <div className="text-lg font-black text-slate-900 dark:text-white">{stats.deadline}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{t('Deadlines')}</div>
                </div>
              </div>
            </div>

            {/* Event Filters */}
            <div className="p-5 bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <HiFunnel className="w-3.5 h-3.5 text-slate-500" />
                {t('Filter Events')}
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">{t('Event Type')}</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent text-xs font-medium outline-none focus:border-indigo-500/50 transition-all"
                  >
                    <option value="all">{t('All Types')}</option>
                    <option value="birthday">{t('Birthday')}</option>
                    <option value="meeting">{t('Meeting')}</option>
                    <option value="public">{t('Public')}</option>
                    <option value="custom">{t('Custom')}</option>
                    <option value="reminder">{t('Reminder')}</option>
                    <option value="deadline">{t('Deadline')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">{t('Priority Level')}</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent text-xs font-medium outline-none focus:border-indigo-500/50 transition-all"
                  >
                    <option value="all">{t('All Priorities')}</option>
                    <option value="low">{t('Low')}</option>
                    <option value="medium">{t('Medium')}</option>
                    <option value="high">{t('High')}</option>
                    <option value="urgent">{t('Urgent')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Export Events Button */}
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-all text-xs font-bold uppercase tracking-wider"
            >
              <HiArrowDownTray className="w-4 h-4" />
              {t('Export JSON')}
            </button>
          </aside>
        </div>
      </div>

      {/* Dynamic Modals */}
      <AnimatePresence>
        {selectedDate && !selectedEvent && (
          <AddEventModal
            selectedDate={selectedDate}
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            setSelectedDate={setSelectedDate}
            handleAddEvent={handleAddEvent}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEvent && (
          <EventDetailsModal
            handleUpdateEvent={handleUpdateEvent}
            handleDeleteEvent={handleDeleteEvent}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDayEvents && (
          <ShowAllEvents
            setSelectedEvent={setSelectedEvent}
            showDayEvents={showDayEvents}
            setShowDayEvents={setShowDayEvents}
            typeColors={typeColors}
            typeIcons={typeIcons}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

DesignCalender.displayName = 'DesignCalender';
export default DesignCalender;
