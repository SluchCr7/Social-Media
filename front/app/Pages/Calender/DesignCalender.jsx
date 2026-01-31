'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import {
  HiChevronLeft,
  HiChevronRight,
  HiPlus,
  HiCake,
  HiUsers,
  HiCalendarDays,
  HiStar,
  HiBell,
  HiFlag,
  HiListBullet,
  HiSquares2X2,
  HiArrowDownTray,
  HiFilter,
  HiMagnifyingGlass,
  HiClock,
  HiMapPin,
  HiVideoCamera,
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// Lazy load modals
const AddEventModal = React.lazy(() => import('@/app/Component/AddandUpdateMenus/AddEventModal'));
const EventDetailsModal = React.lazy(() => import('@/app/Component/AddandUpdateMenus/EventDetailsModal'));
const ShowAllEvents = React.lazy(() => import('@/app/Component/AddandUpdateMenus/ShowAllEvents'));

const DesignCalender = React.memo(({
  setNewEvent, newEvent,
  currentDate, days, isToday, setSelectedDate, typeIcons, setCurrentDate, showDayEvents, selectedEvent, setSelectedEvent,
  setShowDayEvents, loading, events, typeColors, priorityColors, handleAddEvent, handleUpdateEvent, handleDeleteEvent, selectedDate,
  setIsCreating, isCreating, viewMode, setViewMode, filterType, setFilterType, filterPriority, setFilterPriority
}) => {
  const { t } = useTranslation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const dayKey = useCallback((d) => d.format('YYYY-MM-DD'), []);

  // Filter events by search
  const visibleEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    if (!searchQuery) return events;

    return events.filter(ev =>
      ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [events, searchQuery]);

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
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
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
    <div className="relative w-full min-h-screen p-4 sm:p-6 lg:p-8 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-[#0A0A0A] dark:via-[#0F0F0F] dark:to-[#0A0A0A]">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] rounded-full"
        />
      </div>

      <div className="w-full space-y-6">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
              <motion.h1
                key={currentDate?.format?.('MMMM YYYY')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
              >
                {currentDate?.format?.('MMMM YYYY')}
              </motion.h1>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-5">
              <button onClick={() => setCurrentDate(dayjs())} className="hover:text-indigo-500 transition-colors">
                {t('Today')}
              </button>
              <span>•</span>
              <span className="text-indigo-500/60">{stats.total} {t('Events')}</span>
              <span>•</span>
              <span className="text-green-500/60">{stats.upcoming} {t('Upcoming')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search events...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium outline-none focus:border-indigo-500 dark:focus:border-indigo-500/50 transition-all w-64"
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2 bg-white dark:bg-white/5 backdrop-blur-xl p-2 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg">
              <button
                onClick={() => jumpMonth(-1)}
                className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => jumpMonth(1)}
                className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                <HiChevronRight className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(dayjs())}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20"
              >
                <HiPlus className="w-4 h-4" />
                {t('New')}
              </motion.button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar Grid */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                    {t(day)}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentDate?.format?.('MM-YYYY')}-${viewMode}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-white/5"
                >
                  {days?.map((day, idx) => {
                    const dayStr = dayKey(day);
                    const dayEvents = visibleEvents.filter(ev => dayjs(ev.date).format('YYYY-MM-DD') === dayStr);
                    const isTodayFlag = isToday(day);
                    const preview = dayEvents.slice(0, 2);
                    const moreCount = Math.max(0, dayEvents.length - preview.length);

                    return (
                      <motion.div
                        key={idx}
                        onClick={() => setSelectedDate(day)}
                        whileHover={{ scale: 1.02, zIndex: 10 }}
                        className={`group relative min-h-[120px] p-3 bg-white dark:bg-[#0B0F1A] transition-all cursor-pointer
                          ${!day.isSame(currentDate, 'month') ? 'opacity-40 grayscale' : ''}
                          ${isTodayFlag ? 'bg-indigo-50/50 dark:bg-indigo-500/5 ring-2 ring-indigo-500/20' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-base font-bold ${isTodayFlag ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                            {day.date()}
                          </span>
                          {dayEvents.length > 0 && (
                            <div className="flex gap-1">
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

                        <div className="space-y-1">
                          {preview.map((ev) => (
                            <motion.div
                              key={ev._id}
                              whileHover={{ x: 2 }}
                              onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}
                              className={`px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider truncate border ${typeColors?.[ev.type] || 'bg-gray-100 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}
                            >
                              <div className="flex items-center gap-1">
                                {ev.priority === 'urgent' && <span className="text-red-500">!</span>}
                                {ev.isVirtual && <HiVideoCamera className="w-2.5 h-2.5" />}
                                <span className="truncate">{ev.title}</span>
                              </div>
                            </motion.div>
                          ))}
                          {moreCount > 0 && (
                            <div className="text-[7px] font-black uppercase tracking-widest text-indigo-500/60 pl-2">
                              +{moreCount} {t('more')}
                            </div>
                          )}
                        </div>

                        {isTodayFlag && (
                          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-lg" />
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 order-1 lg:order-2 space-y-4">
            {/* Stats Card */}
            <div className="p-6 bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">{t('Overview')}</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-xl border border-indigo-500/10">
                  <HiCake className="w-4 h-4 text-indigo-500 mb-1" />
                  <div className="text-xl font-black text-gray-900 dark:text-white">{stats.birthday}</div>
                  <div className="text-[8px] font-bold text-gray-500 uppercase">{t('Birthdays')}</div>
                </div>
                <div className="p-3 bg-green-500/5 dark:bg-green-500/10 rounded-xl border border-green-500/10">
                  <HiUsers className="w-4 h-4 text-green-500 mb-1" />
                  <div className="text-xl font-black text-gray-900 dark:text-white">{stats.meeting}</div>
                  <div className="text-[8px] font-bold text-gray-500 uppercase">{t('Meetings')}</div>
                </div>
                <div className="p-3 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-xl border border-yellow-500/10">
                  <HiBell className="w-4 h-4 text-yellow-500 mb-1" />
                  <div className="text-xl font-black text-gray-900 dark:text-white">{stats.reminder}</div>
                  <div className="text-[8px] font-bold text-gray-500 uppercase">{t('Reminders')}</div>
                </div>
                <div className="p-3 bg-red-500/5 dark:bg-red-500/10 rounded-xl border border-red-500/10">
                  <HiFlag className="w-4 h-4 text-red-500 mb-1" />
                  <div className="text-xl font-black text-gray-900 dark:text-white">{stats.deadline}</div>
                  <div className="text-[8px] font-bold text-gray-500 uppercase">{t('Deadlines')}</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="p-6 bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <HiFilter className="w-3 h-3" />
                {t('Filters')}
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-bold text-gray-500 uppercase mb-2 block">{t('Type')}</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium outline-none focus:border-indigo-500 transition-all"
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
                  <label className="text-[9px] font-bold text-gray-500 uppercase mb-2 block">{t('Priority')}</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium outline-none focus:border-indigo-500 transition-all"
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

            {/* Export */}
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest border border-gray-200 dark:border-white/10"
            >
              <HiArrowDownTray className="w-4 h-4" />
              {t('Export')}
            </button>
          </aside>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedDate && !selectedEvent && (
          <Suspense fallback={null}>
            <AddEventModal
              selectedDate={selectedDate}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              setSelectedDate={setSelectedDate}
              handleAddEvent={handleAddEvent}
              isCreating={isCreating}
              setIsCreating={setIsCreating}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEvent && (
          <Suspense fallback={null}>
            <EventDetailsModal
              handleUpdateEvent={handleUpdateEvent}
              handleDeleteEvent={handleDeleteEvent}
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDayEvents && (
          <Suspense fallback={null}>
            <ShowAllEvents
              setSelectedEvent={setSelectedEvent}
              showDayEvents={showDayEvents}
              setShowDayEvents={setShowDayEvents}
              typeColors={typeColors}
              typeIcons={typeIcons}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
});

DesignCalender.displayName = 'DesignCalender';
export default DesignCalender;
