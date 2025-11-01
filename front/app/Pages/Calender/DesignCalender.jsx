'use client'
import React from 'react'
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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import AddEventModal from '@/app/Component/AddandUpdateMenus/AddEventModal';
import EventDetailsModal from '@/app/Component/AddandUpdateMenus/EventDetailsModal';
import ShowAllEvents from '@/app/Component/AddandUpdateMenus/ShowAllEvents';
import { useTranslation } from 'react-i18next';


const DesignCalender = React.memo(({
    setNewEvent,newEvent,
    currentDate, days,isToday,  setSelectedDate, typeIcons,setCurrentDate, showDayEvents,selectedEvent, setSelectedEvent,
    setShowDayEvents,loading,events,typeColors,handleAddEvent,handleUpdateEvent,handleDeleteEvent,selectedDate
    ,setIsCreating , isCreating
}) => {

  // helper to format day key
  const dayKey = (d) => d.format('YYYY-MM-DD')
  const {t} = useTranslation()
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto
      bg-gradient-to-b from-white/2 dark:from-black/40 to-transparent
      text-lightMode-text dark:text-darkMode-text rounded-2xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
            className="p-2 rounded-full hover:bg-gray-100/60 dark:hover:bg-white/5 transition"
            title="Previous month"
          >
            <FaChevronLeft />
          </button>

          <div className="flex flex-col text-left">
            <h2 className="text-lg sm:text-2xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
              <button
                onClick={() => setCurrentDate(dayjs())}
                className="text-sm text-blue-500 hover:underline"
              >
                {t("Today")}
              </button>
              <span>·</span>
              <span>{days.length} {t("days")}</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentDate(currentDate.add(1, "month"))}
            className="p-2 rounded-full hover:bg-gray-100/60 dark:hover:bg-white/5 transition ml-2 sm:ml-4"
            title="Next month"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // open add event modal by selecting today
              setSelectedDate(dayjs())
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg shadow"
            title="Add event"
          >
            <FaPlus /> <span className="text-sm hidden sm:inline">{t("Add Event")}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><FaBirthdayCake /> {t("Birthday")}</span>
            <span className="flex items-center gap-1"><FaUsers /> {t("Meeting")}</span>
            <span className="flex items-center gap-1"><FaCalendarAlt /> {t("Public")}</span>
          </div>
        </div>
      </div>

      {/* Days Header */}
      <div className="hidden sm:grid grid-cols-7 text-center font-semibold text-xs sm:text-sm
        text-lightMode-text2 dark:text-darkMode-text2 mb-2 uppercase tracking-wider">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2">{t(day)}</div>
        ))}
      </div>

      {/* Days Grid wrapper: on small screens use horizontal scroll */}
      <div className="overflow-x-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDate.format("MM-YYYY")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-7 gap-2 min-w-[640px] sm:min-w-full"
          >
            {days.map((day, idx) => {
              const dayStr = dayKey(day)
              const dayEvents = events.filter(
                (ev) => dayjs(ev.date).format("YYYY-MM-DD") === dayStr
              );

              const isCurrent = isToday(day)

              // max 3 previewed events
              const preview = dayEvents.slice(0, 3)
              const moreCount = Math.max(0, dayEvents.length - 3)

              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className={`min-h-[100px] sm:h-28 border rounded-xl p-2 relative
                    transition-all duration-200 cursor-pointer
                    ${isCurrent ? "bg-blue-50/40 border-blue-400" : "bg-white/3 dark:bg-transparent"}
                    `}
                  onClick={() => setSelectedDate(day)}
                >
                  {/* Date badge */}
                  <div className={`absolute top-2 left-2 text-[12px] font-semibold px-2 py-1 rounded-full
                    ${isCurrent ? "bg-blue-600 text-white" : "bg-black/5 dark:bg-white/5 text-gray-800 dark:text-gray-100"}`}>
                    {day.date()}
                  </div>

                  {/* small indicators */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    {/* red dot: event today */}
                    {dayEvents.some(ev => dayjs(ev.date).isSame(dayjs(), "day")) && (
                      <span className="w-2 h-2 rounded-full bg-red-500" title="Happening today" />
                    )}
                    {/* yellow dot: tomorrow */}
                    {dayEvents.some(ev => dayjs(ev.date).isSame(dayjs().add(1, 'day'), "day")) && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400" title="Tomorrow" />
                    )}
                  </div>

                  {/* Events preview */}
                  <div className="mt-6 space-y-1">
                    {preview.map((ev) => (
                      <div
                        key={ev._id}
                        className={`flex items-center gap-2 px-2 py-1 rounded-md font-medium truncate shadow-sm
                          ${typeColors?.[ev.type] || "bg-gray-800/40"} `}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEvent(ev)
                        }}
                        title={ev.title}
                      >
                        <span className="text-sm">{typeIcons?.[ev.type] || '•'}</span>
                        <span className="text-xs truncate">{ev.title}</span>
                        {/* repeat indicator */}
                        {ev.repeatYearly && (
                          <span className="ml-auto text-[10px] px-1 rounded bg-yellow-400/20 text-yellow-600">yr</span>
                        )}
                      </div>
                    ))}

                    {/* more button */}
                    {moreCount > 0 && (
                      <button
                        className="text-[11px] text-blue-600 underline ml-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDayEvents(dayEvents)
                        }}
                      >
                        +{moreCount} {t("more")}
                      </button>
                    )}

                    {/* empty hint */}
                    {dayEvents.length === 0 && (
                      <div className="text-[12px] text-gray-500 mt-1">{t("No events")}</div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Event Modal */}
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

export default DesignCalender

// "use client"
// import React, { useMemo, useState, useEffect } from "react";
// import dayjs from "dayjs";
// import { motion } from "framer-motion";
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaPlus,
//   FaCalendarAlt,
//   FaRegStar,
//   FaSearch,
//   FaSlidersH,
//   FaThLarge,
//   FaList,
// } from "react-icons/fa";
// import AddEventModal from '@/app/Component/AddandUpdateMenus/AddEventModal';
// import EventDetailsModal from '@/app/Component/AddandUpdateMenus/EventDetailsModal';
// import ShowAllEvents from '@/app/Component/AddandUpdateMenus/ShowAllEvents';
// // import MiniCalendar from './MiniCalendar'; // optional: if you keep a separate mini calendar file
// // import "./EnhancedCalendar.css"; // optional additional styles


// export default function EnhancedCalendar({
//   events = [],
//   loading = false,
//   addEvent = async () => {},
//   updateEvent = async () => {},
//   deleteEvent = async () => {},
//   initialDate = dayjs(),
// }) {
//   // view: month | week | day
//   const [view, setView] = useState("month");
//   const [currentDate, setCurrentDate] = useState(dayjs(initialDate));
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [showDayEvents, setShowDayEvents] = useState(null);
//   const [query, setQuery] = useState("");
//   const [filters, setFilters] = useState({ birthday: true, meeting: true, public: true, custom: true });
//   const [isCreating, setIsCreating] = useState(false);

//   // configuration: how many future years to expand repeated yearly events
//   const yearsToGenerate = 10;

//   // generate days to render based on view
//   const days = useMemo(() => {
//     if (view === "month") {
//       const startOfMonth = currentDate.startOf("month");
//       const endOfMonth = currentDate.endOf("month");
//       let startDate = startOfMonth.startOf("week");
//       let endDate = endOfMonth.endOf("week");
//       const arr = [];
//       let d = startDate;
//       while (d.isBefore(endDate) || d.isSame(endDate)) {
//         arr.push(d);
//         d = d.add(1, "day");
//       }
//       return arr;
//     }

//     if (view === "week") {
//       const start = currentDate.startOf("week");
//       return Array.from({ length: 7 }).map((_, i) => start.add(i, "day"));
//     }

//     // day view
//     return [currentDate.startOf("day")];
//   }, [currentDate, view]);

//   // helper
//   const formatKey = (d) => d.format("YYYY-MM-DD");
//   const isToday = (d) => dayjs().isSame(d, "day");

//   // expand yearly repeating events for upcoming years (display-only)
//   const expandedEvents = useMemo(() => {
//     return events.flatMap((ev) => {
//       if (!ev.repeatYearly) return [ev];
//       const original = dayjs(ev.date);
//       const startYear = dayjs().year();
//       const instances = Array.from({ length: yearsToGenerate }).map((_, i) => {
//         const year = startYear + i;
//         return {
//           ...ev,
//           date: original.year(year).format("YYYY-MM-DD"),
//           _id: `${ev._id}_repeat_${year}`,
//           __isGenerated: true,
//         };
//       });
//       // also include original to allow editing/deleting the stored record
//       return [ev, ...instances];
//     });
//   }, [events]);

//   // apply search + filters
//   const visibleEvents = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return expandedEvents.filter((ev) => {
//       if (!filters[ev.type]) return false;
//       if (!q) return true;
//       return (
//         (ev.title || "").toLowerCase().includes(q) ||
//         (ev.description || "").toLowerCase().includes(q) ||
//         dayjs(ev.date).format("YYYY-MM-DD").includes(q)
//       );
//     });
//   }, [expandedEvents, query, filters]);

//   // group events by day key for quick lookup
//   const eventsByDay = useMemo(() => {
//     const map = new Map();
//     visibleEvents.forEach((ev) => {
//       const key = dayjs(ev.date).format("YYYY-MM-DD");
//       if (!map.has(key)) map.set(key, []);
//       map.get(key).push(ev);
//     });
//     // sort each day's events by time if event has time field
//     for (const [k, arr] of map.entries()) {
//       arr.sort((a, b) => (a.time || "") > (b.time || "") ? 1 : -1);
//     }
//     return map;
//   }, [visibleEvents]);

//   // navigation helpers
//   const prev = () => setCurrentDate((c) => (view === "month" ? c.subtract(1, "month") : c.subtract(1, view)));
//   const next = () => setCurrentDate((c) => (view === "month" ? c.add(1, "month") : c.add(1, view)));
//   const goToday = () => setCurrentDate(dayjs());

//   // compact UI components inside the same file for convenience
//   const ViewToggle = () => (
//     <div className="flex items-center gap-2">
//       <button onClick={() => setView("month")} className={`p-2 rounded ${view === 'month' ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`} title="Month">
//         <FaThLarge />
//       </button>
//       <button onClick={() => setView("week")} className={`p-2 rounded ${view === 'week' ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`} title="Week">
//         <FaList />
//       </button>
//       <button onClick={() => setView("day")} className={`p-2 rounded ${view === 'day' ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`} title="Day">
//         <FaCalendarAlt />
//       </button>
//     </div>
//   );

//   const FiltersPanel = () => (
//     <div className="flex items-center gap-2">
//       <div className="relative">
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search events..."
//           className="pl-9 pr-3 py-2 rounded-md border bg-white/5 placeholder-gray-400 text-sm"
//         />
//         <FaSearch className="absolute left-2 top-2 text-sm opacity-60" />
//       </div>

//       <div className="flex items-center gap-1">
//         <button className="p-2 rounded hover:bg-gray-100/50" title="Filters"><FaSlidersH /></button>
//         {/* quick type toggles */}
//         {Object.keys(filters).map((k) => (
//           <button
//             key={k}
//             onClick={() => setFilters((s) => ({ ...s, [k]: !s[k] }))}
//             className={`px-2 py-1 rounded-full text-xs ${filters[k] ? 'bg-blue-600 text-white' : 'bg-transparent border border-gray-200/30'}`}>
//             {k}
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   // render cell for month/week/day
//   const DayCell = ({ day }) => {
//     const key = formatKey(day);
//     const dayEvents = eventsByDay.get(key) || [];
//     const isCurrent = isToday(day);

//     return (
//       <motion.div layout whileHover={{ scale: 1.02 }} className={`min-h-[110px] p-2 rounded-xl border ${isCurrent ? 'bg-blue-50/30 border-blue-300' : 'bg-white/3 dark:bg-transparent'}`} onClick={() => setSelectedDate(day)}>
//         <div className="flex items-start justify-between">
//           <div className="text-sm font-semibold">{day.date()}</div>
//           <div className="text-xs text-gray-400">{day.format('ddd')}</div>
//         </div>

//         <div className="mt-2 space-y-1">
//           {dayEvents.slice(0, 3).map(ev => (
//             <div key={ev._id} onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }} className={`flex items-center gap-2 truncate px-2 py-1 rounded ${ev.type === 'birthday' ? 'bg-pink-50' : ev.type === 'meeting' ? 'bg-green-50' : ev.type === 'public' ? 'bg-blue-50' : 'bg-gray-50'}`} title={ev.title}>
//               <span className="text-sm">{ev.title}</span>
//               {ev.repeatYearly && <span className="ml-auto text-[10px] px-1 rounded bg-yellow-400/20 text-yellow-700">yr</span>}
//             </div>
//           ))}
//           {dayEvents.length > 3 && (
//             <button onClick={(e) => { e.stopPropagation(); setShowDayEvents(dayEvents); }} className="text-xs text-blue-600 underline">+{dayEvents.length - 3} more</button>
//           )}
//           {dayEvents.length === 0 && (<div className="text-xs text-gray-400">No events</div>)}
//         </div>
//       </motion.div>
//     );
//   };

//   // main layout
//   return (
//     <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

//       {/* Sidebar */}
//       <aside className="hidden lg:block bg-white/5 rounded-2xl p-4 border dark:border-gray-800">
//         <div className="flex items-center justify-between mb-3">
//           <h3 className="font-semibold">Mini Calendar</h3>
//           <button onClick={() => setSelectedDate(dayjs())} className="text-sm text-blue-600">Today</button>
//         </div>
//         {/* MiniCalendar component optional - if not present, keep a simple month grid */}
//         {/*<div className="mb-4">
//           {typeof MiniCalendar !== 'undefined' ? <MiniCalendar currentDate={currentDate} onChange={setCurrentDate} /> : (
//             <div className="text-sm text-gray-500">Mini calendar placeholder</div>
//           )}
//         </div>*/}

//         <div className="mb-4">
//           <h4 className="text-sm font-medium mb-2">Upcoming</h4>
//           <ul className="space-y-2 text-sm">
//             {expandedEvents.slice(0,5).map(ev => (
//               <li key={ev._id} className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">{dayjs(ev.date).format('DD')}</div>
//                 <div className="truncate">
//                   <div className="font-medium truncate">{ev.title}</div>
//                   <div className="text-xs text-gray-400">{dayjs(ev.date).format('DD MMM YYYY')}</div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div>
//           <h4 className="text-sm font-medium mb-2">Filters</h4>
//           <div className="flex flex-col gap-2">
//             {Object.keys(filters).map(k => (
//               <label key={k} className="flex items-center gap-2 text-sm">
//                 <input type="checkbox" checked={filters[k]} onChange={() => setFilters(s => ({ ...s, [k]: !s[k] }))} />
//                 <span className="capitalize">{k}</span>
//               </label>
//             ))}
//           </div>
//         </div>
//       </aside>

//       {/* Main content */}
//       <div className="bg-gradient-to-b from-white/2 dark:from-black/40 to-transparent p-4 rounded-2xl">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <button onClick={prev} className="p-2 rounded hover:bg-gray-100/50"><FaChevronLeft /></button>
//             <div className="text-lg font-semibold">{view === 'month' ? currentDate.format('MMMM YYYY') : view === 'week' ? `${currentDate.startOf('week').format('DD MMM')} - ${currentDate.endOf('week').format('DD MMM YYYY')}` : currentDate.format('dddd, DD MMM YYYY')}</div>
//             <button onClick={next} className="p-2 rounded hover:bg-gray-100/50"><FaChevronRight /></button>
//             <button onClick={goToday} className="ml-3 text-sm text-blue-600">Today</button>
//           </div>

//           <div className="flex items-center gap-3">
//             <FiltersPanel />
//             <ViewToggle />
//             <button onClick={() => { setSelectedDate(dayjs()); setIsCreating(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg shadow"><FaPlus /> Add</button>
//           </div>
//         </div>

//         {/* Grid / view area */}
//         {view === 'month' && (
//           <div className="grid grid-cols-7 gap-3">
//             {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(h => (
//               <div key={h} className="text-xs text-center font-semibold text-gray-500 uppercase">{h}</div>
//             ))}
//             {days.map((d, i) => (
//               <DayCell key={i} day={d} />
//             ))}
//           </div>
//         )}

//         {view === 'week' && (
//           <div className="grid grid-cols-7 gap-3">
//             {days.map((d,i) => (
//               <div key={i} className="p-2 rounded-xl border bg-transparent">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="font-semibold">{d.format('ddd DD')}</div>
//                   <div className="text-xs text-gray-400">{d.format('MM')}</div>
//                 </div>
//                 <div className="space-y-2">
//                   {(eventsByDay.get(formatKey(d)) || []).map(ev => (
//                     <div key={ev._id} onClick={() => setSelectedEvent(ev)} className="p-2 rounded shadow-sm hover:shadow-md cursor-pointer bg-white/5">
//                       <div className="font-medium truncate">{ev.title}</div>
//                       <div className="text-xs text-gray-400">{ev.time || ''}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {view === 'day' && (
//           <div>
//             <div className="mb-3 font-semibold">{currentDate.format('dddd, DD MMM YYYY')}</div>
//             <div className="space-y-3">
//               {(eventsByDay.get(formatKey(currentDate)) || []).map(ev => (
//                 <div key={ev._id} onClick={() => setSelectedEvent(ev)} className="p-3 rounded bg-white/5">
//                   <div className="font-medium">{ev.title}</div>
//                   <div className="text-xs text-gray-400">{ev.time || ''}</div>
//                   <div className="text-sm text-gray-500 mt-1">{ev.description}</div>
//                 </div>
//               ))}
//               {(eventsByDay.get(formatKey(currentDate)) || []).length === 0 && (
//                 <div className="text-gray-400">No events today</div>
//               )}
//             </div>
//           </div>
//         )}

//       </div>

//       {/* Modals (reuse your existing modals) */}
//       {selectedDate && !selectedEvent && (
//         <AddEventModal selectedDate={selectedDate} newEvent={{}} setNewEvent={() => {}} setSelectedDate={setSelectedDate} handleAddEvent={addEvent} isCreating={isCreating} />
//       )}

//       {selectedEvent && (
//         <EventDetailsModal handleUpdateEvent={updateEvent} handleDeleteEvent={deleteEvent} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
//       )}

//       {showDayEvents && (
//         <ShowAllEvents setSelectedEvent={setSelectedEvent} showDayEvents={showDayEvents} setShowDayEvents={setShowDayEvents} />
//       )}

//     </div>
//   );
// }
