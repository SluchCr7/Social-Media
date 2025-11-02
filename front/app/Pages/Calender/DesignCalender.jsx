// 'use client'
// import React from 'react'
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaPlus,
//   FaTrash,
//   FaEdit,
//   FaBirthdayCake,
//   FaUsers,
//   FaCalendarAlt,
//   FaRegStar,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import dayjs from "dayjs";
// import AddEventModal from '@/app/Component/AddandUpdateMenus/AddEventModal';
// import EventDetailsModal from '@/app/Component/AddandUpdateMenus/EventDetailsModal';
// import ShowAllEvents from '@/app/Component/AddandUpdateMenus/ShowAllEvents';
// import { useTranslation } from 'react-i18next';


// const DesignCalender = React.memo(({
//     setNewEvent,newEvent,
//     currentDate, days,isToday,  setSelectedDate, typeIcons,setCurrentDate, showDayEvents,selectedEvent, setSelectedEvent,
//     setShowDayEvents,loading,events,typeColors,handleAddEvent,handleUpdateEvent,handleDeleteEvent,selectedDate
//     ,setIsCreating , isCreating
// }) => {

//   // helper to format day key
//   const dayKey = (d) => d.format('YYYY-MM-DD')
//   const {t} = useTranslation()
//   return (
//     <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto
//       bg-gradient-to-b from-white/2 dark:from-black/40 to-transparent
//       text-lightMode-text dark:text-darkMode-text rounded-2xl">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
//         <div className="flex items-center gap-3 w-full sm:w-auto">
//           <button
//             onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
//             className="p-2 rounded-full hover:bg-gray-100/60 dark:hover:bg-white/5 transition"
//             title="Previous month"
//           >
//             <FaChevronLeft />
//           </button>

//           <div className="flex flex-col text-left">
//             <h2 className="text-lg sm:text-2xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
//             <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
//               <button
//                 onClick={() => setCurrentDate(dayjs())}
//                 className="text-sm text-blue-500 hover:underline"
//               >
//                 {t("Today")}
//               </button>
//               <span>·</span>
//               <span>{days.length} {t("days")}</span>
//             </div>
//           </div>

//           <button
//             onClick={() => setCurrentDate(currentDate.add(1, "month"))}
//             className="p-2 rounded-full hover:bg-gray-100/60 dark:hover:bg-white/5 transition ml-2 sm:ml-4"
//             title="Next month"
//           >
//             <FaChevronRight />
//           </button>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => {
//               // open add event modal by selecting today
//               setSelectedDate(dayjs())
//             }}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg shadow"
//             title="Add event"
//           >
//             <FaPlus /> <span className="text-sm hidden sm:inline">{t("Add Event")}</span>
//           </button>

//           <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
//             <span className="flex items-center gap-1"><FaBirthdayCake /> {t("Birthday")}</span>
//             <span className="flex items-center gap-1"><FaUsers /> {t("Meeting")}</span>
//             <span className="flex items-center gap-1"><FaCalendarAlt /> {t("Public")}</span>
//           </div>
//         </div>
//       </div>

//       {/* Days Header */}
//       <div className="hidden sm:grid grid-cols-7 text-center font-semibold text-xs sm:text-sm
//         text-lightMode-text2 dark:text-darkMode-text2 mb-2 uppercase tracking-wider">
//         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//           <div key={day} className="py-2">{t(day)}</div>
//         ))}
//       </div>

//       {/* Days Grid wrapper: on small screens use horizontal scroll */}
//       <div className="overflow-x-auto">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentDate.format("MM-YYYY")}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.35 }}
//             className="grid grid-cols-7 gap-2 min-w-[640px] sm:min-w-full"
//           >
//             {days.map((day, idx) => {
//               const dayStr = dayKey(day)
//               const dayEvents = events.filter(
//                 (ev) => dayjs(ev.date).format("YYYY-MM-DD") === dayStr
//               );

//               const isCurrent = isToday(day)

//               // max 3 previewed events
//               const preview = dayEvents.slice(0, 3)
//               const moreCount = Math.max(0, dayEvents.length - 3)

//               return (
//                 <motion.div
//                   key={idx}
//                   whileHover={{ scale: 1.02 }}
//                   className={`min-h-[100px] sm:h-28 border rounded-xl p-2 relative
//                     transition-all duration-200 cursor-pointer
//                     ${isCurrent ? "bg-blue-50/40 border-blue-400" : "bg-white/3 dark:bg-transparent"}
//                     `}
//                   onClick={() => setSelectedDate(day)}
//                 >
//                   {/* Date badge */}
//                   <div className={`absolute top-2 left-2 text-[12px] font-semibold px-2 py-1 rounded-full
//                     ${isCurrent ? "bg-blue-600 text-white" : "bg-black/5 dark:bg-white/5 text-gray-800 dark:text-gray-100"}`}>
//                     {day.date()}
//                   </div>

