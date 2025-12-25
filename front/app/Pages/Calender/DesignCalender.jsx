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
  HiListBullet,
  HiSquares2X2,
  HiBars3,
  HiArrowDownTray,
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// Lazy load modals for performance
const AddEventModal = React.lazy(() => import('@/app/Component/AddandUpdateMenus/AddEventModal'));
const EventDetailsModal = React.lazy(() => import('@/app/Component/AddandUpdateMenus/EventDetailsModal'));
const ShowAllEvents = React.lazy(() => import('@/app/Component/AddandUpdateMenus/ShowAllEvents'));

const DesignCalender = React.memo(({
  setNewEvent, newEvent,
  currentDate, days, isToday, setSelectedDate, typeIcons, setCurrentDate, showDayEvents, selectedEvent, setSelectedEvent,
  setShowDayEvents, loading, events, typeColors, handleAddEvent, handleUpdateEvent, handleDeleteEvent, selectedDate,
  setIsCreating, isCreating
}) => {
  const { t } = useTranslation();

  // local UI state
  const [viewMode, setViewMode] = useState('month'); // month | week | list
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterTypes, setFilterTypes] = useState({ birthday: true, meeting: true, public: true, custom: true });

  const dayKey = useCallback((d) => d.format('YYYY-MM-DD'), []);

  const visibleEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    return events.filter(ev => (filterTypes[ev.type] ?? true));
  }, [events, filterTypes]);

  const stats = useMemo(() => {
    const counts = { birthday: 0, meeting: 0, public: 0, custom: 0 };
    visibleEvents.forEach(ev => { if (counts[ev.type] !== undefined) counts[ev.type]++; });
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

  const toggleFilter = useCallback((type) => {
    setFilterTypes(prev => ({ ...prev, [type]: !prev[type] }));
  }, []);

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
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-12 overflow-hidden">
      {/* 🎭 Animated Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="w-full space-y-8">
        {/* 🚀 Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
              <motion.h1
                key={currentDate?.format?.('MMMM YYYY')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white"
              >
                {currentDate?.format?.('MMMM YYYY')}
              </motion.h1>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">
              <button onClick={() => setCurrentDate(dayjs())} className="hover:text-indigo-500 transition-colors">
                {t('Jump to Today')}
              </button>
              <span>•</span>
              <span className="text-indigo-500/60">{days?.length ?? 0} {t('Temporal Units')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl p-2 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl">
            <button
              onClick={() => jumpMonth(-1)}
              className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-95"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => jumpMonth(1)}
              className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-95"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-2" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(dayjs())}
              className="flex items-center gap-2 bg-indigo-600 px-6 py-3 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:bg-indigo-700"
            >
              <HiPlus className="w-4 h-4" />
              {t('New Event')}
            </motion.button>
          </div>
        </header>

        {/* 📅 Main View Container */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar Deck */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-gray-100 dark:border-white/5">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {t(day)}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentDate?.format?.('MM-YYYY')}-${viewMode}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-white/5"
                >
                  {days?.map((day, idx) => {
                    const dayStr = dayKey(day);
                    const dayEvents = visibleEvents.filter(ev => dayjs(ev.date).format('YYYY-MM-DD') === dayStr);
                    const isTodayFlag = isToday(day);
                    const preview = dayEvents.slice(0, 3);
                    const moreCount = Math.max(0, dayEvents.length - preview.length);

                    return (
                      <motion.div
                        key={idx}
                        onClick={() => setSelectedDate(day)}
                        className={`group relative min-h-[140px] p-4 bg-white dark:bg-[#0B0F1A] transition-all hover:z-10 hover:shadow-2xl hover:scale-[1.02] cursor-pointer
                          ${!day.isSame(currentDate, 'month') ? 'opacity-30 grayscale' : ''}
                          ${isTodayFlag ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <span className={`text-lg font-black tracking-tighter ${isTodayFlag ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                            {day.date()}
                          </span>
                          {dayEvents.length > 0 && (
                            <div className="flex -space-x-1">
                              {dayEvents.slice(0, 2).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 space-y-1.5">
                          {preview.map((ev) => (
                            <motion.div
                              key={ev._id}
                              whileHover={{ x: 3 }}
                              onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}
                              className={`px-2 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest truncate border border-transparent hover:border-white/10 shadow-sm
                                ${typeColors?.[ev.type] || 'bg-gray-800/40 text-white'}`}
                            >
                              {ev.title}
                            </motion.div>
                          ))}
                          {moreCount > 0 && (
                            <div className="text-[8px] font-black uppercase tracking-widest text-indigo-500/60 pl-1">
                              + {moreCount} {t('Others')}
                            </div>
                          )}
                        </div>

                        {isTodayFlag && (
                          <div className="absolute inset-x-4 top-0 h-1 bg-indigo-500 rounded-full" />
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 📊 Sidebar Metrics */}
          <aside className="w-full lg:w-80 order-1 lg:order-2 space-y-6">
            <div className="p-8 bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">{t('Data Synopsis')}</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                  <HiCake className="w-5 h-5 text-indigo-500 mb-2" />
                  <div className="text-2xl font-black">{stats.birthday}</div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase">{t('Birthdays')}</div>
                </div>
                <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                  <HiUsers className="w-5 h-5 text-purple-500 mb-2" />
                  <div className="text-2xl font-black">{stats.meeting}</div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase">{t('Meetings')}</div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('Transmission Filters')}</h4>
                {Object.keys(filterTypes).map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${filterTypes[type] ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-gray-300'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${filterTypes[type] ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                        {t(type)}
                      </span>
                    </div>
                    {filterTypes[type] && <div className="text-[8px] font-black text-indigo-500">ACTIVE</div>}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest"
                >
                  <HiArrowDownTray className="w-4 h-4" />
                  {t('Export Data')}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 🎭 Modals (Lazy Loaded) */}
      <AnimatePresence>
        {selectedDate && !selectedEvent && (
          <Suspense fallback={null}>
            <AddEventModal
              selectedDate={selectedDate}
              newEvent={newEvent} setNewEvent={setNewEvent}
              setSelectedDate={setSelectedDate}
              handleAddEvent={handleAddEvent} isCreating={isCreating}
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

      {/* 🔮 Floating Decorative Tip */}
      <div className="fixed bottom-8 right-8 flex items-center gap-4 bg-white/70 dark:bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl z-50">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-75" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Sync Operational • Zocial Pulse
        </span>
      </div>
    </div>
  );
});

DesignCalender.displayName = 'DesignCalender';
export default DesignCalender;