//                   {/* small indicators */}
//                   <div className="absolute top-2 right-2 flex items-center gap-1">
//                     {/* red dot: event today */}
//                     {dayEvents.some(ev => dayjs(ev.date).isSame(dayjs(), "day")) && (
//                       <span className="w-2 h-2 rounded-full bg-red-500" title="Happening today" />
//                     )}
//                     {/* yellow dot: tomorrow */}
//                     {dayEvents.some(ev => dayjs(ev.date).isSame(dayjs().add(1, 'day'), "day")) && (
//                       <span className="w-2 h-2 rounded-full bg-yellow-400" title="Tomorrow" />
//                     )}
//                   </div>

//                   {/* Events preview */}
//                   <div className="mt-6 space-y-1">
//                     {preview.map((ev) => (
//                       <div
//                         key={ev._id}
//                         className={`flex items-center gap-2 px-2 py-1 rounded-md font-medium truncate shadow-sm
//                           ${typeColors?.[ev.type] || "bg-gray-800/40"} `}
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setSelectedEvent(ev)
//                         }}
//                         title={ev.title}
//                       >
//                         <span className="text-sm">{typeIcons?.[ev.type] || '•'}</span>
//                         <span className="text-xs truncate">{ev.title}</span>
//                         {/* repeat indicator */}
//                         {ev.repeatYearly && (
//                           <span className="ml-auto text-[10px] px-1 rounded bg-yellow-400/20 text-yellow-600">yr</span>
//                         )}
//                       </div>
//                     ))}

//                     {/* more button */}
//                     {moreCount > 0 && (
//                       <button
//                         className="text-[11px] text-blue-600 underline ml-1"
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setShowDayEvents(dayEvents)
//                         }}
//                       >
//                         +{moreCount} {t("more")}
//                       </button>
//                     )}

//                     {/* empty hint */}
//                     {dayEvents.length === 0 && (
//                       <div className="text-[12px] text-gray-500 mt-1">{t("No events")}</div>
//                     )}
//                   </div>
//                 </motion.div>
//               )
//             })}
//           </motion.div>
//         </AnimatePresence>
//       </div>

//       {/* Add Event Modal */}
//       {selectedDate && !selectedEvent && (
//         <AddEventModal selectedDate={selectedDate}
//           newEvent={newEvent} setNewEvent={setNewEvent}
//           setSelectedDate={setSelectedDate}
//           handleAddEvent={handleAddEvent} isCreating={isCreating}
//         />
//       )}

//       {/* Event Details Modal */}
//       {selectedEvent && (
//         <EventDetailsModal 
//           handleUpdateEvent={handleUpdateEvent} 
//           handleDeleteEvent={handleDeleteEvent} 
//           selectedEvent={selectedEvent}      
//           setSelectedEvent={setSelectedEvent}  
//         />
//       )}


//       {/* Show All Events in a Day */}
//       {showDayEvents && (
//         <ShowAllEvents 
//           setSelectedEvent={setSelectedEvent} showDayEvents={showDayEvents} setShowDayEvents={setShowDayEvents} typeColors={typeColors} typeIcons={typeIcons}
//         />
//       )}
//     </div>
//   )
// })

// DesignCalender.displayName = 'DesignCalender';
// export default DesignCalender
'use client'
import React, { useState, useEffect, useMemo } from 'react'
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTrash,
  FaEdit,
  FaBirthdayCake,
  FaUsers,
  FaCalendarAlt,
  FaRegStar,
  FaList,
  FaTh,
  FaBars,
  FaDownload,
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import AddEventModal from '@/app/Component/AddandUpdateMenus/AddEventModal'
import EventDetailsModal from '@/app/Component/AddandUpdateMenus/EventDetailsModal'
import ShowAllEvents from '@/app/Component/AddandUpdateMenus/ShowAllEvents'
import { useTranslation } from 'react-i18next'

// NOTE: this file preserves all incoming props and behavior from the original component.
// It layers UI/UX improvements, a small sidebar, view toggles and a mini navigator.

const DesignCalender = React.memo(({
  setNewEvent,newEvent,
  currentDate, days,isToday,  setSelectedDate, typeIcons,setCurrentDate, showDayEvents,selectedEvent, setSelectedEvent,
  setShowDayEvents,loading,events,typeColors,handleAddEvent,handleUpdateEvent,handleDeleteEvent,selectedDate
  ,setIsCreating , isCreating
}) => {
  const { t } = useTranslation()

  // local UI state (non-destructive to props)
  const [viewMode, setViewMode] = useState('month') // month | week | list
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filterTypes, setFilterTypes] = useState({ birthday: true, meeting: true, public: true, custom: true })

  // helper to format day key (kept as original)
  const dayKey = (d) => d.format('YYYY-MM-DD')

  // filtered events according to local filters
  const visibleEvents = useMemo(() => events.filter(ev => filterTypes[ev.type] ?? true), [events, filterTypes])

  // small analytics for sidebar
  const stats = useMemo(() => {
    const counts = { birthday: 0, meeting: 0, public: 0, custom: 0 }
    visibleEvents.forEach(ev => { if(counts[ev.type] !== undefined) counts[ev.type]++ })
    return counts
  }, [visibleEvents])

  // mini navigator: quick jump to previous/next month (preserve setCurrentDate usage)
  const jumpMonth = (dir) => setCurrentDate(currentDate.add(dir, 'month'))

  // export (client only dummy JSON export)
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = `events-${currentDate.format('YYYY-MM')}.json`
    a.click()
    URL.revokeObjectURL(href)
  }

  // small helper to toggle filter
  const toggleFilter = (type) => setFilterTypes(prev => ({ ...prev, [type]: !prev[type] }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto
      bg-gradient-to-b from-white/2 dark:from-black/40 to-transparent
      text-lightMode-text dark:text-darkMode-text rounded-2xl shadow-lg border border-white/6 backdrop-blur-sm">

      {/* Top bar + sidebar toggle */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => jumpMonth(-1)}
                className="p-2 rounded-full hover:bg-gray-100/60 dark:hover:bg-white/5 transition"
                title="Previous month"
              >
                <FaChevronLeft />
              </button>

              <div className="flex flex-col text-left">
                <motion.h2
                  key={currentDate.format('MMMM YYYY')}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-lg sm:text-2xl font-bold tracking-tight"
                >
                  {currentDate.format('MMMM YYYY')}
                </motion.h2>

                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
                  <button
                    onClick={() => setCurrentDate(dayjs())}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {t('Today')}
                  </button>
                  <span>·</span>
                  <span>{days.length} {t('days')}</span>
                </div>
              </div>

              <button
                onClick={() => jumpMonth(1)}
                className="p-2 rounded-full hover:bg-gray-100/60 dark:hover:bg-white/5 transition ml-2 sm:ml-4"
                title="Next month"
              >
                <FaChevronRight />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDate(dayjs())}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg shadow"
                  title="Add event"
                >
                  <FaPlus /> <span className="text-sm hidden sm:inline">{t('Add Event')}</span>
                </button>

                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><FaBirthdayCake /> {t('Birthday')}</span>
                  <span className="flex items-center gap-1"><FaUsers /> {t('Meeting')}</span>
                  <span className="flex items-center gap-1"><FaCalendarAlt /> {t('Public')}</span>
                </div>
              </div>

              {/* view toggles */}
              <div className="flex items-center gap-2 bg-white/4 dark:bg-black/20 rounded-md p-1">
                <button
                  onClick={() => setViewMode('month')}
                  className={`p-2 rounded-md ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                  title="Month view"
                ><FaTh /></button>

                <button
                  onClick={() => setViewMode('week')}
                  className={`p-2 rounded-md ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                  title="Week view"
                ><FaBars /></button>

                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                  title="List view"
                ><FaList /></button>
              </div>

              {/* export + sidebar toggle */}
              <button onClick={handleExportJSON} className="p-2 rounded-md hover:bg-gray-100/50 dark:hover:bg-white/5" title="Export JSON">
                <FaDownload />
              </button>

              <button onClick={() => setSidebarOpen(s => !s)} className="p-2 rounded-md hover:bg-gray-100/50 dark:hover:bg-white/5 ml-1" title="Toggle sidebar">
                <FaUsers />
              </button>
            </div>
          </div>

          {/* Days header for desktop */}
          <div className="hidden sm:grid grid-cols-7 text-center font-semibold text-xs sm:text-sm
            text-lightMode-text2 dark:text-darkMode-text2 mb-2 uppercase tracking-wider">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2">{t(day)}</div>
            ))}
          </div>

          {/* Calendar grid wrapper */}
          <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentDate.format('MM-YYYY')}-${viewMode}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className={`grid grid-cols-7 gap-2 min-w-[640px] sm:min-w-full ${viewMode === 'list' ? 'opacity-90' : ''}`}
              >
                {days.map((day, idx) => {
                  const dayStr = dayKey(day)
                  const dayEvents = visibleEvents.filter(
                    (ev) => dayjs(ev.date).format('YYYY-MM-DD') === dayStr
                  )

                  const isCurrent = isToday(day)

                  const preview = dayEvents.slice(0, 3)
                  const moreCount = Math.max(0, dayEvents.length - 3)

                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className={`min-h-[100px] sm:h-28 border rounded-2xl p-2 relative
                        transition-all duration-200 cursor-pointer
                        ${isCurrent ? 'bg-gradient-to-br from-blue-50/60 to-white/30 border-blue-400 shadow-md' : 'bg-white/3 dark:bg-transparent'}
                        `}
                      onClick={() => setSelectedDate(day)}
                    >
                      {/* Date badge */}
                      <div className={`absolute top-2 left-2 text-[12px] font-semibold px-2 py-1 rounded-full
                        ${isCurrent ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.18)]' : 'bg-black/5 dark:bg-white/5 text-gray-800 dark:text-gray-100'}`}>
                        {day.date()}
                      </div>

                      {/* small indicators */}
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        {dayEvents.some(ev => dayjs(ev.date).isSame(dayjs(), 'day')) && (
                          <span className="w-2 h-2 rounded-full bg-red-500" title="Happening today" />
                        )}
                        {dayEvents.some(ev => dayjs(ev.date).isSame(dayjs().add(1, 'day'), 'day')) && (
                          <span className="w-2 h-2 rounded-full bg-yellow-400" title="Tomorrow" />
                        )}
                      </div>

                      {/* Events preview */}
                      <div className="mt-6 space-y-1">
                        {preview.map((ev) => (
                          <div
                            key={ev._id}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md font-medium truncate shadow-sm ring-1 ring-white/6
                              ${typeColors?.[ev.type] || 'bg-gray-800/40'} `}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEvent(ev)
                            }}
                            title={`${ev.title} - ${ev.description || ''}`}
                          >
                            <span className="text-sm">{typeIcons?.[ev.type] || '•'}</span>
                            <span className="text-xs truncate">{ev.title}</span>

                            {ev.repeatYearly && (
                              <span className="ml-auto text-[10px] px-1 rounded bg-yellow-400/20 text-yellow-600">yr</span>
                            )}
                          </div>
                        ))}

                        {moreCount > 0 && (
                          <button
                            className="text-[11px] text-blue-600 underline ml-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowDayEvents(dayEvents)
                            }}
                          >
                            +{moreCount} {t('more')}
                          </button>
                        )}

                        {dayEvents.length === 0 && (
                          <div className="text-[12px] text-gray-500 mt-1 flex items-center gap-2">{t('No events')}</div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`w-72 transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-4'} hidden md:block`}>
          <div className="p-4 rounded-xl bg-white/6 dark:bg-black/30 border border-white/5 h-full sticky top-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">{t('Overview')}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md hover:bg-white/5">×</button>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{t('This month')}</span>
                <span className="font-medium">{visibleEvents.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-md bg-white/3 dark:bg-black/20">
                  <FaBirthdayCake /> <span className="truncate">{t('Birthdays')}</span>
                  <span className="ml-auto font-semibold">{stats.birthday}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md bg-white/3 dark:bg-black/20">
                  <FaUsers /> <span className="truncate">{t('Meetings')}</span>
                  <span className="ml-auto font-semibold">{stats.meeting}</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-md bg-white/3 dark:bg-black/20">
                  <FaCalendarAlt /> <span className="truncate">{t('Public')}</span>
                  <span className="ml-auto font-semibold">{stats.public}</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-md bg-white/3 dark:bg-black/20">
                  <FaRegStar /> <span className="truncate">{t('Custom')}</span>
                  <span className="ml-auto font-semibold">{stats.custom}</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold mb-2">{t('Filters')}</h4>
              <div className="flex flex-col gap-2">
                {Object.keys(filterTypes).map((k) => (
                  <label key={k} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={filterTypes[k]} onChange={() => toggleFilter(k)} />
                    <span className="capitalize">{k}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold mb-2">{t('Quick jump')}</h4>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentDate(dayjs())} className="px-2 py-1 rounded-md bg-white/5">{t('Today')}</button>
                <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))} className="px-2 py-1 rounded-md bg-white/5">◀</button>
                <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))} className="px-2 py-1 rounded-md bg-white/5">▶</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Add Event Modal (preserve original conditionals) */}
      {selectedDate && !selectedEvent && (
        <AddEventModal selectedDate={selectedDate}
          newEvent={newEvent} setNewEvent={setNewEvent}
          setSelectedDate={setSelectedDate}
          handleAddEvent={handleAddEvent} isCreating={isCreating}
        />
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal 
          handleUpdateEvent={handleUpdateEvent} 
          handleDeleteEvent={handleDeleteEvent} 
          selectedEvent={selectedEvent}      
          setSelectedEvent={setSelectedEvent}  
        />
      )}

      {/* Show All Events in a Day */}
      {showDayEvents && (
        <ShowAllEvents 
          setSelectedEvent={setSelectedEvent} showDayEvents={showDayEvents} setShowDayEvents={setShowDayEvents} typeColors={typeColors} typeIcons={typeIcons}
        />
      )}
    </div>
  )
})

DesignCalender.displayName = 'DesignCalender';
export default DesignCalender
